package controller

import (
	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// POST
func (ctrl Controller) HandlePostUsePressureUndo(c echo.Context) error {
	var s service.UsePressureUndoService
	p, err := s.PostUsePressureUndo(ctrl.Db, c)

	return Res(c, p, err)
}