import React from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({
  selectedFile,
  error,
  loading,
  fileInputRef,
  onFileChange,
  onLabelClick,
  onDrop,
  onDragOver,
  onAnalyze
}) => {
  // Keyboard accessibility for drop area
  const handleDropAreaKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onLabelClick();
    }
  };

  return (
    <section id="upload-section" className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📄 Upload Your Document</h2>
        <form className="w-full flex flex-col items-center" onSubmit={e => e.preventDefault()}>
          <div
            className={`w-full flex flex-col items-center justify-center border-2 border-dashed border-[#2563eb] rounded-xl p-8 cursor-pointer hover:border-[#1d4ed8] transition mb-6 bg-[#f0f9ff] ${error ? 'border-red-400' : ''}`}
            onClick={onLabelClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            tabIndex={0}
            onKeyDown={handleDropAreaKeyDown}
            aria-label="File upload drop area"
          >
            <label htmlFor="file-upload" className="text-gray-500 mb-2 cursor-pointer">
              Drop your <b>.txt</b> or <b>.pdf</b> file here
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf"
              className="hidden"
              ref={fileInputRef}
              data-testid="file-input"
              onChange={e => onFileChange(e.target.files[0])}
              aria-describedby="file-upload-help file-upload-error"
            />
            <span id="file-upload-help" className="text-sm text-gray-400">or click to select a file</span>
            {selectedFile && (
              <span className="mt-2 text-green-600 font-medium">{selectedFile.name}</span>
            )}
          </div>
          {error && <div id="file-upload-error" className="text-red-500 mb-2" role="alert">{error}</div>}
          <button
            type="button"
            className={`w-full bg-[#2563eb] text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-[#1d4ed8] transition text-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading || !selectedFile}
            onClick={onAnalyze}
          >
            {loading ? 'Analyzing...' : 'Analyze Document'}
          </button>
        </form>
      </div>
    </section>
  );
};

FileUpload.propTypes = {
  selectedFile: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null])
  ]),
  error: PropTypes.string,
  loading: PropTypes.bool,
  fileInputRef: PropTypes.object,
  onFileChange: PropTypes.func.isRequired,
  onLabelClick: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onAnalyze: PropTypes.func.isRequired
};

export default FileUpload; 