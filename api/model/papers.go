package model

import "time"

type Paper struct {
	ID int `gorm:"primary_key;not null;autoIncrement:true"`
	UID int `gorm:"not null;column:uid"`
	Name string `gorm:"not null;column:name"`
	CreatedAt time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}