package controller

import (
	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// idを指定してpaperの取得
func (ctrl Controller) HandleGetPaperDetailByID(c echo.Context) error {
	var s service.PaperDetailService
	p, err := s.GetPaperDetailByID(ctrl.Db, c)

	return Res(c, p, err)
}

// pidを指定してそのpapersに入ってるノートの情報の取得
func (ctrl Controller) HandleGetPaperDetailsByPID(c echo.Context) error {
	var s service.PaperDetailService
	p, err := s.GetPaperDetailByPID(ctrl.Db, c)

	return Res(c, p, err)
}

// paper_detailの追加
func (ctrl Controller) HandlePostPaperDetail(c echo.Context) error {
	var s service.PaperDetailService
	p, err := s.PostPaperDetail(ctrl.Db, c)

	return Res(c, p, err)
}

// paepr_detailの変更
func (ctrl Controller) HandleUpdatePaperDetail(c echo.Context) error {
	var s service.PaperDetailService
	p, err := s.UpdatePaperDetail(ctrl.Db, c)

	return Res(c, p, err)
}

// paper_detalの削除
func (ctrl Controller) HandleDeletePaperDetail(c echo.Context) error {
	var s service.PaperDetailService
	p, err := s.DeletePaperDetail(ctrl.Db, c)

	return Res(c, p, err)
}