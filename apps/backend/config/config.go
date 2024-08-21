package config

import (
	"log"
	"path/filepath"

	"github.com/spf13/viper"
)

var config *viper.Viper

func Init(env string) {
	var err error

	config = viper.New()
	config.SetConfigType("env")
	config.AddConfigPath(".")
	config.SetConfigName(env)
	err = config.ReadInConfig()
	if err != nil {
		log.Println(err)

		log.Fatal("error on parsing env configuration file")
	}
}

func relativePath(basedir string, path *string) {
	p := *path
	if len(p) > 0 && p[0] != '/' {
		*path = filepath.Join(basedir, p)
	}
}

func GetConfig() *viper.Viper {
	return config
}
