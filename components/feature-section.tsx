import {
    FileMusic,
    FastForward,
    CloudHail,
    Captions,
    Server,
    AudioLines,
    LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the feature item type
type FeatureItem = {
    icon: LucideIcon;
    title: string;
    description: string;
    position?: 'left' | 'right';
    cornerStyle?: string;
};

// Create feature data arrays for left and right columns
const leftFeatures: FeatureItem[] = [
    {
        icon: FileMusic,
        title: 'YouTube to MP3 Extraction',
        description:
            'Fast audio extraction from a YouTube URL, powered by yt-dlp',
        position: 'left',
        cornerStyle: 'sm:translate-x-4 sm:rounded-br-[2px]',
    },
    {
        icon: AudioLines,
        title: 'Professional Audio Effects',
        description:
            'Every effect is powered by FFmpeg filters, just pick your vibe.',
        position: 'left',
        cornerStyle: 'sm:-translate-x-4 sm:rounded-br-[2px]',
    },
    {
        icon: Captions,
        title: 'Audio Transcription',
        description:
            'Groq Whisper creates clean, accurate SRT lyrics you can burn into the video.',
        position: 'left',
        cornerStyle: 'sm:translate-x-4 sm:rounded-tr-[2px]',
    },
];

const rightFeatures: FeatureItem[] = [
    {
        icon: CloudHail,
        title: 'Cloud Storage Included',
        description:
            'All videos stored via Cloudinary with global CDN delivery.',
        position: 'right',
        cornerStyle: 'sm:-translate-x-4 sm:rounded-bl-[2px]',
    },
    {
        icon: Server,
        title: 'Full Stack Performance',
        description:
            'Next.js + Go + FFmpeg deliver speed and reliability.',
        position: 'right',
        cornerStyle: 'sm:translate-x-4 sm:rounded-bl-[2px]',
    },
    {
        icon: FastForward,
        title: 'One-Click Generation',
        description:
            'A complete video from raw audio in just few minutes.',
        position: 'right',
        cornerStyle: 'sm:-translate-x-4 sm:rounded-tl-[2px]',
    },
];

// Feature card component
const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
    const Icon = feature.icon;

    return (
        <div>
            <div
                className={cn(
                    'relative rounded-2xl px-4 pt-4 pb-4 text-sm',
                    'bg-secondary/90 ring-border ring',
                    'hover:scale-110 hover:ring-2 hover:ring-ring',
                    feature.cornerStyle,
                )}
            >
                <div className="text-primary mb-3 text-[2rem]">
                    <Icon />
                </div>
                <h2 className="text-foreground mb-2.5 text-2xl">{feature.title}</h2>
                <p className="text-muted-foreground text-base text-pretty">
                    {feature.description}
                </p>
                {/* Decorative elements */}
                <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r opacity-60"></span>
                <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--primary)/0.15)_0%,transparent_100%)] opacity-60"></span>
            </div>
        </div>
    );
};

export default function FeatureSection() {
    return (
        <section className="mt-20 px-20 w-full" id="features">
            <div className="mx-6 pt-2 pb-16">
                <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3">
                    {/* Left column */}
                    <div className="flex flex-col gap-6">
                        {leftFeatures.map((feature, index) => (
                            <FeatureCard key={`left-feature-${index}`} feature={feature} />
                        ))}
                    </div>

                    {/* Center column */}
                    <div className="order-1 mb-6 self-center sm:order-0 md:mb-0">
                        <div className="bg-secondary text-foreground ring-ring ring-2 relative mx-auto mb-4.5 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm">
                            <span className="relative z-1 flex items-center gap-2">
                                Features
                            </span>
                            <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-linear-to-r"></span>
                            <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,hsl(var(--primary)/0.25)_0%,transparent_100%)]"></span>
                        </div>
                        <h2 className="text-foreground mb-2 text-center text-2xl sm:mb-2.5 md:text-[2rem]">
                            Built for creators, editors & music lovers.
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-[18rem] text-center text-pretty">
                            No editing skills needed. <br />No watermark.
                        </p>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-6">
                        {rightFeatures.map((feature, index) => (
                            <FeatureCard key={`right-feature-${index}`} feature={feature} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
