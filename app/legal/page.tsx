export default function Legal() {
    return (
        <div className="my-3 mx-5 flex flex-col p-5 gap-3 z-50">
            <h1 id="privacy" className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
                Last updated: 11/22/2025
            </p>
            <blockquote className="mt-6 mb-5 border-l-2 pl-6 italic">
                This Privacy Policy explains how VIBREON ("we", "us", "our") collects, uses, and protects
                information when you use our website <br /> and service at vibreon.vercel.app ("Service").
            </blockquote>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                What we collect
            </h2>
            <p className="leading-7 not-first:mt-6">
                We only process the following information when you provide it:
            </p>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>Audio files you upload (e.g., MP3)</li>
                <li>YouTube URLs for extracting audio</li>
                <li>Background videos selected or uploaded</li>
                <li>Lyric generation requests</li>
            </ul>

            <p className="leading-7 not-first:mt-6">
                We do not:
            </p>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>Store your files permanently</li>
                <li>Sell or share your data with advertisers</li>
                <li>Perform cross-site tracking or behavioral profiling</li>
            </ul>

            <p className="leading-7 not-first:mt-6">
                Uploaded audio and video files are temporarily downloaded and processed by our backend
                solely to generate your final video.<br />
                They are automatically deleted after processing
                unless required for error debugging for a short duration.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Third-party services
            </h2>
            <p className="leading-7 not-first:mt-6">
                Vibreon uses external services to make the platform functional:
            </p>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>Cloudinary - for temporary storage and delivery of generated videos</li>
                <li>Pexels API - to fetch background videos</li>
                <li>Groq Whisper API - to transcribe audio for subtitle generation</li>
                <li>yt-dlp - for YouTube audio extraction</li>
            </ul>
            <p className="leading-7 not-first:mt-6">
                These services may receive the minimum necessary data required for functionality.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Cookies & analytics
            </h2>
            <p className="leading-7 not-first:mt-6">
                We use minimal, privacy-respecting analytics (e.g., page views and usage data)
                to improve Vibreon. <br />No personally identifiable profiles are built.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Children
            </h2>
            <p className="leading-7 not-first:mt-6">
                This Service is not intended for users under the age of 13.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Changes to this policy
            </h2>
            <p className="leading-7 not-first:mt-6">
                We may update this Privacy Policy periodically. Any changes will be posted on this page.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Contact
            </h2>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                If you have any questions:
            </h4>
            <p className="text-muted-foreground text-sm">aditya.shanbhag.dev@gmail.com</p>


            <h1 id="tos" className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mt-20">
                Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
                Last updated: 11/22/2025
            </p>
            <blockquote className="mt-6 mb-5 border-l-2 pl-6 italic">
                By using VIBREON at vibreon.vercel.app, you agree to the following Terms of Service.
            </blockquote>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Service
            </h2>
            <p className="leading-7 not-first:mt-6">
                Vibreon provides automated tools to generate music-based short videos by combining audio,
                effects, background footage and <br /> optional AI-generated lyrics.
                We do not guarantee the accuracy, appropriateness, or reliability of any generated output.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                User Content
            </h2>
            <p className="leading-7 not-first:mt-6">
                You are responsible for the audio, videos, or URLs you upload or submit.<br />
                You agree not to provide any content that is:
            </p>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>Illegal, harmful, threatening, or abusive</li>
                <li>Copyrighted material you do not have rights to</li>
                <li>Sexually explicit or pornographic</li>
                <li>Violent, hateful, or discriminatory</li>
            </ul>
            <p className="leading-7 not-first:mt-6">
                We reserve the right to refuse processing of such content.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Ownership
            </h2>
            <p className="leading-7 not-first:mt-6">
                You retain ownership of the content you upload. We do not claim rights over your files.
                <br /><br />
                Generated output is produced by automated processing using FFmpeg, AI models, and third-party APIs.
                You may download and use <br /> the generated media for personal or commercial use,
                provided it does not violate applicable laws or third-party copyrights.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Limitation of Liability
            </h2>
            <p className="leading-7 not-first:mt-6">
                The Service is provided "as-is". We are not liable for:
            </p>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>Inaccuracies in AI-generated subtitle or media output</li>
                <li>Data loss or processing errors</li>
                <li>Any damage or consequences arising from using the Service</li>
            </ul>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Changes
            </h2>
            <p className="leading-7 not-first:mt-6">
                We may update these Terms at any time. Continued use of the Service means you accept the updated Terms.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Termination
            </h2>
            <p className="leading-7 not-first:mt-6">
                We may suspend or terminate access to the Service for violation of these Terms
                or misuse of the platform.
            </p>

            <h2 className="scroll-m-20 border-b pb-1 mt-5 text-3xl font-semibold tracking-tight first:mt-0">
                Contact
            </h2>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                If you have any questions:
            </h4>
            <p className="text-muted-foreground text-sm">aditya.shanbhag.dev@gmail.com</p>
        </div >
    );
}