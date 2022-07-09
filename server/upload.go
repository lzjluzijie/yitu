package server

import (
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UploadResponse struct {
	ID          string `json:"id"`
	Parent      string `json:"parent"`
	OneDriveURL string `json:"url"`
}

func (s *Server) Upload(c *gin.Context) {
	data, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, NewError(err))
		return
	}
	size := int64(len(data))
	md5Hash := md5.Sum(data)
	md5Hex := hex.EncodeToString(md5Hash[:])
	sha256Hash := sha256.Sum256(data)
	sha256md5Hex := hex.EncodeToString(sha256Hash[:])
	name := c.Request.Header.Get("X-Yitu-Filename")
	if name == "" {
		name = "test"
	}

	id, parent, url, err := s.onedrive.UploadAndShare("/yitu2/0.1/"+name, data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, NewError(err))
		return
	}

	item, err := s.db.CreateItem(id, parent, url, name, size, md5Hex, sha256md5Hex, c.ClientIP())
	if err != nil {
		c.JSON(http.StatusInternalServerError, NewError(err))
		return
	}

	c.JSON(http.StatusOK, UploadResponse{
		ID:          item.OneDriveID,
		Parent:      parent,
		OneDriveURL: url,
	})
}
