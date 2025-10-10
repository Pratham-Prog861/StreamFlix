import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideoContext';
import VideoCard from '../components/VideoCard';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const EditIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { allVideos, watchlist } = useVideos();
    const navigate = useNavigate();
    const watchlistVideos = allVideos.filter(video => watchlist.includes(video.id));

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '', avatar: user?.avatar || '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [avatarMode, setAvatarMode] = useState<'upload' | 'url'>('url');
    const avatarInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        navigate('/login');
        return null;
    }
    
    const handleEditClick = () => {
        setIsEditing(true);
        setEditData({ name: user.name, email: user.email, avatar: user.avatar });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditData({ name: user.name, email: user.email, avatar: user.avatar });
        setError('');
    };

    const handleSaveClick = async () => {
        setSaving(true);
        setError('');
        try {
            await updateUser(editData);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            // Check file size (max 2MB for base64)
            if (file.size > 2 * 1024 * 1024) {
                setError('Image too large. Please use an image under 2MB or provide a URL instead.');
                return;
            }
            try {
                const base64Avatar = await fileToBase64(file);
                setEditData(prev => ({ ...prev, avatar: base64Avatar }));
                setError('');
            } catch (error) {
                console.error("Error converting avatar to base64", error);
                setError('Failed to process image. Try using a URL instead.');
            }
        }
    };
    
    const triggerAvatarUpload = () => {
        avatarInputRef.current?.click();
    };
    
    const inputStyle = `w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300`;

  return (
    <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="relative group flex-shrink-0">
                 <img 
                    src={isEditing ? (editData.avatar || 'https://picsum.photos/seed/user/200') : (user.avatar || 'https://picsum.photos/seed/user/200')} 
                    alt="User Avatar"
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-red-600 object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/user/200';
                    }}
                />
            </div>
            
            <div className="md:ml-8 mt-4 md:mt-0">
                {isEditing ? (
                    <div className="space-y-4 max-w-sm mx-auto md:mx-0">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-500 px-3 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-400 mb-1 text-left">Name</label>
                            <input 
                                type="text" 
                                id="name"
                                name="name"
                                value={editData.name} 
                                onChange={handleInputChange} 
                                className={inputStyle}
                            />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-400 mb-1 text-left">Email</label>
                             <input 
                                type="email" 
                                id="email"
                                name="email"
                                value={editData.email} 
                                onChange={handleInputChange} 
                                className={inputStyle}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 text-left">Avatar</label>
                            <div className="flex space-x-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setAvatarMode('url')}
                                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition ${
                                        avatarMode === 'url' 
                                            ? 'bg-red-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAvatarMode('upload')}
                                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition ${
                                        avatarMode === 'upload' 
                                            ? 'bg-red-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Upload
                                </button>
                            </div>
                            {avatarMode === 'url' ? (
                                <input 
                                    type="url" 
                                    id="avatar"
                                    name="avatar"
                                    placeholder="https://example.com/avatar.jpg"
                                    value={editData.avatar} 
                                    onChange={handleInputChange} 
                                    className={inputStyle}
                                />
                            ) : (
                                <div>
                                    <button
                                        type="button"
                                        onClick={triggerAvatarUpload}
                                        className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                                    >
                                        Choose Image (max 2MB)
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={avatarInputRef} 
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                        className="hidden" 
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-4 pt-4">
                            <button onClick={handleSaveClick} disabled={saving} className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition duration-300 flex-1 disabled:bg-gray-600">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={handleCancelClick} disabled={saving} className="bg-gray-600 text-white font-bold py-2 px-6 rounded hover:bg-gray-700 transition duration-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl md:text-5xl font-bold">{user.name}</h1>
                        <p className="text-lg text-gray-400 mt-2">{user.email}</p>
                        {user.role === 'admin' && (
                            <span className="inline-block mt-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">ADMIN</span>
                        )}
                        <button onClick={handleEditClick} className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition duration-300">
                            Edit Profile
                        </button>
                    </>
                )}
            </div>
        </div>
        
        <div className="mt-12">
           {watchlistVideos.length > 0 ? (
                <section className="my-6 md:my-10">
                    <div className="flex justify-between items-baseline mb-4 px-4 sm:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">My Watchlist</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 px-4 sm:px-6 lg:px-8">
                        {watchlistVideos.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </section>
           ) : (
                <div className="text-center py-16 px-4 border-2 border-dashed border-gray-700 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-2">Your Watchlist is Empty</h2>
                    <p className="text-gray-400">
                        Use the '+' icon on any movie or show to add it to your list.
                    </p>
                </div>
           )}
        </div>
    </div>
  );
};

export default ProfilePage;
