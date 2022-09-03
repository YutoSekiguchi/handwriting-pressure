package model

import "time"

type Stroke struct {
	ID int `gorm:"primary_key;not null;autoIncrement:true"`
	UID int `gorm:"not null;column:uid"`
	PDID int `gorm:"not null;column:pdid"`
	Detail string `gorm:"not null;column:detail"`
	AvgPressure float64 `gorm:"not null;column:avg_pressure"`
	PressureList string `gorm:"not null;column:pressure_list"`
	Time float64 `gorm:"not null;column:time"`
	CreatedAt time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}