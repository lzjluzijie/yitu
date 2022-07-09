package config

import (
	"encoding/json"
	"github.com/lzjluzijie/yitu/onedrive"
	"io/ioutil"
)

type Config struct {
	DataBase string
	Addr     string
	OneDrive *onedrive.Config
}

func LoadConfig() (*Config, error) {
	config := new(Config)
	data, err := ioutil.ReadFile("config/dev.json")
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(data, config)
	if err != nil {
		return nil, err
	}
	return config, nil
}
