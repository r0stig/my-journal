package main

import (
	"log"

	"github.com/r0stig/my-journal/server/lib/api"
)

func main() {
	logger, err := createLogger()
	if err != nil {
		log.Fatalf("Could not start logger")
	}
	defer logger.Sync()

	api := api.NewAPI(logger)

	api.Start()
}
