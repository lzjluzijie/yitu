package db

import (
	"math/rand"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixMilli())
}

type Item struct {
	Model
	Name   string
	Size   int64
	MD5    string
	SHA256 string
	IP     string

	OneDriveID     string
	OneDriveParent string
	OneDriveURL    string
}

func (db *DB) CreateItem(id, parent, url string, name string, size int64, md5, sha256 string, ip string) (*Item, error) {
	item := &Item{
		Name:           name,
		Size:           size,
		MD5:            md5,
		SHA256:         sha256,
		IP:             ip,
		OneDriveID:     id,
		OneDriveParent: parent,
		OneDriveURL:    url,
	}
	err := db.Create(item).Error
	return item, err
}
