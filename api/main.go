package main

import (
	"github.com/YutoSekiguchi/handwriting-pressure/router"
	"github.com/YutoSekiguchi/handwriting-pressure/util"
)

func main() {
	db := util.InitDb()
	router.InitRouter(db)
}