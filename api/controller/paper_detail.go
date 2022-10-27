package controller

import (
	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// 筆圧undo使用したpaperを全て取得
func (ctrl Controller) HandleGetPaperDetailsWithPressureUndo(c echo.Context) error {
	var s service.PaperDetailService
	p, err := s.GetPaperDetailsWithPressureUndo(ctrl.Db, c)

	return Res(c, p, err)
}

// 筆圧undo使用してないpaperを全て取得
func (ctrl Controller) HandleGetPaperDetailsWithNotPressureUndo(c echo.Context) error {
	var s service.PaperDetailService
	p, err := s.GetPaperDetailsWithNotPressureUndo(ctrl.Db, c)

	return Res(c, p, err)
}


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