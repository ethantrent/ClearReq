import React from 'react';
import PropTypes from 'prop-types';
import Logo from './Logo';

const Header = ({ currentPage, setCurrentPage }) => (
  <header className="sticky top-0 z-30 bg-white/70 backdrop-blur shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-2">
        <Logo className="w-8 h-8 text-[#2563eb]" color="#2563eb" />
        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#2563eb] via-[#059669] to-[#a855f7] bg-clip-text text-transparent select-none">ClearReq</span>
      </div>
      <nav className="space-x-6 text-gray-700 font-medium" aria-label="Main navigation">
        <button 
          onClick={() => setCurrentPage('home')} 
          className={`bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 hover:text-[#2563eb] active:scale-95 transition-all duration-150 ${currentPage==='home'?'text-[#2563eb]':''}`}
          aria-current={currentPage==='home' ? 'page' : undefined}
        >Home</button>
        <button 
          onClick={() => setCurrentPage('history')} 
          className={`bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 hover:text-[#2563eb] active:scale-95 transition-all duration-150 ${currentPage==='history'?'text-[#2563eb]':''}`}
          aria-current={currentPage==='history' ? 'page' : undefined}
        >History</button>
        <a href="#features" className="hover:text-[#2563eb] transition" aria-label="See all AI-powered features" title="See all AI-powered features">Features</a>
        <a href="#about" className="hover:text-[#2563eb] transition" aria-label="Learn more about ClearReq" title="Learn more about ClearReq">About</a>
      </nav>
    </div>
  </header>
);

Header.propTypes = {
  currentPage: PropTypes.string.isRequired,
  setCurrentPage: PropTypes.func.isRequired
};

export default Header; 