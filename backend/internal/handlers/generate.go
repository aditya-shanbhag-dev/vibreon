package handlers

import (
	"encoding/json"
	"net/http"
	"vibreon-backend/internal/ffmpeg"
	"vibreon-backend/internal/models"
)

func GenerateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	var payload models.GeneratePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	outputURL, err := ffmpeg.ProcessWithFFmpeg(payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"status":   "success",
		"videoUrl": outputURL,
	})
}
