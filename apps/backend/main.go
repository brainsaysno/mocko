package main

import (
	"apps/backend/config"
	"apps/backend/server"
	"apps/backend/services/completion"
)

func main() {
	config.Init()

	completion.Init()

	server.Init()
}
