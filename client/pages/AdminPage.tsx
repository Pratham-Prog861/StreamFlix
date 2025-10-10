import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideoContext';
import api from '../services/api';

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V8.25c0-1.12 0.9-2.025 2.025-2.025h13.95c1.12 0 2.025.9 2.025 2.025v9c0 1.12-.9 2.025-2.025 2.025H5.025C3.9 19.275 3 18.375 3 17.25z" />
    </svg>
);

const VideoFileIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AdminPage: React.FC = () => {
    const { isAdmin, user } = useAuth();
    const { refreshVideos } = useVideos();
    const navigate = useNavigate();
    
    const [videoDetails, setVideoDetails] = useState({ title: '', description: '' });
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [isDraggingVideo, setIsDraggingVideo] = useState(false);
    
    const videoInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        navigate('/login');
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="pt-24 container mx-auto px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-400">You need admin privileges to access this page.</p>
            </div>
        );
    }

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!videoDetails.title.trim()) newErrors.title = 'Title is required.';
        if (!videoFile) newErrors.videoFile = 'A video file is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVideoDetails(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setVideoFile(files[0]);
            if (errors.videoFile) setErrors(prev => ({...prev, videoFile: ''}));
        }
    };
    
    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingVideo(isEntering);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingVideo(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setVideoFile(files[0]);
            if (errors.videoFile) setErrors(prev => ({...prev, videoFile: ''}));
        }
    };
    
    const removeFile = () => {
        setVideoFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!validateForm()) return;
        
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('video', videoFile!);
            formData.append('title', videoDetails.title);
            formData.append('description', videoDetails.description);

            await api.uploadVideo(formData);
            await refreshVideos();
            
            setMessage({type: 'success', text: 'Video uploaded successfully! Redirecting...'});
            setTimeout(() => navigate('/'), 1500);
        } catch (error: any) {
            console.error("Error uploading video:", error);
            setMessage({type: 'error', text: error.message || 'Failed to upload video.'});
        } finally {
            setIsUploading(false);
        }
    };
    
    const isFormInvalid = !videoDetails.title || !videoFile;
    const inputStyle = (hasError: boolean) => `w-full p-3 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${hasError ? 'border-red-500 ring-red-500' : 'border-gray-700 focus:ring-red-500 focus:border-red-500'}`;
    const labelStyle = "block mb-2 text-sm font-bold text-gray-300";

    return (
        <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-lg shadow-2xl shadow-black/30">
                <h1 className="text-3xl md:text-4xl font-black mb-8 text-center text-white tracking-wide">Upload New Video</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className={labelStyle}>Title *</label>
                            <input type="text" name="title" id="title" value={videoDetails.title} onChange={handleInputChange} className={inputStyle(!!errors.title)} required />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="description" className={labelStyle}>Description</label>
                            <textarea name="description" id="description" rows={4} value={videoDetails.description} onChange={handleInputChange} className={inputStyle(false)}></textarea>
                        </div>

                        <div>
                            <label className={labelStyle}>Video File *</label>
                            <div 
                                onClick={() => videoInputRef.current?.click()}
                                onDragEnter={(e) => handleDragEvent(e, true)}
                                onDragLeave={(e) => handleDragEvent(e, false)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDraggingVideo ? 'border-red-500 bg-gray-800/80' : 'border-gray-600 hover:border-red-500 bg-gray-800/50'}`}
                            >
                                <input type="file" name="videoFile" ref={videoInputRef} onChange={handleFileChange} accept="video/*" className="hidden" required />
                                {!videoFile ? (
                                    <>
                                        <UploadIcon className="w-12 h-12 text-gray-400 mb-3"/>
                                        <p className="text-sm text-gray-400"><span className="font-semibold text-red-500">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 mt-1">MP4, MOV, WebM (max 500MB)</p>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <VideoFileIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-white truncate max-w-md">{videoFile.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{Math.round(videoFile.size / 1024 / 1024)} MB</p>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile();}} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                )}
                            </div>
                            {errors.videoFile && <p className="text-red-500 text-xs mt-1">{errors.videoFile}</p>}
                            <p className="text-xs text-gray-500 mt-2">Thumbnail will be generated automatically</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <button type="submit" disabled={isUploading || isFormInvalid} className="w-full flex items-center justify-center bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:scale-100">
                            {isUploading && <SpinnerIcon />}
                            {isUploading ? 'Uploading Video...' : 'Upload Video'}
                        </button>

                        {message && (
                            <p className={`mt-4 text-center text-sm font-semibold ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;
