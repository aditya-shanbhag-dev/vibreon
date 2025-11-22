"use client";
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggleButton } from "./theme-switch";
import { IconBrandGithub } from '@tabler/icons-react'

export default function Footer() {
    return (
        <footer className='max-w-7xl bottom-0 mt-auto mx-auto h-auto pt-10 pb-5 w-full px-5'>
            <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-2 py-4 max-md:flex-col sm:px-6 sm:py-4 md:gap-6 md:py-4 z-50'>
                <a href='/#'>
                    <div className='flex items-center gap-1'>
                        <Image src="/vibreon-logo.png" alt="Vibreon Logo" width={65} height={65}  className='z-50'/>
                        <Image src="/vibreon-title.png" alt="Vibreon Title" width={100} height={65} className='z-50'/>
                    </div>
                </a>

                <div className='flex items-center gap-5 whitespace-nowrap'>
                    <a href='/generate' className='hover:scale-120'>Try Now!</a>
                    <a href='/#home' className='hover:scale-120'>Home</a>
                    <a href='/#features' className='hover:scale-120'>Features</a>
                    <a href='/#demo' className='hover:scale-120'>Demo</a>
                    <a href='/legal#privacy' className='hover:scale-120'>Privacy policy</a>
                    <a href='/legal#tos' className='hover:scale-120'>Terms of Service</a>
                </div>
            </div>
            <Separator className='z-50'/>
            <div className='mx-auto flex max-w-7xl justify-between px-4 py-5 sm:px-6 z-50'>
                <p className='text-center font-medium text-balance'>
                    ©{new Date().getFullYear()} <a href='#'>Vibreon</a>, Made with ❤️ by{" "}
                    <Link
                        href="https://www.linkedin.com/in/aditya-shanbhag-5065b0240/"
                        className="inline-block transition-transform hover:scale-105 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Aditya Shanbhag
                    </Link>
                </p>
                <div className="flex items-center gap-4 mr-5">
                    <ThemeToggleButton variant="circle" start="bottom-right" blur />
                    <IconBrandGithub className="w-6 h-6 cursor-pointer" onClick={() => window.open("https://github.com/aditya-shanbhag-dev/vibreon")} />
                </div>
            </div>
        </footer>
    )
};