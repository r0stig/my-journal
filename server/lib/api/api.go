package api

import (
	"net/http"
	"os"

	"io/ioutil"

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

	h := &handler{}
	r.HandleFunc("/store", h.storeDatabaseHandler).
		Methods("PUT")

	http.Handle("/", r)

	http.ListenAndServe(":8080", nil)
}

func (h handler) storeDatabaseHandler(w http.ResponseWriter, r *http.Request) {
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
