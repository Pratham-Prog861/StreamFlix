import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../context/VideoContext';
import { Video } from '../types';
import SearchResultsDropdown from './SearchResultsDropdown';

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

interface SearchInputProps {
    onResultClick?: () => void;
    isMobile?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onResultClick, isMobile = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Video[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    const navigate = useNavigate();
    const { allVideos } = useVideos();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setIsDropdownVisible(false);
            return;
        }

        const searchTimer = setTimeout(() => {
            const query = searchQuery.toLowerCase();
            const results = allVideos.filter(video =>
                video.title.toLowerCase().includes(query) ||
                video.description.toLowerCase().includes(query) ||
                video.genre.toLowerCase().includes(query)
            ).slice(0, 7);

            setSearchResults(results);
            setIsDropdownVisible(results.length > 0);
        }, 300);

        return () => clearTimeout(searchTimer);
    }, [searchQuery, allVideos]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            cleanupAfterSearch();
        }
    };
    
    const cleanupAfterSearch = () => {
        setSearchQuery('');
        setIsDropdownVisible(false);
        onResultClick?.();
    }

    const desktopInputClass = "bg-black border border-gray-600 rounded-full py-1 pl-4 pr-8 w-40 sm:w-56 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 text-white text-sm";
    const mobileInputClass = "bg-gray-800 border border-gray-700 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-600 text-white";

    return (
        <div className="relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => { if (searchResults.length > 0) setIsDropdownVisible(true); }}
                    placeholder="Search..."
                    className={isMobile ? mobileInputClass : desktopInputClass}
                    autoComplete="off"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <SearchIcon />
                </button>
            </form>
            {isDropdownVisible && <SearchResultsDropdown results={searchResults} query={searchQuery} onClose={cleanupAfterSearch} />}
        </div>
    );
};

export default SearchInput;