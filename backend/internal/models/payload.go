package models

type GeneratePayload struct {
	AudioURL   string `json:"audioUrl"`
	VideoURL   string `json:"videoUrl"`
	NeedLyrics bool   `json:"needLyrics"`
	Effect     string `json:"effect"`
}
