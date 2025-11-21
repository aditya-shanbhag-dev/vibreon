import { useState } from 'react'
import { Label } from './ui/label';
import { IconArrowsShuffle, IconCircleCheck, IconEye, IconVideo } from '@tabler/icons-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { SimplifiedVideo, PexelsVideo, PexelsApiResponse } from "@/types/pexels";
import { cn } from '@/lib/utils';

export function VideoThemeSection({ setVideos }: { setVideos: (value: SimplifiedVideo[]) => void }) {

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

    const [theme, setTheme] = useState("");
    const [themeError, setThemeError] = useState("");

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

    const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.value);
        if (themeError) setThemeError("");
    };

    return (
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
    );
}

interface VideoSelectProps {
    videos: SimplifiedVideo[];
    selectedVideo: number | null;
    setSelectedVideo: (value: number | null) => void;
    setPreviewVideo: (value: string | null) => void;
};

export function VideoSelectGrid({ videos, selectedVideo, setSelectedVideo, setPreviewVideo }: VideoSelectProps) {
    return (
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
    );
}

interface VideoPreviewProps {
    previewVideo: string;
    setPreviewVideo: (value: string | null) => void;
};

export function VideoPreview({ previewVideo, setPreviewVideo }: VideoPreviewProps) {
    return (
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
    );
}