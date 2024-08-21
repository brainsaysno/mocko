package completion

import (
	"apps/backend/config"
	openai "github.com/sashabaranov/go-openai"
)

var completionService *openai.Client

func Init() {
	c := config.GetConfig()
	openaiKey := c.GetString("openai_api_key")

	completionService = openai.NewClient(openaiKey)
}

func GetService() *openai.Client {
	return completionService
}
