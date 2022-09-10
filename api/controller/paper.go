package controller

import (
	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// GET
// 指定したユーザの全てのPapersの取得
func (ctrl Controller) HandleGetPapersByUID(c echo.Context) error {
	var s service.PaperService
	p, err := s.GetPapersByUID(ctrl.Db, c)

	return Res(c, p, err)
}

// POST
// Paperの追加
func (ctrl Controller) HandlePostPaper(c echo.Context) error {
	var s service.PaperService
	p, err := s.PostPaper(ctrl.Db, c)

	return Res(c, p, err)
}

// DELETE
// Paperの削除
func (ctrl Controller) HandleDeletePaper(c echo.Context) error {
	var s service.PaperService
	p, err := s.DeletePaper(ctrl.Db, c)

	return Res(c, p, err)
}