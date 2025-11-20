package models

type GeneratePayload struct {
	AudioURL   string `json:"audioUrl"`
	IsYouTube  bool   `json:"isYoutube"`
	VideoURL   string `json:"backgroundVideo"`
	NeedLyrics bool   `json:"needLyrics"`
	Effect     string `json:"effect"`
}
