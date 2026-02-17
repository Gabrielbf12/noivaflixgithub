
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel, aspectRatio = 16 / 9 }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleSave = async () => {
        if (croppedAreaPixels) {
            try {
                const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
                onCropComplete(croppedImageBlob);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="relative w-full h-[400px] bg-zinc-900 rounded-3xl overflow-hidden">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteInternal}
                    onZoomChange={onZoomChange}
                />
            </div>

            <div className="space-y-4 px-2">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Ajuste o Zoom</label>
                    <span className="text-white font-mono text-xs">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => onZoomChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={onCancel}
                    className="flex-1 bg-zinc-900 border border-white/10 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                    Salvar Corte
                </button>
            </div>
        </div>
    );
};
