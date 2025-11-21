import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
    const { ytUrl } = await req.json();

    // Call your Go server to extract MP3
    const res = await fetch(process.env.GO_SERVER + "/yt/extract", {
        method: "POST",
        body: JSON.stringify({ url: ytUrl })
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: "Failed to fetch MP3 from Go server" },
            { status: 500 }
        );
    }

    // Convert response to ArrayBuffer → Buffer
    const arrayBuffer = await res.arrayBuffer();
    const mp3Buffer = Buffer.from(arrayBuffer);

    // Upload MP3 buffer to Cloudinary via upload_stream()
    const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "video",
                folder: "vibreon/audio",
                format: "mp3",
            },
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
        stream.end(mp3Buffer);
    });

    return NextResponse.json(uploaded);
}
