package server

import (
	"crypto/md5"
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UploadResponse struct {
	ID          string
	ShortCode   string
	OneDriveURL string
}

const ShortCodeLength = 5
const ShortCodeAlphaBet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

func RandomShortCode() string {
	b := make([]byte, 8)
	rand.Read(b)
	n := binary.LittleEndian.Uint64(b)
	s := make([]byte, ShortCodeLength)
	for i := 0; i < ShortCodeLength; i++ {
		s[i] = ShortCodeAlphaBet[n%uint64(len(ShortCodeAlphaBet))]
		n /= ShortCodeLength
	}
	return string(s)
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
		name = "file"
	}

	shortCode := RandomShortCode()
	id, parent, url, err := s.onedrive.UploadAndShare(fmt.Sprintf("/yitu2/0.1/%s/%s", shortCode, name), data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, NewError(err))
		return
	}

	item, err := s.db.CreateItem(id, parent, url, shortCode, name, size, md5Hex, sha256md5Hex, c.ClientIP())
	if err != nil {
		c.JSON(http.StatusInternalServerError, NewError(err))
		return
	}

	c.JSON(http.StatusOK, UploadResponse{
		ID:          item.ID.String(),
		ShortCode:   shortCode,
		OneDriveURL: url,
	})
}
