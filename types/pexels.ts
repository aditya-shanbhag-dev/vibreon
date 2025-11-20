export interface PexelsVideoFile {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    fps: number;
    link: string;
    size: number;
}

export interface PexelsVideoPicture {
    id: number;
    nr: number;
    picture: string;
}

export interface PexelsVideo {
    id: number;
    width: number;
    height: number;
    duration: number;
    url: string;
    image: string;
    video_files: PexelsVideoFile[];
    video_pictures: PexelsVideoPicture[];
}

export interface PexelsApiResponse {
    page: number;
    per_page: number;
    videos: PexelsVideo[];
    total_results: number;
    next_page?: string;
}

export interface SimplifiedVideo {
    id: number;
    thumbnail: string;
    videoUrl: string;
}
