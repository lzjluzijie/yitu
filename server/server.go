package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lzjluzijie/yitu/db"
	"github.com/lzjluzijie/yitu/onedrive"
	"github.com/rs/cors"
)

type Error struct {
	Err string `json:"error"`
	err error
}

func NewError(err error) *Error {
	return &Error{
		Err: err.Error(),
		err: err,
	}
}

type Server struct {
	db       *db.DB
	handler  http.Handler
	onedrive *onedrive.Config
}

func NewServer(db *db.DB, onedrive *onedrive.Config) *Server {
	r := gin.Default()
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut},
	})
	s := &Server{
		db:       db,
		handler:  c.Handler(r),
		onedrive: onedrive,
	}
	r.PUT("/upload", s.Upload)
	return s
}

func (s *Server) Handler() http.Handler {
	return s.handler
}
