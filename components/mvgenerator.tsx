"use client";
import { useId, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Button } from './ui/button'
import { IconArrowsShuffle, IconBrandDeezer, IconBrandYoutube, IconBrandYoutubeFilled, IconCircleCheck, IconDeviceDesktopDown, IconDeviceTvOld, IconEye, IconFileMusic, IconInfoCircle, IconMusicStar, IconSparkles, IconVideo } from '@tabler/icons-react';
import type { SimplifiedVideo, PexelsVideo, PexelsApiResponse } from "@/types/pexels";
import { cn } from '@/lib/utils';
import { Field, FieldContent, FieldDescription, FieldLabel } from './ui/field';
import { Switch } from './ui/switch';
import { GradientText } from './ui/gradient-text';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';


export default function MVGenerator() {

    const songEffects = [
        { value: 'normal', label: 'Normal' },
        { value: 'slowed_reverb', label: 'Slowed + Reverb' },
        { value: 'bass_boosted', label: 'Bass Boosted' },
        { value: 'slowed_bass_boosted', label: 'Slowed + Bass Boosted' },
        { value: 'sped_up_reverb', label: 'Sped Up + Reverb' },
        { value: 'sped_up_nightcore', label: 'Sped Up + Nightcore' },
        { value: 'vaporwave', label: 'Vaporwave Version' },
        { value: 'dreamcore', label: 'Dreamcore Version' },
        { value: 'lofi', label: 'Rainy Mood / Lofi' },
        { value: 'chipmunk', label: 'Chipmunk Version' },
        { value: '8D', label: '8D Audio' },
        { value: 'underwater', label: 'Underwater / Dreamy Muffled' }
    ];

    const randomThemes = [
        "rainy city",
        "lonely road",
        "forest sunrise",
        "neon cyberpunk",
        "calm ocean waves",
        "night drive",
        "aesthetic slow motion",
        "romantic sunset",
        "abstract colors",
        "minimalist shadows"
    ];

    const id = useId();
    const [mp3, setMp3] = useState<File | null>(null);
    const [effect, setEffect] = useState("normal");
    const [ytUrl, setYtUrl] = useState("");
    const [theme, setTheme] = useState("");
    const [ytLinkError, setytLinkError] = useState("");
    const [themeError, setThemeError] = useState("");
    const [videos, setVideos] = useState<SimplifiedVideo[]>([]);
    const [needLyrics, setNeedLyrics] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const [showLoader, setShowLoader] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [output, setOutput] = useState("");

    const YT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;

    const extractVideoInfo = (v: PexelsVideo): SimplifiedVideo => {
        const thumbnail = v.video_pictures?.[0]?.picture || "";

        const hdFile =
            v.video_files?.find(f => f.quality === "hd" && f.file_type === "video/mp4") ||
            v.video_files?.find(f => f.quality === "sd" && f.file_type === "video/mp4") ||
            v.video_files?.find(f => f.file_type === "video/mp4");

        return {
            id: v.id,
            thumbnail,
            videoUrl: hdFile?.link || ""
        };
    };

    const fetchVideos = async (q: string) => {
        const res = await fetch("/api/pexels", {
            method: "POST",
            body: JSON.stringify({ query: q })
        });

        const data: PexelsApiResponse = await res.json();

        const simplified: SimplifiedVideo[] = data.videos.map(extractVideoInfo);

        setVideos(simplified);
    };

    const handleThemeSearch = () => {
        if (!theme.trim()) {
            setThemeError("Please enter a theme before searching.");
            return;
        }
        setThemeError("");
        fetchVideos(theme);
    };

    const handleRandomClick = () => {
        const t = randomThemes[Math.floor(Math.random() * randomThemes.length)];
        setTheme(t);
        setThemeError("");
        fetchVideos(t);
    };

    const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.value);
        if (themeError) setThemeError("");
    };

    const handleMp3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (f.type !== "audio/mpeg") {
            alert("Only MP3 files are supported.");
            e.target.value = "";
            return;
        }

        // 25 MB = 25 * 1024 * 1024 bytes
        if (f.size > 25 * 1024 * 1024) {
            alert("File too large. Maximum allowed size is 25 MB.");
            e.target.value = "";
            return;
        }

        setMp3(f);
        setYtUrl("");
    };

    const handleDownload = async () => {
        if (!output) return;
        setDownloading(true);
        try {
            const response = await fetch(output, {
                mode: "cors",
            });

            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: "video/mp4" });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "video.mp4";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setDownloading(false);
        }
    };

    const removeMp3 = () => {
        setMp3(null);
        const input = document.getElementById("mp3") as HTMLInputElement;
        if (input) input.value = "";
    };

    const handleYtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setYtUrl(value);
        removeMp3();

        if (value.trim() === "") {
            setytLinkError("");
            return;
        }

        if (!YT_REGEX.test(value.trim())) {
            setytLinkError("Please enter a valid YouTube URL.");
        } else {
            setytLinkError("");
        }
    };

    const handleGenerate = async () => {
        try {
            if (!mp3 && !ytUrl) {
                toast.error("Please upload an MP3 or paste a YouTube link.");
                return;
            }

            if (!selectedVideo) {
                toast.error("Please select a background video.");
                return;
            }

            setOutput("");
            setShowLoader(true);

            // 1. Upload MP3 or extract audio from YouTube
            let audioUrl = "";
            let isYoutube = false;

            if (mp3) {
                const formData = new FormData();
                formData.append("file", mp3);
                const uploadRes = await fetch("/api/upload-mp3", {
                    method: "POST",
                    body: formData
                });

                const uploadJson = await uploadRes.json();
                audioUrl = uploadJson.secure_url;
            } else if (ytUrl) {
                isYoutube = true;
                const ytRes = await fetch("/api/extract-yt", {
                    method: "POST",
                    body: JSON.stringify({ ytUrl })
                });
                const ytJson = await ytRes.json();
                audioUrl = ytJson.secure_url;
            }

            // Collect Selected BG Video
            const selected = videos.find(v => v.id === selectedVideo);

            // Construct final payload for Go backend
            const payload = {
                audioUrl,
                isYoutube,
                effect,
                backgroundVideo: selected?.videoUrl,
                needLyrics
            };
            console.log(payload);

            const response = await fetch("/api/generate-video", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            toast.info("Video is generated");
            console.log("Generation started:", result);

            setOutput(result.videoUrl);
        } catch (err) {
            toast.error("An error occurred.");
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <div className='relative flex flex-col max-w-6xl w-full rounded-xl bg-background border border-accent-foreground p-10 mt-2 z-10 gap-10'>
            <div className='mx-auto flex items-center justify-center w-full gap-1 mb-8'>
                <IconMusicStar className='stroke-ring inline-flex size-10' />
                <GradientText className="text-4xl font-bold" text="Build Your Personalized Music Video" />
            </div>
            <div className="flex items-start justify-between gap-5">
                <div className="grid w-full gap-3 max-w-lg">
                    <Label htmlFor="mp3" className='text-xl tracking-tight'><IconFileMusic /> Upload MP3 File</Label>
                    <Input
                        id="mp3"
                        type="file"
                        accept="audio/mpeg"
                        onChange={handleMp3Change}
                        disabled={ytUrl.length > 0}
                        className="w-full max-w-lg cursor-pointer text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic"
                    />
                    {mp3 && (
                        <div className="w-full max-w-lg flex items-center justify-between rounded-md bg-muted p-2">
                            <span className="text-sm truncate">{mp3.name}</span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={removeMp3}
                                className='cursor-pointer border shadow-2xl hover:scale-105'
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Choose an MP3 file from your device (max: 1 file, limit: 25 MB).
                    </p>
                </div>
                <div className="grid w-full gap-3">
                    <Label htmlFor="yt-url" className='text-xl tracking-tight'><IconBrandYoutubeFilled /> YouTube Link</Label>
                    <Input
                        id="yt-url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={ytUrl}
                        onChange={handleYtChange}
                        disabled={mp3 !== null}
                    />
                    {ytLinkError && (
                        <p className="text-xs text-destructive">{ytLinkError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        OR paste a YouTube link to fetch audio automatically.
                    </p>
                </div>
            </div>
            <fieldset className='w-full space-y-4'>
                <legend className="text-foreground text-xl tracking-tight leading-none font-medium flex items-center gap-2">
                    <IconBrandDeezer /> Select Effects:
                </legend>
                <RadioGroup className='grid grid-cols-4 gap-5'
                    defaultValue='normal' value={effect}
                    onValueChange={setEffect}
                >
                    {songEffects.map(item => (
                        <label
                            key={`${id}-${item.value}`}
                            className={cn('border-input has-data-[state=checked]:border-primary/80 has-data-[state=checked]:bg-muted/60',
                                'has-focus-visible:border-ring has-data-[state=checked]:border-2 has-focus-visible:ring-ring/50 relative flex flex-col items-center gap-3 rounded-md',
                                'border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-10',
                                'has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 hover:scale-110')}
                        >
                            <RadioGroupItem
                                id={`${id}-${item.value}`}
                                value={item.value}
                                className='sr-only after:absolute after:inset-0'
                                aria-label={`size-radio-${item.value}`}
                            />
                            <p className='text-foreground text-sm leading-none font-medium'>{item.label}</p>
                        </label>
                    ))}
                </RadioGroup>
            </fieldset>
            <div className='w-full space-y-2'>
                <Label htmlFor="video-theme" className='text-xl tracking-tight'><IconVideo /> Video Theme / Aesthetic</Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Describe the visual mood you want for the generated video. Try using specific styles, vibes, colors, eras, or scenes.<br />
                    Popular themes: "anime night street", "pastel glow", "dark academia", "forest ambience", "glitch vaporwave"
                </p>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex flex-1 rounded-md shadow-xs'>
                        <Input
                            id="video-theme"
                            value={theme}
                            onChange={onThemeChange}
                            placeholder='e.g. cyberpunk neon city, lofi rain, dreamy clouds, retro vhs...'
                            className={cn(
                                '-me-px rounded-r-none shadow-none focus-visible:z-1',
                                themeError ? 'border-destructive' : ''
                            )}
                        />
                        <Button
                            className='rounded-l-none cursor-pointer hover:scale-105'
                            onClick={handleThemeSearch}
                            disabled={!theme.trim()}
                        >
                            Search
                        </Button>
                    </div>
                    <Button variant="outline"
                        className='cursor-pointer border shadow-2xl hover:scale-105'
                        onClick={handleRandomClick}>
                        <IconArrowsShuffle /> Random
                    </Button>
                </div>
                {themeError && (
                    <p className="text-xs text-destructive">{themeError}</p>
                )}
            </div>
            {videos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {videos.slice(0, 12).map(v => (
                        <div
                            key={v.id}
                            className={cn(
                                "relative group rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105",
                                selectedVideo === v.id ? "border-4 border-primary" : "border"
                            )}
                            onClick={() => setSelectedVideo(v.id)}
                        >
                            <img
                                src={v.thumbnail}
                                alt=""
                                className="w-full h-40 object-fill"
                            />

                            {/* Preview Button — visible only on hover */}
                            <div className=" absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/60">
                                <Button
                                    variant="outline"
                                    className="w-fit cursor-pointer border shadow-2xl hover:scale-105 font-medium text-sm rounded-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewVideo(v.videoUrl);
                                    }}
                                >
                                    <IconEye /> Preview
                                </Button>
                            </div>

                            {/* Radio-like selected indicator */}
                            <div className="absolute top-2 right-2 w-3 h-3 ">
                                {selectedVideo === v.id && (
                                    <IconCircleCheck className='w-full h-full rounded-full stroke-primary' />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {previewVideo && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999">
                    <div className="relative">
                        <video
                            src={previewVideo}
                            autoPlay
                            controls
                            loop
                            className="max-w-4xl max-h-[80vh] rounded-lg shadow-xl"
                        />
                        <button
                            className="absolute top-3 right-3 bg-muted text-foreground rounded-full px-3 py-1 text-sm shadow cursor-pointer"
                            onClick={() => setPreviewVideo(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="w-full max-w-xl">
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldLabel htmlFor="need-lyrics">Enable Lyrics</FieldLabel>
                        <FieldDescription>
                            Include an AI-generated audio transcript overlay in the final video. <br />
                            <IconInfoCircle className='inline-flex size-3 mb-1' /> Accuracy may vary, and rendering time will increase when this is enabled.
                        </FieldDescription>
                    </FieldContent>
                    <Switch id="need-lyrics" checked={needLyrics} onCheckedChange={setNeedLyrics} />
                </Field>
            </div>
            <Button variant="default" onClick={handleGenerate}
                className='cursor-pointer hover:scale-105 hover:ring-2 hover:ring-ring w-fit'>
                <IconSparkles /> Generate Video
            </Button>
            {output && (
                <div className='w-full mx-auto flex flex-col gap-5 mt-10'>
                    <legend className="text-foreground text-2xl tracking-tight leading-none font-medium flex items-center gap-2">
                        <IconDeviceTvOld /> Final Result
                    </legend>
                    <video src={output} autoPlay controls playsInline loop
                        preload="metadata" className="w-full rounded-xl shadow-2xl max-h-[450px]"
                    />
                    <div className='flex items-center justify-center gap-5'>
                        <Button variant="outline" onClick={handleDownload}
                            className='cursor-pointer hover:scale-105 hover:shadow-2xl'>
                            <IconDeviceDesktopDown /> Download {downloading && (<Image src="/download-loader.gif" alt="download-loader" width={15} height={15}/>)}
                        </Button>
                        <Button variant="default" onClick={() => { toast.info("This feature is not available at the moment") }}
                            className='cursor-pointer hover:scale-105 hover:shadow-2xl'>
                            <IconBrandYoutube /> Upload to YouTube
                        </Button>
                    </div>
                </div>
            )}
            {showLoader && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-md bg-black/40 w-full">
                    <div className='relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 bg-background py-5 px-3 max-w-4xl mx-auto'>
                        <div className='flex gap-1 p-3 m-2 items-center justify-center'>
                            <Image alt="sandy-loading" src="/sandy-loading.gif" width={60} height={80} />
                            <div className='flex flex-col items-start justify-center gap-1'>
                                <GradientText className="text-4xl font-bold tracking-tight text-shadow-lg" text="Hang tight, your video is brewing..." />
                                <GradientText className="text-xl font-bold tracking-tight text-shadow-lg" text="Here's something cool to watch while you wait!" />
                            </div>
                        </div>
                        <div className="mx-auto p-3 flex flex-col gap-2">
                            <video src="/loadervid.mp4" autoPlay controls playsInline loop
                                preload="metadata" className="w-full rounded-lg shadow-2xl max-w-[480px] max-h-[270px]"
                            />
                            <div>Credits: <Link href="https://www.youtube.com/watch?v=MoDGzRa1LW0"
                                target="_blank" rel="noopener noreferrer" className='underline'>Hyun's Dojo Community</Link></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
