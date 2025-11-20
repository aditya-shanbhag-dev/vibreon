package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os/exec"

	"github.com/kkdai/youtube/v2"
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

	log.Println("Extracting audio from YouTube:", body.URL)

	client := youtube.Client{}

	video, err := client.GetVideo(body.URL)
	if err != nil {
		log.Println("YouTube fetch error:", err)
		http.Error(w, "Failed to fetch YouTube video", http.StatusInternalServerError)
		return
	}

	// Correct way: choose *any* format with audio channels
	var format *youtube.Format
	audioFormats := video.Formats.WithAudioChannels()

	if len(audioFormats) == 0 {
		http.Error(w, "No audio stream available", http.StatusInternalServerError)
		return
	}

	// Pick the highest bitrate audio
	format = &audioFormats[0]
	for i := range audioFormats {
		if audioFormats[i].Bitrate > format.Bitrate {
			format = &audioFormats[i]
		}
	}

	log.Println("Selected audio format:", format.MimeType, format.Bitrate)

	// Download the stream
	stream, _, err := client.GetStream(video, format)
	if err != nil {
		log.Println("Stream error:", err)
		http.Error(w, "Failed to download audio stream", http.StatusInternalServerError)
		return
	}

	// Send stream to FFmpeg → convert → mp3
	var mp3 bytes.Buffer

	cmd := exec.Command("ffmpeg",
		"-i", "pipe:0",
		"-vn",
		"-acodec", "libmp3lame",
		"-b:a", "192k",
		"-f", "mp3",
		"pipe:1",
	)

	cmd.Stdout = &mp3
	cmd.Stderr = io.Discard

	stdin, _ := cmd.StdinPipe()

	go func() {
		io.Copy(stdin, stream)
		stdin.Close()
	}()

	if err := cmd.Run(); err != nil {
		log.Println("FFmpeg error:", err)
		http.Error(w, "Failed to convert to MP3", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "audio/mpeg")
	w.WriteHeader(http.StatusOK)
	w.Write(mp3.Bytes())
}
