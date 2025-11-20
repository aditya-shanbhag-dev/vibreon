package ffmpeg

// GetAudioFilter returns the FFmpeg audio filter string for the given effect.
func GetAudioFilter(effect string) string {
	switch effect {
	case "slowed_reverb":
		// Slow down and pitch down (0.85x speed/pitch) + Echo/Delay (Safe Fallback)
		// aecho=in_gain:out_gain:delay_1:decay_1[:delay_2:decay_2:...]
		return "asetrate=44100*0.85,aresample=44100,aecho=0.8:0.8:1000:0.4"

	case "bass_boosted":
		// Use the modern 'lowshelf' filter.
		return "lowshelf=g=10:f=110:s=0.5"

	case "slowed_bass_boosted":
		// Slow down and pitch down (0.85x speed/pitch) + Bass Boost (lowshelf)
		return "asetrate=44100*0.85,aresample=44100,lowshelf=g=10:f=110:s=0.5"

	case "sped_up_reverb":
		// Speed up tempo (1.25x speed, no pitch change) + Echo/Delay (Safe Fallback)
		return "atempo=1.25,aecho=0.8:0.8:1000:0.4"

	case "sped_up_nightcore":
		// Speed up and pitch up (1.25x speed/pitch).
		return "asetrate=44100*1.25,aresample=44100"

	case "vaporwave":
		// Slow down and pitch down (0.8x speed/pitch).
		return "asetrate=44100*0.8,aresample=44100"

	case "dreamcore":
		// Lowpass, slow tempo, and Echo/Delay (Safe Fallback)
		return "lowpass=f=450,atempo=0.9,aecho=0.8:0.8:1000:0.4"

	case "lofi":
		// Echo/delay + frequency band limiting.
		return "aecho=0.8:0.88:60:0.4,lowpass=f=3000,highpass=f=20"

	case "chipmunk":
		// Speed up and pitch up (1.4x speed/pitch).
		return "asetrate=44100*1.4,aresample=44100"

	case "8D":
		// Spatial stereo panning effect (apulsator is correct)
		return "apulsator=mode=sine:hz=0.3"

	case "underwater":
		// Frequency band limiting to simulate muffled sound
		return "lowpass=f=800,highpass=f=200"

	default:
		return ""
	}
}
