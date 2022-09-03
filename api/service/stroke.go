package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type StrokeService struct{}

// GET
func (s StrokeService) GetStrokesByPDID(db *gorm.DB, c echo.Context) ([]Stroke, error) {
	var st []Stroke
	pdid := c.Param("pdid")

	if err := db.Raw("SELECT * FROM `strokes` WHERE pdid = ?", pdid).Scan(&st).Error; err != nil {
		return nil, err
	}
	return st, nil
}

// POST
func (s StrokeService) PostStroke(db *gorm.DB, c echo.Context) (Stroke, error) {
	var stroke Stroke
	c.Bind(&stroke)

	if err := db.Create(&stroke).Error; err != nil {
		return stroke, err
	}
	return stroke, nil
}