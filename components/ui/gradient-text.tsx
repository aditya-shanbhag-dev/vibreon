'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';

type GradientTextProps = React.ComponentProps<'span'> & {
    text: string;
    gradient?: string;
    neon?: boolean;
    transition?: Transition;
};

function GradientText({
    text,
    className,
    gradient = 'linear-gradient(90deg, #15803d 0%, #16a34a 20%, #4ade80 50%, #16a34a 80%,  #15803d 100%)',
    neon = false,
    transition = { duration: 3, repeat: Infinity, ease: 'linear' },
    ...props
}: GradientTextProps) {
    const baseStyle: React.CSSProperties = {
        backgroundImage: gradient,
    };

    return (
        <span
            data-slot="gradient-text"
            className={cn('relative inline-block', className)}
            {...props}
        >
            <motion.span
                className="m-0 text-transparent bg-clip-text bg-size-[200%_100%]"
                style={baseStyle}
                animate={{ backgroundPositionX: ['0%', '200%'] }}
                transition={transition}
            >
                {text}
            </motion.span>

            {neon && (
                <motion.span
                    className="m-0 absolute top-0 left-0 text-transparent bg-clip-text blur-sm mix-blend-plus-lighter bg-size-[200%_100%]"
                    style={baseStyle}
                    animate={{ backgroundPositionX: ['0%', '200%'] }}
                    transition={transition}
                >
                    {text}
                </motion.span>
            )}
        </span>
    );
}

export { GradientText, type GradientTextProps };