package model

import "time"

type UsePressureUndo struct {
	ID int `gorm:"primary_key;not null;autoIncrement:true"`
	UID int `gorm:"not null;column:uid"`
	PDID int `gorm:"not null;column:pdid"`
	Pressure float64 `gorm:"not null;column:pressure"`
	Count int `gorm:"not null;column:count"`
	CreatedAt time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}