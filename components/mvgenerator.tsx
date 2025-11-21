"use client";
import { useState } from 'react'
import { Button } from './ui/button'
import {
    IconBrandYoutube, IconDeviceDesktopDown, IconDeviceTvOld, IconInfoCircle, IconMusicStar, IconSparkles
} from '@tabler/icons-react';
import type { SimplifiedVideo } from "@/types/pexels";
import { Field, FieldContent, FieldDescription, FieldLabel } from './ui/field';
import { Switch } from './ui/switch';
import { GradientText } from './ui/gradient-text';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import {
    VideoPlayer, VideoPlayerContent, VideoPlayerControlBar, VideoPlayerMuteButton, VideoPlayerPlayButton, VideoPlayerSeekBackwardButton,
    VideoPlayerSeekForwardButton, VideoPlayerTimeDisplay, VideoPlayerTimeRange, VideoPlayerVolumeRange, VideoPlayerFullscreenButton
} from './ui/video-player';
import AudioSection from './audio-section';
import EffectsSection from './effects-section';
import { VideoThemeSection, VideoSelectGrid, VideoPreview } from './video-section';


export default function MVGenerator() {

    const [mp3, setMp3] = useState<File | null>(null);
    const [effect, setEffect] = useState("normal");
    const [ytUrl, setYtUrl] = useState("");

    const [videos, setVideos] = useState<SimplifiedVideo[]>([]);
    const [needLyrics, setNeedLyrics] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const [showLoader, setShowLoader] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [output, setOutput] = useState("");


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

            <AudioSection mp3={mp3} setMp3={setMp3} ytUrl={ytUrl} setYtUrl={setYtUrl} />

            <EffectsSection effect={effect} setEffect={setEffect} />

            <VideoThemeSection setVideos={setVideos} />

            {videos.length > 0 && (<VideoSelectGrid videos={videos} selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} setPreviewVideo={setPreviewVideo} />)}

            {previewVideo && (<VideoPreview previewVideo={previewVideo} setPreviewVideo={setPreviewVideo} />)}

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
                    <VideoPlayer className="rounded-lg border w-full h-[500px] shadow-2xl">
                        <VideoPlayerContent crossOrigin="" preload="auto" slot="media"
                            src={output}
                            autoPlay loop playsInline className='h-full w-full object-contain'
                        />
                        <VideoPlayerControlBar>
                            <VideoPlayerPlayButton />
                            <VideoPlayerSeekBackwardButton />
                            <VideoPlayerSeekForwardButton />
                            <VideoPlayerTimeRange />
                            <VideoPlayerTimeDisplay showDuration />
                            <VideoPlayerMuteButton />
                            <VideoPlayerVolumeRange />
                            <VideoPlayerFullscreenButton />
                        </VideoPlayerControlBar>
                    </VideoPlayer>
                    <div className='flex items-center justify-center gap-5'>
                        <Button variant="outline" onClick={handleDownload}
                            className='cursor-pointer hover:scale-105 hover:shadow-2xl'>
                            <IconDeviceDesktopDown /> Download {downloading && (<Image src="/download-loader.gif" alt="download-loader" width={15} height={15} />)}
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
                            <div className='flex flex-col items-start justify-center gap-2'>
                                <GradientText className="text-3xl font-bold tracking-tight text-shadow-lg" text="Hang tight, your video is brewing..." />
                                <GradientText className="text-lg font-bold tracking-tight text-shadow-lg" text="Here's something cool to watch while you wait!" />
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
