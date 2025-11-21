package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os/exec"
)

type YTExtractRequest struct {
	URL string `json:"url"`
}

func YTExtractHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var body YTExtractRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if body.URL == "" {
		http.Error(w, "url is required", http.StatusBadRequest)
		return
	}

	log.Println("Extracting audio with yt-dlp from YouTube:", body.URL)

	// Command to execute yt-dlp:
	// -f 'bestaudio': Selects the best audio format.
	// -o -: Outputs the raw MP3 data to stdout.
	cmd := exec.Command("yt-dlp",
		"-f", "bestaudio",
		"--extract-audio",
		"--audio-format", "mp3",
		"--audio-quality", "192K",
		"-o", "-",
		body.URL,
	)

	// Set up stdout to pipe directly to the HTTP response writer
	cmd.Stdout = w

	// Set up stderr for debugging logs. We discard it unless an error occurs.
	stderr, err := cmd.StderrPipe()
	if err != nil {
		log.Println("Error setting up StderrPipe:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Set the Content-Type header BEFORE starting the command.
	w.Header().Set("Content-Type", "audio/mpeg")
	w.WriteHeader(http.StatusOK)

	// Start the command
	if err := cmd.Start(); err != nil {
		log.Println("yt-dlp start error:", err)
		http.Error(w, "Failed to start audio extraction process", http.StatusInternalServerError)
		return
	}

	// Wait for the command to finish. If it fails, read the error message from stderr.
	if err := cmd.Wait(); err != nil {
		errorOutput, _ := io.ReadAll(stderr)
		log.Printf("yt-dlp execution error: %v. Stderr: %s\n", err, errorOutput)
		// We can't change the status code (already written 200), but we log the failure.
		// The client will get a truncated/empty file, which is handled by the Next.js side.
		return
	}

	log.Println("Audio extraction complete.")
}
