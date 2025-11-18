package main

import (
	"log"
	"net/http"
	"os"

	"vibreon-backend/internal/handlers"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env only in local development
	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found, using system environment variables")
	}

	// Allow PORT override for Railway / Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/generate", handlers.GenerateHandler)

	log.Println("Vibreon backend running on :" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
