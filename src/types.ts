export interface Pixel {
    x: number;
    y: number;
    color: number;
    painted: boolean;
}

export interface PixelArt {
    pixels: Pixel[];
}
