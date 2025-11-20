import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded: any = await new Promise((resolve, reject) => {
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
        stream.end(buffer);
    });

    return NextResponse.json(uploaded);
}
