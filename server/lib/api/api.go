package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	"github.com/r0stig/my-journal/server/lib/users"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret []byte

type API struct {
	logger *zap.SugaredLogger
	storer users.Storer
}

func NewAPI(logger *zap.SugaredLogger) *API {
	jwtSecret = []byte("abc123")
	return &API{
		logger: logger,
		storer: users.NewFileStorer("./users.json", logger),
	}
}

func (api API) Start() {
	r := mux.NewRouter()

	h := &handler{
		logger: api.logger,
		storer: api.storer,
	}
	r.HandleFunc("/login", h.login).Methods(http.MethodPost)
	r.HandleFunc("/store", h.storeDatabaseHandler)
	//.
	//Methods(http.MethodPut, http.MethodOptions)

	r.Use(mux.CORSMethodMiddleware(r))

	http.Handle("/", r)

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("abc123"), bcrypt.DefaultCost)
	fmt.Printf("Hash: %s\n", hashedPassword)
	http.ListenAndServe(fmt.Sprintf(":%s", os.Getenv("PORT")), nil)
}

type LoginResult struct {
	Token string `json:"token"`
}

func (h handler) login(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	fmt.Printf("asdasd username %s pw %s\n", username, password)
	fmt.Printf("Form %v\n", r.PostForm)

	user, err := h.storer.GetUser(username)
	if err != nil && errors.Is(err, users.ErrNotFound) {
		w.WriteHeader(http.StatusForbidden)
		return
	} else if err != nil {
		h.logger.Warnf("Error fetching user: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		h.logger.Warnf("Error signing token: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(LoginResult{
		Token: tokenString,
	})
}

func (h handler) storeDatabaseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")
	if r.Method == http.MethodOptions {
		h.logger.Debug("Sending options...")
		return
	}

	authHeader := r.Header.Get("Authorization")

	token, err := jwt.Parse(authHeader, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return jwtSecret, nil
	})
	if err != nil {
		h.logger.Warnf("Error parsing JWT token: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username := claims["username"]

		if r.Method == http.MethodGet {
			file, err := os.Open(fmt.Sprintf("./%s.json", username))
			if err != nil {
				h.logger.Warnf("Error opening file %v", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			defer file.Close()

			data, err := ioutil.ReadAll(file)
			if err != nil {
				h.logger.Warnf("Error reading file %v", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			w.Write(data)
			w.WriteHeader(http.StatusOK)
		} else {
			file, err := os.Create(fmt.Sprintf("./%s.json", username))
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			defer file.Close()

			data, err := ioutil.ReadAll(r.Body)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			defer r.Body.Close()

			_, err = file.Write(data)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusOK)
		}
	} else {
		w.WriteHeader(http.StatusForbidden)
		return
	}
}
