package model

import "time"

type PaperDetail struct {
	ID              int       `gorm:"primary_key;not null;autoIncrement:true"`
	PID             int       `gorm:"not null;column:pid"`
	UID             int       `gorm:"not null;column:uid"`
	Title           string    `gorm:"not null;column:title"`
	PaperWidth      int       `gorm:"not null;column:paper_width"`
	PaperHeight     int       `gorm:"not null;column:paper_height"`
	PaperImage      string    `gorm:"not null;column:paper_image"`
	PressureList    string    `gorm:"not null;column:pressure_list"`
	BackgroundImage string    `gorm:"not null;column:background_image"`
	CreatedAt       time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}