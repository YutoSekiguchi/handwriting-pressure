package controller

import (
	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// GET
// pdidを指定してstrokeを取得
func (ctrl Controller) HandleGetStrokesByPDID(c echo.Context) error {
	var s service.StrokeService
	p, err := s.GetStrokesByPDID(ctrl.Db, c)

	return Res(c, p, err)
}

//POST
// strokeの追加
func (ctrl Controller) HandlePostStroke(c echo.Context) error {
	var s service.StrokeService
	p, err := s.PostStroke(ctrl.Db, c)

	return Res(c, p, err)
}

// DELETE
// strokeの削除
func (ctrl Controller) HandleDeleteStroke(c echo.Context) error {
	var s service.StrokeService
	p, err := s.DeleteStroke(ctrl.Db, c)

	return Res(c, p, err)
}