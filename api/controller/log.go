package controller

import (
	"fmt"
	"net/http"

	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// GET
// pdidを指定してあるページのlog情報を全て取得
func (ctrl Controller) HandleGetLogsByPDID(c echo.Context) error {
	var s service.LogService
	p, err := s.GetLogsByPDID(ctrl.Db, c)

	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// POST
// logの追加
func (ctrl Controller) HandlePostLog(c echo.Context) error {
	var s service.LogService
	p, err := s.PostLog(ctrl.Db, c)

	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}