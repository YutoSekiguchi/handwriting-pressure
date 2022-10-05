package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type UsePressureUndoService struct {}

// POST
// use_pressure_undoの追加
func (s UsePressureUndoService) PostUsePressureUndo(db *gorm.DB, c echo.Context) (UsePressureUndo, error) {
	var upr UsePressureUndo;
	c.Bind(&upr)

	if err := db.Create(&upr).Error; err != nil {
		return upr, err
	}
	return upr, nil
}