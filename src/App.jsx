import React, { useRef, useState, useEffect } from 'react';

function App() {
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef();

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('analysisHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(history));
  }, [history]);

  // File validation
  const validateFile = (file) => {
    const allowedTypes = ['text/plain', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!allowedTypes.includes(file.type)) {
      return 'Only .txt and .pdf files are allowed.';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 10MB.';
    }
    return '';
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setError('');
      }
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setError('');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle click on label to open file dialog
  const handleLabelClick = () => {
    fileInputRef.current.click();
  };

  // Simulate API call for analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setAnalysisResult(null);
    setError('');
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      const result = {
        requirements: [
          { id: 1, text: 'The system shall allow users to log in with a username and password.', type: 'Functional', suggestion: 'Consider supporting OAuth login.' },
          { id: 2, text: 'The system should be available 99.9% of the time.', type: 'Nonfunctional', suggestion: 'Specify acceptable downtime windows.' },
          { id: 3, text: 'The user interface must be intuitive.', type: 'Ambiguous', suggestion: 'Define what "intuitive" means with measurable criteria.' },
        ],
      };
      setAnalysisResult(result);
      // Save to history
      setHistory(prev => [
        {
          id: Date.now(),
          fileName: selectedFile.name,
          timestamp: new Date().toISOString(),
          result,
        },
        ...prev,
      ]);
    }, 2000);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Format date
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Nav Bar */}
      <header className="w-full bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">AI Requirements Analyzer</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Results</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">History</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center md:space-x-12">
          {/* Text Content */}
          <div className="flex-1 mb-8 md:mb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              AI-Driven Requirements <span className="text-blue-600">Analyzer</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Upload your software requirements documents and let our AI extract, classify, and improve them using advanced machine learning and generative AI technologies.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Get Started</button>
              <button className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">View Demo</button>
            </div>
          </div>
          {/* Illustration Placeholder */}
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-400 text-6xl">🧠</span>
            </div>
          </div>
        </div>
      </main>

      {/* File Upload Section */}
      <section className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Requirements Document</h2>
          <form className="w-full flex flex-col items-center" onSubmit={e => e.preventDefault()}>
            <div
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition mb-4 bg-blue-50"
              onClick={handleLabelClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <span className="text-gray-500 mb-2">Drop your file here or click to browse</span>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {selectedFile && (
                <span className="mt-2 text-blue-600 text-sm font-medium">{selectedFile.name}</span>
              )}
            </div>
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition w-full max-w-xs flex items-center justify-center"
              disabled={!selectedFile || loading}
              onClick={handleAnalyze}
            >
              {loading ? (
                <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Analyzing...</span>
              ) : (
                'Analyze Requirements'
              )}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
          <p className="text-xs text-gray-400 mt-2">Supports .txt and .pdf files up to 10MB</p>
        </div>
      </section>

      {/* Powerful AI Features Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Powerful AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-sm">
              <span className="text-4xl mb-4 text-blue-500">🔍</span>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Smart Extraction</h3>
              <p className="text-gray-500 text-center">Automatically extract and classify requirements using advanced ML techniques and NLP.</p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-sm">
              <span className="text-4xl mb-4 text-blue-500">📊</span>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Deep Analysis</h3>
              <p className="text-gray-500 text-center">Identify ambiguities, inconsistencies, and issues in your requirements.</p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-sm">
              <span className="text-4xl mb-4 text-blue-500">💡</span>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">AI Suggestions</h3>
              <p className="text-gray-500 text-center">Get intelligent recommendations to improve clarity and quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Results Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Analysis Results</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-10">
              <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <p className="text-blue-400 text-lg font-medium">Analyzing document...</p>
            </div>
          ) : analysisResult ? (
            <div className="bg-white rounded-xl shadow p-8">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-gray-700 font-semibold">Requirement</th>
                    <th className="px-4 py-2 text-gray-700 font-semibold">Type</th>
                    <th className="px-4 py-2 text-gray-700 font-semibold">AI Suggestion</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.requirements.map(req => (
                    <tr key={req.id} className="border-t">
                      <td className="px-4 py-2 align-top text-gray-800">{req.text}</td>
                      <td className="px-4 py-2 align-top text-blue-600 font-medium">{req.type}</td>
                      <td className="px-4 py-2 align-top text-gray-600">{req.suggestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-10">
              <span className="text-5xl text-blue-300 mb-4">📄</span>
              <p className="text-gray-400 text-lg font-medium">No Analysis Yet</p>
              <p className="text-gray-400 text-sm mt-2">Upload a document to see analysis results here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Analysis History Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Analysis History</h2>
            <button className="text-sm text-red-500 border border-red-200 px-4 py-1 rounded hover:bg-red-50 transition" onClick={handleClearHistory}>Clear History</button>
          </div>
          {history.length === 0 ? (
            <div className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center">
              <span className="text-4xl text-gray-300 mb-2">🕒</span>
              <p className="text-gray-400 text-lg font-medium">No analysis history yet</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl shadow p-4">
              <ul>
                {history.map(item => (
                  <li key={item.id} className="border-b last:border-b-0 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-medium text-gray-700">{item.fileName}</span>
                      <span className="ml-2 text-xs text-gray-400">{formatDate(item.timestamp)}</span>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <button className="text-blue-600 text-sm hover:underline" onClick={() => setAnalysisResult(item.result)}>View Result</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
