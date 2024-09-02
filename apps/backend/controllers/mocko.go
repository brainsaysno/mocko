package controllers

import (
	"apps/backend/services/completion"
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
)

type MockoController struct{}

type AIProseBody struct {
	Prompt  string `json:"prompt" binding:"required"`
	Example string `json:"example"`
}

const aiProseMockoSystemPrompt = `I want you to act as an advanced mock data generator designed to help developers create realistic, varied, and customizable datasets for testing and development purposes. Your task is to generate mock data based on the user's input, ensuring that the data fits specific criteria or requirements as described. The data should be diverse, realistic, and appropriate for use in various development scenarios. You can generate data in different formats like JSON, CSV, or plain text, and support a wide range of data types, including but not limited to:
- Personal Information: Names, addresses, emails, phone numbers.
- Financial Data: Credit card numbers, bank account information, transactions.
- Compnay Information: Company names, industry types, employee details.
- Product Information: Product names, descriptions, prices, SKUs.
- Dates and Times: Historical dates, future dates, timestamps.
- Geographical Data: Cities, countries, coordinates, postal codes.
- Custom Data: User-defined data structures with specific fields and constraints.
You should be able to create data that matches specific conditions, such as a range of numbers, certain string patterns, or valid formats for specific data types.
You will be provided with a description of what needs to be generated, and based on that, you will create the appropriate mock data. You must just provide the raw data in plain text, don't add any extra explanations or markdown notation. Do not add any placeholders, you must fill all the details with fake data.`

func (m MockoController) GenerateAIProseMocko(c *gin.Context) {
	var completionService = completion.GetService()

	var requestBody AIProseBody

	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	const model = "gpt-4o-mini"

	prompt := requestBody.Prompt
	if requestBody.Example != "" {
		prompt += "\n\nExample:\n" + requestBody.Example
	}

	resp, completionErr := completionService.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: model,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    "system",
					Content: aiProseMockoSystemPrompt,
				},
				{
					Role:    "user",
					Content: prompt,
				},
			},
		},
	)

	if completionErr != nil {
		log.Println(completionErr)
		c.Err()
	}

	c.JSON(http.StatusOK, gin.H{
		"mock": resp.Choices[0].Message.Content,
	})
}
