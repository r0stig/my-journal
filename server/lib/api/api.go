package api

import (
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

type API struct {
	logger *zap.SugaredLogger
}

func NewAPI(logger *zap.SugaredLogger) *API {
	return &API{
		logger,
	}
}

func (api API) Start() {
	r := mux.NewRouter()

	h := &handler{
		logger: api.logger,
	}
	r.HandleFunc("/store", h.storeDatabaseHandler)
	//.
	//Methods(http.MethodPut, http.MethodOptions)

	r.Use(mux.CORSMethodMiddleware(r))

	http.Handle("/", r)

	http.ListenAndServe(":8080", nil)
}

func (h handler) storeDatabaseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")
	if r.Method == http.MethodOptions {
		h.logger.Debug("Sending options...")
		return
	}
	h.logger.Debug("not options...")
	file, err := os.Create("./contents.json")
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
