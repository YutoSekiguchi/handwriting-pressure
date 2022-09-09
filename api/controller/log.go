package controller

import (
	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// GET
// pdidを指定してあるページのlog情報を全て取得
func (ctrl Controller) HandleGetLogsByPDID(c echo.Context) error {
	var s service.LogService
	p, err := s.GetLogsByPDID(ctrl.Db, c)

	return Res(c, p, err)
}

// POST
// logの追加
func (ctrl Controller) HandlePostLog(c echo.Context) error {
	var s service.LogService
	p, err := s.PostLog(ctrl.Db, c)

	return Res(c, p, err)
}

// DELETE
// logの削除
func (ctrl Controller) HandleDeleteLog(c echo.Context) error {
	var s service.LogService
	p, err := s.DeleteLog(ctrl.Db, c)

	return Res(c, p, err)
}