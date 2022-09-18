package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type LogService struct{}

// GET
func (s LogService) GetLogsByPDID(db *gorm.DB, c echo.Context) ([]Log, error) {
	var l []Log
	pdid := c.Param("pdid")

	if err := db.Raw("SELECT * FROM `logs` WHERE pdid = ?", pdid).Scan(&l).Error; err != nil {
		return nil, err
	}
	return l, nil
}

// POST
func (s LogService) PostLog(db *gorm.DB, c echo.Context) (Log, error) {
	var log Log
	c.Bind(&log)

	if err := db.Create(&log).Error; err != nil {
		return log, err
	}
	return log, nil
}

// PUT
func (s LogService) UpdateLogs(db *gorm.DB, c echo.Context) ([]Log, error) {
	var l []Log
	pdid := c.Param("pdid")

	if err := db.Table("logs").Where("pdid = ?", pdid).Updates(map[string]interface{}{"save": 1}).Scan(&l).Error; err != nil {
		return nil, err
	}
	return l, nil
}

// DELETE
func (s LogService) DeleteLog(db *gorm.DB, c echo.Context) ([]Log, error) {
	var l []Log
	pdid := c.Param("pdid")

	if err := db.Where("pdid = ?", pdid).Delete(&l).Error; err != nil {
		return l, err
	}
	return l, nil
}

// 保存してないlogの削除
func (s LogService) DeleteNotSaveLogs(db *gorm.DB, c echo.Context) ([]Log, error) {
	var l []Log
	pdid := c.Param("pdid")

	if err := db.Where("pdid = ?", pdid).Where("save = 0").Delete(&l).Error; err != nil {
		return l, err
	}
	return l, nil
}