package controller

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/handwriting-pressure/service"
)

// ユーザ一覧の取得
func (ctrl Controller) HandleGetExamUserList(c echo.Context) error {
	var s service.ExamUserService
	p, err := s.GetExamUserList(ctrl.Db)

	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// ユーザの追加
func (ctrl Controller) HandlePostExamUser(c echo.Context) error {
	var s service.ExamUserService
	p, err := s.PostExamUser(ctrl.Db, c)

	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}