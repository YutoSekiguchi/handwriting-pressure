package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ExamUserService struct{}

// GET
// ユーザを全て取得
func (s ExamUserService) GetExamUserList(db *gorm.DB) ([]ExamUser, error) {
	var u []ExamUser

	if err := db.Find(&u).Error; err != nil {
		return nil, err
	}
	return u, nil
}

// POST
// ユーザ追加
func (s ExamUserService) PostExamUser(db *gorm.DB, c echo.Context) (ExamUser, error) {
	var examUser ExamUser
	c.Bind(&examUser)

	if err := db.Create(&examUser).Error; err != nil {
		return examUser, err
	}
	return examUser, nil
}