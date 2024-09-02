package server

import (
	"apps/backend/config"
	"apps/backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	c := config.GetConfig()

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	corsConfig := cors.DefaultConfig()

	if c.Get("APP_ENV") == "development" {
		corsConfig.AllowAllOrigins = true
	} else {
		corsConfig.AllowOrigins = []string{"https://mocko.nrusso.dev"}
	}

	router.Use(cors.New(corsConfig))

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
