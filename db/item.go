package db

type Item struct {
	Model
	Name      string
	Size      int64
	MD5       string
	SHA256    string
	IP        string
	ShortCode string `gorm:"unique"`

	OneDriveID     string
	OneDriveParent string
	OneDriveURL    string
}

func (db *DB) CreateItem(id, parent, url string, shortCode, name string, size int64, md5, sha256 string, ip string) (*Item, error) {
	item := &Item{
		ShortCode:      shortCode,
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

func (db *DB) FindItem(shortCode string) (*Item, error) {
	item := &Item{
		ShortCode: shortCode,
	}
	err := db.Where(item).First(item).Error
	if err != nil {
		return nil, err
	}
	return item, nil
}
