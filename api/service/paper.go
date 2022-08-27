package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type PaperService struct {}

// GET
// uidを指定してユーザの全ての紙のグループを取得
func (s PaperService) GetPapersByUID(db *gorm.DB, c echo.Context) ([]Paper, error) {
	var p []Paper
	uid := c.Param("uid")

	if err := db.Raw("SELECT * FROM `papers` WHERE uid = ?", uid).Scan(&p).Error; err != nil {
		return nil, err
	}
	return p, nil
}

// POST
// paperの追加
func (s PaperService) PostPaper(db *gorm.DB, c echo.Context) (Paper, error) {
	var paper Paper
	c.Bind(&paper)

	if err := db.Create(&paper).Error; err != nil {
		return paper, err
	}
	return paper, nil
}