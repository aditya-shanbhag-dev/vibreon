"use client";
import Image from "next/image";
import { IconBrandGithub } from '@tabler/icons-react';
import { ThemeToggleButton } from "./theme-switch";

export default function Header() {
  return (
    <div className="w-full mt-0 h-auto p-2">
      <div className="flex items-center justify-between mx-5 z-50">
        <div className="flex items-center cursor-pointer" onClick={() => window.location.href = "/"}>
          <Image src="/vibreon-logo.png" alt="Vibreon Logo" width={80} height={80}/>
          <Image src="/vibreon-title.png" alt="Vibreon Title" width={125} height={80} />
        </div>
        <div className="flex items-center gap-4 mr-5">
          <ThemeToggleButton variant="circle" start="top-right" blur />
          <IconBrandGithub className="w-6 h-6 cursor-pointer" onClick={() => window.open("https://github.com/aditya-shanbhag-dev/vibreon")} />
        </div>
      </div>
    </div>
  );
}