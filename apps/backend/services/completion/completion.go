package completion

import (
	"apps/backend/config"
	"log"

	openai "github.com/sashabaranov/go-openai"
)

var completionService *openai.Client

func Init() {
	c := config.GetConfig()
	openaiKey := c.Get("OPENAI_API_KEY").(string)

	log.Println("Testing:")
	log.Println(c.All())

	completionService = openai.NewClient(openaiKey)
}

func GetService() *openai.Client {
	return completionService
}
