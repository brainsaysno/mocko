package server

import (
	"apps/backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(cors.Default())

	health := new(controllers.HealthController)
	router.GET("/health", health.Status)

	v1 := router.Group("v1")
	{
		mockoGroup := v1.Group("mocko")
		{
			mocko := new(controllers.MockoController)
			mockoGroup.POST("/ai/prose", mocko.GenerateAIProseMocko)
		}

		emailGroup := v1.Group("email")
		{
			email := new(controllers.EmailController)
			emailGroup.POST("", email.SendEmail)
		}
	}
	return router
}
