package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) Redirect(c *gin.Context) {
	shortCode := c.Param("shortCode")
	item, err := s.db.FindItem(shortCode)
	if err != nil {
		c.JSON(http.StatusBadRequest, NewError(err))
		return
	}
	c.Redirect(http.StatusTemporaryRedirect, item.OneDriveURL)
}
