# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
BINARY_NAME=my-journal-server
BINARY_UNIX=$(BINARY_NAME)_unix


.PHONY: all
all: test build

.PHONY: build
build:
	$(GOBUILD) -o $(BINARY_NAME) -v

.PHONY: test
test:
	$(GOTEST) -v ./...

.PHONY: test-coverage
test-coverage:
	$(GOTEST) -v ./... -coverprofile=coverage.out
	$(GOCMD) tool cover -html=coverage.out

.PHONY: clean
clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)

.PHONY: run
run:
	# docker-compose -f docker-compose-dev.yml up --build
	$(GOCMD) run main.go logging.go

.PHONY: deploy-dev
deploy-dev:
	$(GOTEST) -v ./... && ./update_service.sh dev

.PHONY: deploy-prod
deploy-prod:
	$(GOTEST) -v ./... && ./update_service.sh prod

.PHONY: format
format:
	$(GOCMD) fmt ./...

.PHONE: genmocks
genmocks:
	~/go/bin/mockgen -destination=mocks/mock_datastore.go -package=mocks github.com/imbox/gamification-service/lib/datastore Datastore
	~/go/bin/mockgen -destination=mocks/mock_auth.go -package=mocks github.com/imbox/gamification-service/lib/auth TokenValidator
