package controller

import (
	"fmt"
	"net/http"

	"github.com/YutoSekiguchi/handwriting-pressure/service"
	"github.com/labstack/echo/v4"
)

// GET
// 指定したユーザの全てのPapersの取得
func (ctrl Controller) HandleGetPapersByUID(c echo.Context) error {
	var s service.PaperService
	p, err := s.GetPapersByUID(ctrl.Db, c)

	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// POST
// Paperの追加
func (ctrl Controller) HandlePostPaper(c echo.Context) error {
	var s service.PaperService
	p, err := s.PostPaper(ctrl.Db, c)

	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}