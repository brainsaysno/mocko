package controllers

import (
	"apps/backend/config"
	"log"
	"net/http"
	"net/smtp"
	"strings"

	"github.com/gin-gonic/gin"
)

type EmailController struct{}

type EmailBody struct {
	Recipient string `json:"recipient"`
	Content   string `json:"content"`
}

func addTopDisclaimer(body string, disclaimer string) string {
	if strings.HasPrefix(body, "Subject: ") {
		splits := strings.SplitN(body, "\n\n", 2)
		return splits[0] + "\n\n" + disclaimer + "\r\n\r\n" + splits[1]
	}

	return disclaimer + "\r\n\r\n" + body
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

	auth := smtp.PlainAuth("", emailFrom, emailPassword, emailServer)

	disclaimer := "[THIS IS AN AUTOMATED MESSAGE]"

	body := addTopDisclaimer(requestBody.Content, disclaimer)

	to := []string{requestBody.Recipient}
	msg := []byte("To: " + requestBody.Recipient + "\r\n" + body + "\r\n\r\n" + disclaimer)
	err := smtp.SendMail(emailServer+":"+emailPort, auth, emailFrom, to, msg)
	if err != nil {
		log.Fatal(err)
	}
}
