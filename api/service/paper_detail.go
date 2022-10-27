package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type PaperDetailService struct{}

// GET
// 筆圧Undo使用したPaperを全て取得
func (s PaperDetailService) GetPaperDetailsWithPressureUndo(db *gorm.DB, c echo.Context) (*PaperDetail, error) {
	pd := new(PaperDetail)

	if err := db.Raw("SELECT * FROM `paper_details` WHERE title NOT LIKE '%_no'").Scan(&pd).Error; err != nil {
		return nil, err
	}
	return pd, nil
}

// 筆圧Undo使用してないPaperを全て取得
func (s PaperDetailService) GetPaperDetailsWithNotPressureUndo(db *gorm.DB, c echo.Context) (*PaperDetail, error) {
	pd := new(PaperDetail)

	if err := db.Raw("SELECT * FROM `paper_details` WHERE title LIKE '%_no'").Scan(&pd).Error; err != nil {
		return nil, err
	}
	return pd, nil
}


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

// DELETE
func (s PaperDetailService) DeletePaperDetail(db *gorm.DB, c echo.Context) ([]PaperDetail, error) {
	var pd []PaperDetail
	var stroke []Stroke
	var log []Log
	id := c.Param("id")

	if err := db.Where("id = ?", id).Delete(&pd).Error; err != nil {
		return nil, err
	}
	if err := db.Where("pdid = ?", id).Delete(&stroke).Error; err != nil {
		return nil, err
	}
	if err := db.Where("pdid = ?", id).Delete(&log).Error; err != nil {
		return nil, err
	}
	return pd, nil
}