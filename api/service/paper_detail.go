package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type PaperDetailService struct{}

// GET
// idを指定してpaperを取得
func (s PaperDetailService) GetPaperDetailByID(db *gorm.DB, c echo.Context) (*PaperDetail, error) {
	pd := new(PaperDetail)
	id := c.Param("id")

	if err := db.Raw("SELECT * FROM `paper_details` WHERE id = ?", id).Scan(&pd).Error; err != nil {
		return nil, err
	}
	return pd, nil
}

// pidを指定して同じグループに部類されてるpaperを取得
func (s PaperDetailService) GetPaperDetailByPID(db *gorm.DB, c echo.Context) ([]PaperDetail, error) {
	var pd []PaperDetail
	pid := c.Param("pid")

	if err := db.Raw("SELECT * FROM `paper_details` WHERE pid = ?", pid).Scan(&pd).Error; err != nil {
		return nil, err
	}
	return pd, nil
}

// POST
func (s PaperDetailService) PostPaperDetail(db *gorm.DB, c echo.Context) (PaperDetail, error) {
	var pd PaperDetail
	c.Bind(&pd)

	if err := db.Create(&pd).Error; err != nil {
		return pd, err
	}
	return pd, nil
}

// PUT
func (s PaperDetailService) UpdatePaperDetail(db *gorm.DB, c echo.Context) (*PaperDetail, error) {
	pd := new(PaperDetail)
	id := c.Param("id")

	if err := db.Where("id = ?", id).First(&pd).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&pd); err != nil {
		return nil, err
	}
	db.Save(&pd)

	return pd, nil
}