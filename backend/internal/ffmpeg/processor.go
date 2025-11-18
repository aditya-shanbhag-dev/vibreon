package ffmpeg

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"time"
	"vibreon-backend/groq"
	"vibreon-backend/internal/cloudinary"
	"vibreon-backend/internal/models"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type FFmpegInput struct {
	AudioPath string
	VideoPath string
	SrtPath   string // empty if no subtitles
	Output    string
}

func downloadFile(url, filename string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

func RunFFmpeg(input FFmpegInput) error {
	args := []string{
		"-y",
		"-stream_loop", "-1", // loop video infinitely
		"-i", input.VideoPath, // video
		"-i", input.AudioPath, // audio
		"-shortest", // stop when audio ends
	}

	// Burn subtitles if provided
	if input.SrtPath != "" {
		args = append(args,
			"-vf",
			fmt.Sprintf(
				"subtitles='%s':force_style='FontName=Helvetica Neue,FontSize=16,Outline=1,Shadow=0,MarginV=20'",
				input.SrtPath,
			),
		)
	}

	// Encoding settings
	args = append(args,
		"-c:v", "libx264",
		"-preset", "veryfast",
		"-crf", "18",

		"-c:a", "aac",
		"-b:a", "192k",

		"-map", "0:v:0",
		"-map", "1:a:0",

		input.Output,
	)

	fmt.Println("Running FFmpeg:", args)

	cmd := exec.Command("ffmpeg", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}

func ProcessWithFFmpeg(payload models.GeneratePayload) (string, error) {

	timestamp := fmt.Sprintf("%d", time.Now().Unix())

	audioFile := "audio_" + timestamp + ".mp3"
	videoFile := "video_" + timestamp + ".mp4"
	srtFile := "subs_" + timestamp + ".srt"
	outFile := "output_" + timestamp + ".mp4"

	// Download audio
	if err := downloadFile(payload.AudioURL, audioFile); err != nil {
		return "", fmt.Errorf("failed to download audio: %v", err)
	}

	// Download video
	if err := downloadFile(payload.VideoURL, videoFile); err != nil {
		return "", fmt.Errorf("failed to download video: %v", err)
	}

	srtPath := ""
	// AUTO-GENERATE SUBTITLES IF NEEDED
	if payload.NeedLyrics {
		err := groq.GenerateSRT(audioFile, srtFile)
		if err != nil {
			return "", fmt.Errorf("subtitle generation failed: %v", err)
		}
		data, _ := os.ReadFile(srtFile)
		fmt.Println("=== GENERATED SRT FILE ===")
		fmt.Println(string(data))
		fmt.Println("=== END SRT ===")

		srtPath = srtFile
	}

	// FFmpeg process
	ffmpegErr := RunFFmpeg(FFmpegInput{
		AudioPath: audioFile,
		VideoPath: videoFile,
		SrtPath:   srtPath,
		Output:    outFile,
	})

	if ffmpegErr != nil {
		return "", fmt.Errorf("ffmpeg failed: %v", ffmpegErr)
	}

	// Upload final
	cld, _ := cloudinary.New()
	uploadResp, err := cld.Upload.Upload(context.Background(), outFile,
		uploader.UploadParams{
			ResourceType: "video",
			Folder:       "vibreon/outputs",
		})

	if err != nil {
		return "", fmt.Errorf("cloudinary upload error: %v", err)
	}

	// cleanup
	os.Remove(audioFile)
	os.Remove(videoFile)
	os.Remove(outFile)
	if payload.NeedLyrics {
		os.Remove(srtFile)
	}

	return uploadResp.SecureURL, nil
}
