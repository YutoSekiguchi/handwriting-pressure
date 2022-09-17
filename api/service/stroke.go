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

// PUT
func (s StrokeService) UpdateStroke(db *gorm.DB, c echo.Context) ([]Stroke, error) {
	var st []Stroke
	pdid := c.Param("pdid")

	
	if err := db.Table("strokes").Where("pdid = ?", pdid).Updates(map[string]interface{}{"save": 1}).Scan(&st).Error; err != nil {
		return nil, err
	}

	return st, nil
}

// DELETE
func (s StrokeService) DeleteStroke(db *gorm.DB, c echo.Context) ([]Stroke, error) {
	var st []Stroke
	pdid := c.Param("pdid")

	if err := db.Where("pdid = ?", pdid).Delete(&st).Error; err != nil {
		return st, err
	}
	return st, nil
}

// 保存してないストロークの削除
func (s StrokeService) DeleteNotSaveStroke(db *gorm.DB, c echo.Context) ([]Stroke, error) {
	var st []Stroke
	pdid := c.Param("pdid")

	if err := db.Where("pdid = ?", pdid).Where("save = 0").Delete(&st).Error; err != nil {
		return st, err
	}
	return st, nil
}