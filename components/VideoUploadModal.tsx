import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Upload, MonitorPlay, Image as ImageIcon, Check } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Point, Area } from 'react-easy-crop/types';

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
    const [thumbnailType, setThumbnailType] = useState<'url' | 'upload' | 'auto'>('auto');
    const [thumbnailUrl, setThumbnailUrl] = useState(''); // For manual URL or finalized upload

    // Upload/Crop state
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result as string);
            reader.readAsDataURL(file);
            setThumbnailType('upload');
        }
    };

    const handleVideoUrlChange = (url: string) => {
        setVideoUrl(url);
        if (thumbnailType === 'auto') {
            const youtubeId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)?.[1];
            if (youtubeId) {
                setThumbnailUrl(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
            }
        }
    };

    const handleSave = async () => {
        setIsUploading(true);
        let finalThumbnail = thumbnailUrl;

        try {
            if (thumbnailType === 'upload' && imageSrc && croppedAreaPixels) {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                const fileName = `thumbnail-${Date.now()}.jpg`;

                const { data, error } = await supabase.storage
                    .from('videos') // Assuming 'videos' bucket exists
                    .upload(`${fileName}`, croppedImageBlob);

                if (error) {
                    // Fallback to public bucket if videos bucket fails? or alert
                    console.error('Upload failed', error);
                    // Try 'public' bucket just in case
                    const { data: publicData, error: publicError } = await supabase.storage
                        .from('public')
                        .upload(`thumbnails/${fileName}`, croppedImageBlob);

                    if (publicError) throw publicError;

                    const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(`thumbnails/${fileName}`);
                    finalThumbnail = publicUrl;
                } else {
                    const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(`${fileName}`);
                    finalThumbnail = publicUrl;
                }
            }

            onSave({ title, category, videoUrl, thumbnail: finalThumbnail });
            onClose();
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Erro ao salvar vídeo (verifique o console).');
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
                            <input value={videoUrl} onChange={e => handleVideoUrlChange(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-red-600 transition-colors outline-none" placeholder="YouTube / Vimeo" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Thumbnail (Capa)</label>
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => setThumbnailType('auto')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${thumbnailType === 'auto' ? 'bg-zinc-800 text-white border border-white/10' : 'bg-zinc-900/50 text-zinc-500 hover:text-white'}`}>
                                <MonitorPlay size={16} className="mx-auto mb-1" /> Automática
                            </button>
                            <button onClick={() => setThumbnailType('upload')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${thumbnailType === 'upload' ? 'bg-zinc-800 text-white border border-white/10' : 'bg-zinc-900/50 text-zinc-500 hover:text-white'}`}>
                                <Upload size={16} className="mx-auto mb-1" /> Upload
                            </button>
                            <button onClick={() => setThumbnailType('url')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${thumbnailType === 'url' ? 'bg-zinc-800 text-white border border-white/10' : 'bg-zinc-900/50 text-zinc-500 hover:text-white'}`}>
                                <ImageIcon size={16} className="mx-auto mb-1" /> URL Link
                            </button>
                        </div>

                        {thumbnailType === 'auto' && (
                            <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative group">
                                {thumbnailUrl ? (
                                    <img src={thumbnailUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <p className="text-zinc-500 text-xs">Cole o link do vídeo para gerar a capa.</p>
                                )}
                            </div>
                        )}

                        {thumbnailType === 'url' && (
                            <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white" placeholder="https://..." />
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
                                )}
                                {imageSrc && (
                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                        <span>Ajuste o zoom e posição</span>
                                        <button onClick={() => setImageSrc(null)} className="text-red-500 hover:underline">Remover</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                    <button
                        onClick={handleSave}
                        disabled={isUploading || !title || !videoUrl}
                        className="w-full bg-white text-black py-4 rounded-xl font-black uppercase hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? 'Salvando...' : <><Check size={18} /> Salvar Vídeo</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
