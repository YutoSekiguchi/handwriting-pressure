package model

import "time"

type Log struct {
	ID int `gorm:"primary_key;not null;autoIncrement:true"`
	UID int `gorm:"not null;column:uid"`
	PDID int `gorm:"not null;column:pdid"`
	StrokeData string `gorm:"not null;column:stroke_data"`
	Url string `gorm:"not null;column:url"`
	PressureList string `gorm:"not null;column:pressure_list"`
	CreatedAt time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}