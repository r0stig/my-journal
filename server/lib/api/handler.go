package api

import (
	"github.com/r0stig/my-journal/server/lib/users"
	"go.uber.org/zap"
)

type handler struct {
	logger *zap.SugaredLogger
	storer users.Storer
}
