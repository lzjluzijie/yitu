package onedrive

import (
	"fmt"
	"io"
	"net/http"
)

type Config struct {
	ClientID     string
	ClientSecret string
	AccessToken  string
	RefreshToken string
	RedirectURI  string
}

func (c *Config) NewRequest(method, url string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("bearer %s", c.AccessToken))
	req.Header.Add("User-Agent", "yitu")
	return req, nil
}
