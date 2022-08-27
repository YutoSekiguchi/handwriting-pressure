package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type PaperDetailService struct{}

// GET
// pidを指定して同じグループに部類されてるpaperを取得
func (s PaperDetailService) GetPaperDetailByPID(db *gorm.DB, c echo.Context) ([]PaperDetail, error) {
	var pd []PaperDetail
	pid := c.Param("pid")

	if err := db.Raw("SELECT * FROM `paper_detail` WHERE pid = ?", pid).Scan(&pd).Error; err != nil {
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