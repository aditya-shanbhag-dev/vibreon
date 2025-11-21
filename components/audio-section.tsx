"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { IconBrandYoutubeFilled, IconFileMusic } from "@tabler/icons-react";

interface AudioSectionProps {
    mp3: File | null;
    setMp3: (file: File | null) => void;
    ytUrl: string;
    setYtUrl: (url: string) => void;
}

export default function AudioSection({ mp3, setMp3, ytUrl, setYtUrl }: AudioSectionProps) {

    const [ytLinkError, setytLinkError] = useState("");
    const YT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;

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

    return (
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
    );
}
