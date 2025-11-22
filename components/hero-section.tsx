'use client';
import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Safari } from './ui/safari';
import { GradientText } from './ui/gradient-text';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0, 0.5], [20, 0, -20]);
  const rotateY = useTransform(mouseX, [-0.5, 0, 0.5], [-20, 0, 20]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);


  return (
    <div ref={heroRef} id="home" className="relative w-full px-10 py-5">
      <motion.div className="relative z-10 container mx-auto max-w-6xl" style={{ y: contentY }} >
        <div className="grid items-start gap-16 md:grid-cols-2">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 1,
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden" animate={controls} className="flex flex-col text-center md:text-left"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-foreground mb-6 text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
                Create <GradientText text="Beautiful" /> Short-Form{' '}
                <GradientText text="Videos" /> For Your <GradientText text="Audio" />
              </h2>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-muted-foreground mb-8 text-lg leading-relaxed"
            >
              Vibreon transforms your audio into stunning short-form videos,
              complete with effects, looping visuals, and a transcipt overlay.{' '}
              <span className="text-foreground font-semibold">
                Your sound becomes cinematic in one click.
              </span>
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap justify-center gap-10 md:justify-start mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button className="relative rounded-lg" onClick={() => { window.location.href = "/generate" }}>
                  Generate a video! <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="bg-background/50 absolute inset-0 -z-10 rounded-full backdrop-blur-sm"></div>
                <Button
                  variant="outline"
                  className="border-primary/20 hover:border-primary/30 hover:bg-primary/5 rounded-lg backdrop-blur-sm transition-all duration-300"
                >
                  Watch a Demo <Sparkles className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

          </motion.div>

          <div className='flex flex-col gap-1 items-center'>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 1,
                    type: 'spring',
                    stiffness: 100,
                  },
                },
              }}
              initial="hidden"
              animate={controls}
              ref={mockupRef}
              className="relative mx-auto flex justify-center perspective-distant transform-3d"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                mouseX.set(x);
                mouseY.set(y);

                if (!isHovered) {
                  setIsHovered(true);
                }
              }}
              onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
                setIsHovered(false);
              }}
            >
              <motion.div
                className="relative z-10 transform-3d"
                style={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{
                  scale: {
                    duration: 0.3,
                    type: 'spring',
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                }}
              >
                <div className="relative">
                  <Safari imageSrc='/mock.png' className="size-full" mode='default' />
                </div>
              </motion.div>

            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start"
            >
              {['FFMPEG', 'YT-DLP', 'Cloudinary', 'Groq'].map(
                (feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="text-foreground relative rounded-full px-4 py-1.5 text-sm font-medium shadow-sm hover:scale-105 hover:ring-1 hover:ring-ring"
                  >
                    <div className="border-primary/10 bg-background/80 dark:bg-background/30 absolute inset-0 rounded-full border backdrop-blur-md dark:border-white/5"></div>
                    <div className="via-primary/20 dark:via-primary/30 absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-rose-500/0 to-rose-500/0 dark:from-blue-500/0 dark:to-indigo-500/0"></div>

                    <span className="relative z-10">{feature}</span>
                  </motion.div>
                ),
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
