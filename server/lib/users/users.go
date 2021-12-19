package users

import (
	"encoding/json"
	"fmt"
	"os"

	"go.uber.org/zap"
)

type UserEntry struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Users struct {
	Credentials []UserEntry `json:"credentials"`
}

type Storer interface {
	GetUser(username string) (UserEntry, error)
}

type FileStorer struct {
	filename string
	logger   *zap.SugaredLogger
}

func NewFileStorer(filename string, logger *zap.SugaredLogger) Storer {
	return FileStorer{
		filename,
		logger,
	}
}

func (f FileStorer) GetUser(username string) (UserEntry, error) {
	var userEntry UserEntry
	file, err := os.Open(f.filename)
	if err != nil {
		return userEntry, fmt.Errorf("Error opening file %v", err)
	}
	defer file.Close()

	var users Users
	err = json.NewDecoder(file).Decode(&users)
	if err != nil {
		return userEntry, fmt.Errorf("Error decoding JSNO: %v", err)
	}

	for _, user := range users.Credentials {
		if user.Username == username {
			return user, nil
		}
	}
	return userEntry, nil
}
