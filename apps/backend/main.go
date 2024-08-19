package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	openai "github.com/sashabaranov/go-openai"
)

type AIProseBody struct {
	Prompt string `json:"prompt"`
}

type EmailBody struct {
	Recipient string `json:"recipient"`
	Content   string `json:"content"`
}

func main() {
	key, openaiKeyFound := os.LookupEnv("OPENAI_API_KEY")

	if !openaiKeyFound {
		panic("OPENAI_API_KEY must be set")
	}

	client := openai.NewClient(key)

	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/ai-prose", func(c *gin.Context) {
		fmt.Println("Generating AI prose Mocko...")

		var requestBody AIProseBody

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, _ := client.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model: "gpt-4o-mini",
				Messages: []openai.ChatCompletionMessage{
					{
						Role: "system",
						Content: `I want you to act as an advanced mock data generator designed to help developers create realistic, varied, and customizable datasets for testing and development purposes. Your task is to generate mock data based on the user's input, ensuring that the data fits specific criteria or requirements as described. The data should be diverse, realistic, and appropriate for use in various development scenarios. You can generate data in different formats like JSON, CSV, or plain text, and support a wide range of data types, including but not limited to:
- Personal Information: Names, addresses, emails, phone numbers.
- Financial Data: Credit card numbers, bank account information, transactions.
- Compnay Information: Company names, industry types, employee details.
- Product Information: Product names, descriptions, prices, SKUs.
- Dates and Times: Historical dates, future dates, timestamps.
- Geographical Data: Cities, countries, coordinates, postal codes.
- Custom Data: User-defined data structures with specific fields and constraints.
You should be able to create data that matches specific conditions, such as a range of numbers, certain string patterns, or valid formats for specific data types.
You will be provided with a description of what needs to be generated, and based on that, you will create the appropriate mock data. You must just provide the raw data in plain text, don't add any extra explanations or markdown notation. Do not add any placeholders, you must fill all the details with fake data.`,
					},
					{
						Role:    "user",
						Content: requestBody.Prompt,
					},
				},
			},
		)

		c.JSON(http.StatusOK, gin.H{
			"mock": resp.Choices[0].Message.Content,
		})
	})

	r.POST("/email", func(c *gin.Context) {
		var requestBody EmailBody

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Set up authentication information.
		auth := smtp.PlainAuth("", "nrusso@nrusso.dev", "nxuz rgrc eqnh xssx", "smtp.gmail.com")

		// Connect to the server, authenticate, set the sender and recipient,
		// and send the email all in one step.
		to := []string{requestBody.Recipient}
		msg := []byte("To: nrusso@nrusso.dev\r\n" + requestBody.Content)
		err := smtp.SendMail("smtp.gmail.com:25", auth, "nrusso@nrusso.dev", to, msg)
		if err != nil {
			log.Fatal(err)
		}
	})

	r.Run()
}
