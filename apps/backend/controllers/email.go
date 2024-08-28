package controllers

import (
	"apps/backend/config"
	"log"
	"net/http"
	"net/smtp"

	"github.com/gin-gonic/gin"
)

type EmailController struct{}

type EmailBody struct {
	Recipient string `json:"recipient"`
	Content   string `json:"content"`
}

func (e EmailController) SendEmail(c *gin.Context) {
	conf := config.GetConfig()

	emailFrom := conf.Get("EMAIL_FROM").(string)
	emailPassword := conf.Get("EMAIL_PASSWORD").(string)
	emailServer := conf.Get("EMAIL_SERVER").(string)
	emailPort := conf.Get("EMAIL_PORT").(string)

	var requestBody EmailBody

	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set up authentication information.
	auth := smtp.PlainAuth("", emailFrom, emailPassword, emailServer)

	// Connect to the server, authenticate, set the sender and recipient,
	// and send the email all in one step.
	to := []string{requestBody.Recipient}
	msg := []byte("To: " + requestBody.Recipient + "\r\n" + requestBody.Content)
	err := smtp.SendMail(emailServer+":"+emailPort, auth, emailFrom, to, msg)
	if err != nil {
		log.Fatal(err)
	}
}
