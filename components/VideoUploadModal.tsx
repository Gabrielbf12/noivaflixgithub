import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Upload, MonitorPlay, Image as ImageIcon, Check, Video as VideoIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';
// Define types locally if module import fails or just use 'any' temporarily if needed, 
// but better to match the library's expected types. 
// react-easy-crop exports these types usually from the main package in newer versions?
// Let's try to define them to be safe and avoid the module resolution error.
interface Point { x: number; y: number; }
interface Area { x: number; y: number; width: number; height: number; }

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title: string; category: string; videoUrl: string; thumbnail: string }) => void;
}

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageSrc;
    });

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
        canvas.toBlob((file) => {
            if (file) resolve(file);
            else reject(new Error('Canvas is empty'));
        }, 'image/jpeg');
    });
};

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Planejamento');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailType, setThumbnailType] = useState<'url' | 'upload' | 'auto' | 'capture'>('auto');
    const [thumbnailUrl, setThumbnailUrl] = useState(''); // For manual URL or finalized upload

    // Upload/Crop state
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Capture state
    const [captureTime, setCaptureTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [captureVideoRef, setCaptureVideoRef] = useState<HTMLVideoElement | null>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setZoom(1);
            };
            reader.readAsDataURL(file);
            setThumbnailType('upload');
        }
    };

    const handleVideoUrlChange = (url: string) => {
        setVideoUrl(url);
        // Auto-detect YouTube for 'auto' mode
        if (thumbnailType === 'auto') {
            tryExtractYoutubeThumbnail(url);
        }
    };

    const tryExtractYoutubeThumbnail = (url: string) => {
        const youtubeId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)?.[1];
        if (youtubeId) {
            setThumbnailUrl(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
            return true;
        }
        return false;
    };

    const handleCaptureFrame = () => {
        if (captureVideoRef) {
            const canvas = document.createElement('canvas');
            canvas.width = captureVideoRef.videoWidth;
            canvas.height = captureVideoRef.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(captureVideoRef, 0, 0, canvas.width, canvas.height);
            setImageSrc(canvas.toDataURL('image/jpeg'));
            setThumbnailType('upload'); // Switch to upload/crop mode with captured image
        }
    };

    const handleSave = async () => {
        setIsUploading(true);
        let finalThumbnail = thumbnailUrl;

        try {
            if (thumbnailType === 'upload' && imageSrc && croppedAreaPixels) {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                const fileName = `thumbnail-${Date.now()}.jpg`;

                // Try uploading to 'videos' bucket first, then 'public'
                const { data, error } = await supabase.storage
                    .from('videos')
                    .upload(`${fileName}`, croppedImageBlob);

                let publicUrl = '';

                if (error) {
                    console.warn('Primary bucket upload failed, trying backup...', error);
                    const { data: publicData, error: publicError } = await supabase.storage
                        .from('public')
                        .upload(`thumbnails/${fileName}`, croppedImageBlob);

                    if (publicError) throw publicError;
                    publicUrl = supabase.storage.from('public').getPublicUrl(`thumbnails/${fileName}`).data.publicUrl;
                } else {
                    publicUrl = supabase.storage.from('videos').getPublicUrl(`${fileName}`).data.publicUrl;
                }
                finalThumbnail = publicUrl;
            }

            onSave({ title, category, videoUrl, thumbnail: finalThumbnail });
            onClose();
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Erro ao salvar vídeo. Verifique se a imagem é válida.');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden text-left flex flex-col max-h-[90vh]">
                <header className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="text-xl font-bold text-white">Adicionar Novo Vídeo</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"><X size={20} /></button>
                </header>

                <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Título do Vídeo</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-red-600 transition-colors outline-none" placeholder="Ex: Guia de Casamento" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Categoria</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-red-600 transition-colors outline-none appearance-none">
                                <option>Planejamento</option>
                                <option>Inspiração</option>
                                <option>Tutorial</option>
                                <option>Entrevista</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">URL do Vídeo</label>
                            <input value={videoUrl} onChange={e => handleVideoUrlChange(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-red-600 transition-colors outline-none" placeholder="YouTube / Vimeo / MP4" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Capa (Thumbnail)</label>
                        <div className="flex gap-2 mb-4 p-1 bg-zinc-900 rounded-2xl border border-white/5">
                            <button onClick={() => setThumbnailType('auto')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${thumbnailType === 'auto' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                                <MonitorPlay size={16} className="mx-auto mb-1" /> Auto (YouTube)
                            </button>
                            <button onClick={() => setThumbnailType('upload')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${thumbnailType === 'upload' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                                <Upload size={16} className="mx-auto mb-1" /> Upload/Ajustar
                            </button>
                            <button onClick={() => setThumbnailType('capture')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${thumbnailType === 'capture' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                                <VideoIcon size={16} className="mx-auto mb-1" /> Print do Vídeo
                            </button>
                        </div>

                        {thumbnailType === 'auto' && (
                            <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative group">
                                {thumbnailUrl ? (
                                    <img src={thumbnailUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-8">
                                        <p className="text-zinc-500 text-xs">Cole o link do YouTube acima para gerar automaticamente.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {thumbnailType === 'capture' && (
                            <div className="space-y-4">
                                {videoUrl && !videoUrl.includes('youtube') && !videoUrl.includes('vimeo') ? (
                                    <div className="bg-black rounded-2xl overflow-hidden border border-white/10 p-4">
                                        <video
                                            crossOrigin="anonymous"
                                            ref={setCaptureVideoRef}
                                            src={videoUrl}
                                            className="w-full aspect-video rounded-lg mb-4"
                                            controls
                                            onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
                                        />
                                        <button onClick={handleCaptureFrame} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl uppercase text-xs hover:bg-red-700 transition-colors">
                                            Capturar Momento Atual
                                        </button>
                                        <p className="text-zinc-500 text-[10px] mt-2 text-center">Pause o vídeo no momento desejado e clique em Capturar.</p>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-zinc-900/50 rounded-2xl border border-white/5 border-dashed">
                                        <p className="text-zinc-400 text-sm">Esta função funciona melhor com arquivos de vídeo direto (MP4, WebM).</p>
                                        <p className="text-zinc-600 text-xs mt-2">Para YouTube/Vimeo, use a opção "Auto" ou tire um print manual e use "Upload".</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {thumbnailType === 'upload' && (
                            <div className="space-y-4">
                                {!imageSrc ? (
                                    <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center transition-colors hover:border-zinc-700 hover:bg-zinc-900/50">
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="thumb-upload" />
                                        <label htmlFor="thumb-upload" className="cursor-pointer block">
                                            <Upload size={32} className="mx-auto text-zinc-600 mb-2" />
                                            <span className="text-zinc-400 text-sm font-bold">Clique para enviar imagem</span>
                                            <p className="text-zinc-600 text-xs mt-1">Recomendado: 1280x720</p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative h-64 bg-black rounded-2xl overflow-hidden border border-white/10">
                                            <Cropper
                                                image={imageSrc}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={16 / 9}
                                                onCropChange={setCrop}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-zinc-500">
                                            <div className="flex gap-4 items-center">
                                                <span>Zoom:</span>
                                                <input
                                                    type="range"
                                                    value={zoom}
                                                    min={1}
                                                    max={3}
                                                    step={0.1}
                                                    aria-labelledby="Zoom"
                                                    onChange={(e) => setZoom(Number(e.target.value))}
                                                    className="accent-red-600"
                                                />
                                            </div>
                                            <button onClick={() => setImageSrc(null)} className="text-red-500 hover:underline">Remover Imagem</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                    <button
                        onClick={handleSave}
                        disabled={isUploading || !title || (!videoUrl && !imageSrc)}
                        className="w-full bg-white text-black py-4 rounded-xl font-black uppercase hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? 'Salvando...' : <><Check size={18} /> Salvar Vídeo</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
