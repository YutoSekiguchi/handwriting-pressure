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
		examUser.GET("/me", ctrl.HandleGetExamUserByNameAndPwd)
		examUser.GET("/:id", ctrl.HandleGetExamUserByID)
		examUser.POST("", ctrl.HandlePostExamUser)
	}

	// Paper
	paper := e.Group("/papers")
	{
		paper.GET("/list/:uid", ctrl.HandleGetPapersByUID)
		paper.POST("", ctrl.HandlePostPaper)
		paper.DELETE("/:id", ctrl.HandleDeletePaper)
	}

	// PaperDetail
	paper_detail := e.Group("/paper-details")
	{
		paper_detail.GET("/:id", ctrl.HandleGetPaperDetailByID)
		paper_detail.GET("/list/:pid/folder", ctrl.HandleGetPaperDetailsByPID)
		paper_detail.POST("", ctrl.HandlePostPaperDetail)
		paper_detail.PUT("/:id", ctrl.HandleUpdatePaperDetail)
		paper_detail.DELETE("/:id", ctrl.HandleDeletePaperDetail)
	}

	// Stroke
	stroke := e.Group("/strokes")
	{
		stroke.GET("/paper/:pdid", ctrl.HandleGetStrokesByPDID)
		stroke.POST("", ctrl.HandlePostStroke)
		stroke.DELETE("/:pdid", ctrl.HandleDeleteStroke)
	}

	// Log
	log := e.Group("/logs")
	{
		log.GET("/paper/:pdid", ctrl.HandleGetLogsByPDID)
		log.POST("", ctrl.HandlePostLog)
		log.DELETE("/:pdid", ctrl.HandleDeleteLog)
	}

	// Routing
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Echo!!")
	})
	
	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}