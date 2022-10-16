package model

import "time"

type Log struct {
	ID int `gorm:"primary_key;not null;autoIncrement:true"`
	UID int `gorm:"not null;column:uid"`
	PDID int `gorm:"not null;column:pdid"`
	StrokeData string `gorm:"not null;column:stroke_data"`
	Url string `gorm:"not null;column:url"`
	PressureList string `gorm:"not null;column:pressure_list"`
	IsShowStrokeList string `gorm:"not null;column:is_show_stroke_list"`
	Save int `gorm:"not null;column:save"`
	BoundaryPressure float64 `gorm:"not null;column:boundary_pressure"`
	BoundaryPressureBeforeUndo float64 `gorm:"not null;column:boundary_pressure_before_undo"`
	CreatedAt time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}