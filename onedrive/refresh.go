package onedrive

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
)

type RefreshResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func (c *Config) Refresh() error {
	v := url.Values{
		"client_id":     {c.ClientID},
		"client_secret": {c.ClientSecret},
		"redirect_uri":  {c.RedirectURI},
		"grant_type":    {"refresh_token"},
		"refresh_token": {c.RefreshToken},
	}

	resp, err := http.PostForm("https://login.microsoftonline.com/common/oauth2/v2.0/token", v)
	if err != nil {
		return err
	}

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	refreshResponse := &RefreshResponse{}
	err = json.Unmarshal(data, refreshResponse)
	if err != nil {
		return err
	}

	c.AccessToken = refreshResponse.AccessToken
	c.RefreshToken = refreshResponse.RefreshToken
	return nil
}
