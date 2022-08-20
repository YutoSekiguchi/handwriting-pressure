package router

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"

	"github.com/YutoSekiguchi/handwriting-pressure/controller"
)

func InitRouter(db *gorm.DB) {
	e := echo.New()

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri={uri}, status=${status}\n",
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "https://vps7.nkmr.io", "http://localhost:7150"},
		AllowHeaders: []string{echo.HeaderAuthorization, echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	ctrl := controller.NewController(db)

	// ExamUser
	examUser := e.Group("/examusers")
	{
		examUser.GET("", ctrl.HandleGetExamUserList)
		examUser.POST("", ctrl.HandlePostExamUser)
	}

	// Routing
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Echo!!")
	})
	
	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}