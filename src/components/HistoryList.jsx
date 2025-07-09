import React from 'react';
import PropTypes from 'prop-types';

const HistoryList = ({ history, onViewResult, onDownload, onClear }) => (
  <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-4">
    {history.length === 0 ? (
      <div className="p-8 flex flex-col items-center">
        <span className="text-4xl text-gray-300 mb-2">🕒</span>
        <p className="text-gray-400 text-lg font-medium">No analysis history yet</p>
        <p className="text-gray-400 text-sm mt-2">Upload a document to start analyzing requirements</p>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Analysis History</h2>
          <button 
            className="text-sm bg-red-500 text-white border border-red-500 px-4 py-2 rounded-lg shadow hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95 transition-all duration-150"
            onClick={onClear}
          >
            Clear History
          </button>
        </div>
        <ul className="space-y-2" aria-label="Analysis history">
          {history.map(item => (
            <li key={item.id} className="border-b last:border-b-0 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-medium text-gray-700">{item.fileName}</span>
                <span className="ml-2 text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
              </div>
              <div className="mt-2 sm:mt-0 flex space-x-2">
                <button 
                  className="bg-[#2563eb] text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150"
                  onClick={() => onViewResult(item)}
                >
                  View Result
                </button>
                <button 
                  className="bg-[#059669] text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-[#047857] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150"
                  onClick={() => onDownload(item)}
                >
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

HistoryList.propTypes = {
  history: PropTypes.array.isRequired,
  onViewResult: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
};

export default HistoryList; 