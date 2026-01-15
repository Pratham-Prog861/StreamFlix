import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50 border-t border-gray-800 mt-12 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} StreamFlix. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
