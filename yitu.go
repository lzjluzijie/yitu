package main

import (
	"log"
	"net/http"

	"github.com/lzjluzijie/yitu/config"
	"github.com/lzjluzijie/yitu/db"
	"github.com/lzjluzijie/yitu/server"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	config, err := config.LoadConfig()
	if err != nil {
		panic(err)
	}
	db, err := db.Init(config.DataBase)
	if err != nil {
		panic(err)
	}
	s := server.NewServer(db, config.OneDrive)
	err = http.ListenAndServe("localhost:8080", s.Handler())
	if err != nil {
		panic(err)
	}
}
