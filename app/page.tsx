import DemoSection from "@/components/demo-section";
import FeatureSection from "@/components/feature-section";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 items-center justify-center bg-background">
      <HeroSection/>
      <FeatureSection/>
      <DemoSection/>
    </div>
  );
}
