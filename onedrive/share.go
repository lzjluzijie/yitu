package onedrive

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type ShareResponse struct {
	ID   string
	Link SharedLink
}

type SharedLink struct {
	Scope  string
	Type   string
	WebURL string
}

func (c *Config) Share(id string) (string, error) {
	req, err := c.NewRequest("POST", fmt.Sprintf("https://graph.microsoft.com/v1.0/me/drive/items/%s/createLink", id), strings.NewReader(`{"type":"view","scope":"anonymous"}`))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	shareResponse := &ShareResponse{}
	err = json.Unmarshal(data, shareResponse)
	if err != nil {
		return "", err
	}

	url := GetDownloadURL(shareResponse.Link.WebURL)
	if url == "" {
		err = errors.New("get download url error")
		return "", err
	}

	return url, nil
}

func GetDownloadURL(url string) string {
	i := strings.Index(url, ":/g")
	if i-3 < 0 || i+3 > len(url) {
		return ""
	}
	url = url[:i-3] + url[i+3:]

	x := strings.LastIndexByte(url, '/')
	w := strings.LastIndexByte(url, '?')

	if x <= 0 {
		return ""
	}

	if x > w {
		return url[:x] + "/_layouts/15/download.aspx?share=" + url[x+1:]
	}

	return url[:x] + "/_layouts/15/download.aspx?share=" + url[x+1:w]
}
