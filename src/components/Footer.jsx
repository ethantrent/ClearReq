import React from 'react';
// No props for Footer

const Footer = () => (
  <footer id="footer" className="w-full bg-gradient-to-br from-[#e0e7ff] via-[#f0f9ff] to-[#e0e7ff] border-t border-gray-200 py-8 mt-20 text-center text-gray-600 text-sm relative">
    <div className="flex justify-center mb-4">
      <span className="inline-block w-24 h-1 rounded bg-gradient-to-r from-[#059669] via-[#2563eb] to-[#a855f7] opacity-70" />
    </div>
    <div className="mb-2 font-semibold tracking-wide">&copy; {new Date().getFullYear()} ClearReq. All rights reserved.</div>
    <div className="text-xs text-gray-400">Empowering clarity in requirements engineering.</div>
  </footer>
);

// No PropTypes needed for Footer
export default Footer; 