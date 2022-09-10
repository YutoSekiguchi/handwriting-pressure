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

type PaperDetailID struct {
	ID int `gorm:"column:id"`
}

// DELETE
// paperの削除
func (s PaperService) DeletePaper(db *gorm.DB, c echo.Context) ([]Paper, error) {
	var p []Paper
	var pdidList []PaperDetailID
	var pd []PaperDetail
	var log []Log
	var stroke []Stroke
	var error error
	error = nil
	id := c.Param("id")

	if err := db.Where("id = ?", id).Delete(&p).Error; err != nil {
		return nil, err
	}
	if err := db.Raw("SELECT paper_details.id FROM `paper_details` WHERE pid = ?", id).Scan(&pdidList).Error; err != nil {
		return nil, err
	}
	for i := 0; i < len(pdidList); i++ {
		pdid := pdidList[i].ID

		go func() {
			if err := db.Where("id = ?", pdid).Delete(&pd).Error; err != nil {
				error = err
			}
		}()

		go func() {
			if err := db.Where("pdid = ?", pdid).Delete(&stroke).Error; err != nil {
				error = err
			}
		}()

		go func() {
			if err := db.Where("pdid = ?", pdid).Delete(&log).Error; err != nil {
				error = err
			}
		}()
	}
	if (error != nil) {
		return nil, error
	}
	return p, nil
}