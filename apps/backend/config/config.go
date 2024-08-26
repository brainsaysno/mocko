package config

import (
	"log"

	"github.com/knadh/koanf/providers/env"
	"github.com/knadh/koanf/v2"
)

var config *koanf.Koanf

func Init() {
	config = koanf.New(".")
	config.Load(env.Provider("", ".", func(s string) string { return s }), nil)
	log.Println(config.All())
}

func GetConfig() *koanf.Koanf {
	return config
}
