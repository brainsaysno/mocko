package main

import (
	"apps/backend/config"
	"apps/backend/server"
	"apps/backend/services/completion"
	"flag"
	"fmt"
	"os"
)

func main() {
	environment := flag.String("e", "development", "")

	flag.Usage = func() {
		fmt.Println("Usage: server -e {mode}")
		os.Exit(1)
	}
	flag.Parse()

	config.Init(*environment)

	completion.Init()

	server.Init()
}
