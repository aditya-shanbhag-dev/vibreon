'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconBadgeCcFilled, IconFileMusicFilled, IconVideoFilled, IconWaveSawTool } from '@tabler/icons-react';

const features = [
    {
        step: 'Step 1',
        title: 'Upload Audio or Paste a YT Link',
        content:
            'We extract / upload the audio instantly.',
        icon: <IconFileMusicFilled className="text-primary h-6 w-6" />
    },
    {
        step: 'Step 2',
        title: 'Choose Your Audio Effect',
        content:
            'Slowed reverb, nightcore, vaporwave, lofi, dreamcore, 8D, and more.',
        icon: <IconWaveSawTool className="text-primary h-6 w-6" />,
    },
    {
        step: 'Step 3',
        title: 'Pick a theme for Background Video',
        content:
            "Browse Pexels' Stock Video library directly inside Vibreon.",
        icon: <IconVideoFilled className="text-primary h-6 w-6" />,
    },
    {
        step: 'Step 4',
        title: 'Enable AI Subtitles',
        content:
            'Created SRT for the transcription overlay using Groq Whisper',
        icon: <IconBadgeCcFilled className="text-primary h-6 w-6" />,
    }

];

export default function DemoSection() {
    const [currentFeature, setCurrentFeature] = useState(0);
    const [progress, setProgress] = useState(0);

    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                if (isVisible) el.play().catch(() => { });
                else el.pause();
            },
            {
                threshold: 0.5,
            }
        );

        io.observe(el);
        return () => {
            io.disconnect();
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress < 100) {
                setProgress((prev) => prev + 100 / (4000 / 100));
            } else {
                setCurrentFeature((prev) => (prev + 1) % features.length);
                setProgress(0);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [progress]);

    return (
        <div id="demo" className="py-8 px-10 md:p-12">
            <div className="mx-auto w-full max-w-7xl">
                <div className="relative mx-auto mb-8 max-w-4xl sm:text-center">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                            Your Music. Your Aesthetic. Zero Editing.
                        </h2>
                        <p className="text-foreground/60 mt-3">
                            Whether it's a slowed reverb mix, a lofi loop, or an AI-generated lyric video, <br />
                            you can create high-quality social-ready clips effortlessly.
                        </p>
                    </div>
                    <div
                        className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
                        style={{
                            background:
                                'linear-gradient(152.92deg, rgba(0, 148, 94, 0.22) 4.54%, rgba(0, 168, 104, 0.28) 77.55%, rgba(0, 148, 94, 0.12) 34.2%)',
                        }}
                    ></div>
                </div>
                <hr className="bg-foreground/30 mx-auto mb-10 h-px w-3/5" />

                <div className="flex flex-col lg:flex-row items-center gap-3">
                    <div className="order-2 space-y-8 md:order-1">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center gap-3 md:gap-8"
                                initial={{ opacity: 0.3, x: -20 }}
                                animate={{
                                    opacity: index === currentFeature ? 1 : 0.3,
                                    x: 0,
                                    scale: index === currentFeature ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className={cn(
                                        'flex items-center justify-center rounded-full border-2 md:h-14 md:w-14',
                                        index === currentFeature
                                            ? 'border-primary bg-primary/10 text-primary scale-110 [box-shadow:0_0_15px_rgb(20,192,80,0.3)]'
                                            : 'border-muted-foreground bg-muted',
                                    )}
                                >
                                    {feature.icon}
                                </motion.div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold md:text-2xl">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        {feature.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="z-50 max-w-2xl p-5">
                        <video ref={ref} src="https://res.cloudinary.com/ddtclo99a/video/upload/v1763846872/loadervid_1_x4riqn.mp4"
                            playsInline muted loop preload="metadata" className="w-full rounded-xl shadow"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
