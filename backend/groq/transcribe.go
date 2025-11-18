package groq

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"unicode"
)

// Whisper JSON response
type WhisperResponse struct {
	Text     string `json:"text"`
	Segments []struct {
		ID    int     `json:"id"`
		Start float64 `json:"start"`
		End   float64 `json:"end"`
		Text  string  `json:"text"`
	} `json:"segments"`
}

// Convert seconds → SRT timestamp
func formatTimestamp(sec float64) string {
	h := int(sec / 3600)
	m := int(sec/60) % 60
	s := int(sec) % 60
	ms := int((sec - float64(int(sec))) * 1000)

	return fmt.Sprintf("%02d:%02d:%02d,%03d", h, m, s, ms)
}

func sanitizeText(s string) string {
	// Trim leading/trailing whitespace
	s = strings.TrimSpace(s)

	// Remove emojis / unsupported glyphs
	// Keep only characters that libass can reliably render
	var cleaned []rune
	for _, r := range s {
		if r <= unicode.MaxLatin1 || unicode.Is(unicode.Letter, r) || unicode.Is(unicode.Number, r) || unicode.Is(unicode.Punct, r) || unicode.Is(unicode.Space, r) {
			cleaned = append(cleaned, r)
		}
		// emojis, musical notes, symbols → skipped
	}

	return string(cleaned)
}

// Convert JSON → SRT
func jsonToSrt(resp WhisperResponse) string {
	var out bytes.Buffer

	for i, seg := range resp.Segments {
		cleaned := sanitizeText(seg.Text) // <--- MAGIC LINE

		out.WriteString(fmt.Sprintf("%d\n", i+1))
		out.WriteString(fmt.Sprintf(
			"%s --> %s\n%s\n\n",
			formatTimestamp(seg.Start),
			formatTimestamp(seg.End),
			cleaned,
		))
	}

	return out.String()
}

// Send MP3 → Groq Whisper → Create SRT file
func GenerateSRT(mp3Path, outputSrtPath string) error {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("missing GROQ_API_KEY")
	}

	audioFile, err := os.Open(mp3Path)
	if err != nil {
		return fmt.Errorf("failed to open mp3: %v", err)
	}
	defer audioFile.Close()

	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

	// Attach file
	filePart, err := writer.CreateFormFile("file", filepath.Base(mp3Path))
	if err != nil {
		return err
	}
	if _, err := io.Copy(filePart, audioFile); err != nil {
		return err
	}

	// Whisper settings
	writer.WriteField("model", "whisper-large-v3")
	writer.WriteField("response_format", "verbose_json")
	writer.WriteField("temperature", "0")
	writer.WriteField("prompt", "")
	writer.Close()

	req, err := http.NewRequest(
		"POST",
		"https://api.groq.com/openai/v1/audio/transcriptions",
		&buf,
	)
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("groq request failed: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		return fmt.Errorf("groq error (%d): %s", resp.StatusCode, string(body))
	}

	var whisper WhisperResponse
	if err := json.Unmarshal(body, &whisper); err != nil {
		return fmt.Errorf("json decode failed: %v", err)
	}

	// Prevent empty subtitles
	if len(whisper.Segments) == 0 {
		return fmt.Errorf("groq returned no segments — cannot generate SRT")
	}
	srt := jsonToSrt(whisper)

	if err := os.WriteFile(outputSrtPath, []byte(srt), 0644); err != nil {
		return fmt.Errorf("failed to write SRT: %v", err)
	}

	return nil
}
