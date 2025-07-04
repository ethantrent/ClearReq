import React, { useRef, useState, useEffect } from 'react';
import Logo from './components/Logo';
import ClearReqLogo from './assets/ClearReq-Logo.png';

function App() {
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'results', 'history'
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

  // Real API call for analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setAnalysisResult(null);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze document');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
      setCurrentPage('results');
      
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
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze document. Please try again.');
    } finally {
      setLoading(false);
    }
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

  // Copy results to clipboard
  const copyResults = () => {
    if (!analysisResult) return;
    const text = analysisResult.requirements.map(req => 
      `${req.id}: ${req.text} (${req.type})`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  // Features Section
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1V8h-1m-4 8h1v-4h1m-4 0h1V8h1" /></svg>
      ),
      title: 'AI-Powered Analysis',
      desc: 'Extracts and classifies requirements using advanced ML.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" /></svg>
      ),
      title: 'Ambiguity Detection',
      desc: 'Flags unclear or incomplete requirements for review.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#f59e42]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
      ),
      title: 'Instant Results',
      desc: 'Get actionable insights in seconds after upload.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#a855f7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      ),
      title: 'Export & History',
      desc: 'Download results and view your analysis history.'
    },
  ];

  const FeaturesSection = () => (
    <section id="features" className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((f, i) => (
        <div key={i} className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition">
          {f.icon}
          <h3 className="mt-4 text-lg font-bold text-gray-900">{f.title}</h3>
          <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
        </div>
      ))}
    </section>
  );

  // Footer
  const Footer = () => (
    <footer id="footer" className="w-full bg-white/80 backdrop-blur border-t border-gray-100 py-6 mt-16 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} ClearReq. All rights reserved.
    </footer>
  );

  // Header
  const Header = () => (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <span className="text-2xl font-extrabold tracking-tight text-[#2563eb] select-none">ClearReq</span>
        <nav className="space-x-6 text-gray-700 font-medium">
          <button onClick={() => setCurrentPage('home')} className={`hover:text-[#2563eb] transition ${currentPage==='home'?'text-[#2563eb]':''}`}>Home</button>
          <button onClick={() => setCurrentPage('history')} className={`hover:text-[#2563eb] transition ${currentPage==='history'?'text-[#2563eb]':''}`}>History</button>
          <a href="#features" className="hover:text-[#2563eb] transition">Features</a>
          <a href="#footer" className="hover:text-[#2563eb] transition">About</a>
        </nav>
      </div>
    </header>
  );

  // Modernized Home Page
  const renderHomePage = () => (
    <>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 bg-gradient-to-br from-[#e0e7ff] via-[#f0f9ff] to-[#f8fafc] relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-[#2563eb]/30 via-[#059669]/20 to-[#a855f7]/10 rounded-full blur-3xl opacity-60 z-0" />
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center md:space-x-12 z-10">
          {/* Text Content */}
          <div className="flex-1 mb-12 md:mb-0">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#2563eb] via-[#059669] to-[#a855f7] bg-clip-text text-transparent drop-shadow-lg">
              Transform Requirements Analysis with <span className="underline decoration-[#059669]/40">AI</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-xl">
              Upload your requirements documents and get instant insights, ambiguity detection, and improvement suggestions powered by advanced machine learning.
            </p>
            <div className="flex space-x-4">
              <button 
                className="bg-[#059669] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-[#047857] transition text-lg"
                onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </button>
              <button className="bg-white/80 border border-[#2563eb] text-[#2563eb] px-8 py-3 rounded-xl font-semibold hover:bg-[#f0f9ff] transition text-lg shadow">
                View Demo
              </button>
            </div>
          </div>
          {/* Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 bg-white/80 rounded-2xl flex items-center justify-center shadow-xl border border-gray-100">
              <img 
                src={ClearReqLogo} 
                alt="ClearReq Logo" 
                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                className="block mx-auto bg-white rounded-xl shadow-lg p-4"
              />
            </div>
          </div>
        </div>
      </main>

      {/* File Upload Section */}
      <section id="upload-section" className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📄 Upload Your Document</h2>
          <form className="w-full flex flex-col items-center" onSubmit={e => e.preventDefault()}>
            <div
              className={`w-full flex flex-col items-center justify-center border-2 border-dashed border-[#2563eb] rounded-xl p-8 cursor-pointer hover:border-[#1d4ed8] transition mb-6 bg-[#f0f9ff] ${error ? 'border-red-400' : ''}`}
              onClick={handleLabelClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <span className="text-gray-500 mb-2">Drop your <b>.txt</b> or <b>.pdf</b> file here</span>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <span className="text-sm text-gray-400">or click to select a file</span>
              {selectedFile && (
                <span className="mt-2 text-green-600 font-medium">{selectedFile.name}</span>
              )}
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
              type="button"
              className={`w-full bg-[#2563eb] text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-[#1d4ed8] transition text-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={handleAnalyze}
              disabled={loading || !selectedFile}
            >
              {loading ? 'Analyzing...' : 'Analyze Document'}
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />
    </>
  );

  // Render Results Page
  const renderResultsPage = () => (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="bg-[#f0f9ff] p-4 rounded-lg border border-[#2563eb] mb-6">
          <span className="text-[#2563eb]">Home &gt; Results</span>
        </div>

        {/* Summary Card */}
        <div className="bg-[#f0fdf4] p-6 rounded-lg border border-[#059669] mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <h3 className="text-2xl font-bold text-[#2563eb]">{analysisResult?.summary.total || 0}</h3>
              <p className="text-gray-600">Total Requirements</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <h3 className="text-2xl font-bold text-[#059669]">{analysisResult?.summary.functional || 0}</h3>
              <p className="text-gray-600">Functional</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <h3 className="text-2xl font-bold text-[#ea580c]">{analysisResult?.summary.nonFunctional || 0}</h3>
              <p className="text-gray-600">Non-Functional</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <h3 className="text-2xl font-bold text-[#dc2626]">{analysisResult?.summary.ambiguities || 0}</h3>
              <p className="text-gray-600">Ambiguities</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#f8fafc] p-4 rounded-lg border mb-6 flex flex-wrap gap-4">
          <select className="px-3 py-2 border rounded-lg">
            <option>Sort by: ID</option>
            <option>Sort by: Type</option>
            <option>Sort by: Confidence</option>
          </select>
          <select className="px-3 py-2 border rounded-lg">
            <option>Filter: All</option>
            <option>Filter: Functional</option>
            <option>Filter: Non-Functional</option>
          </select>
          <input 
            type="text" 
            placeholder="Search requirements..." 
            className="px-3 py-2 border rounded-lg flex-1 min-w-48"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Requirements Analysis Results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#2563eb] text-white">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Requirement Text</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Confidence</th>
                    <th className="px-4 py-2 text-left">Ambiguity</th>
                    <th className="px-4 py-2 text-left">AI Suggestions</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult?.requirements.map(req => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-[#2563eb]">{req.id}</td>
                      <td className="px-4 py-3 text-gray-800">{req.text}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          req.type === 'Functional' ? 'bg-[#059669] text-white' : 
                          req.type === 'Non-Functional' ? 'bg-[#ea580c] text-white' : 
                          'bg-gray-500 text-white'
                        }`}>
                          {req.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{req.confidence}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          req.ambiguity === 'Low' ? 'bg-green-100 text-green-800' : 
                          req.ambiguity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.ambiguity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{req.suggestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-[#fff7ed] rounded-lg border border-[#ea580c] p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ambiguity Highlights</h3>
            <div className="space-y-3 mb-6">
              {analysisResult?.ambiguities.map(amb => (
                <div key={amb.id} className="bg-white p-3 rounded border">
                  <strong className="text-[#ea580c]">{amb.id}:</strong> {amb.text}
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-[#059669] text-white px-4 py-2 rounded hover:bg-[#047857] transition">
                Export to PDF
              </button>
              <button 
                className="w-full bg-[#2563eb] text-white px-4 py-2 rounded hover:bg-[#1d4ed8] transition"
                onClick={copyResults}
              >
                Copy All Results
              </button>
              <button className="w-full bg-[#ea580c] text-white px-4 py-2 rounded hover:bg-[#c2410c] transition">
                Save Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="bg-[#059669] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#047857] transition">
            Download Results
          </button>
          <button 
            className="bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition"
            onClick={copyResults}
          >
            Copy to Clipboard
          </button>
          <button 
            className="bg-[#ea580c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c2410c] transition"
            onClick={() => setCurrentPage('home')}
          >
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );

  // Render History Page
  const renderHistoryPage = () => (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Analysis History</h2>
          <button 
            className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded hover:bg-red-50 transition" 
            onClick={handleClearHistory}
          >
            Clear History
          </button>
        </div>
        
        {history.length === 0 ? (
          <div className="bg-[#f8fafc] rounded-xl shadow p-8 flex flex-col items-center">
            <span className="text-4xl text-gray-300 mb-2">🕒</span>
            <p className="text-gray-400 text-lg font-medium">No analysis history yet</p>
            <p className="text-gray-400 text-sm mt-2">Upload a document to start analyzing requirements</p>
          </div>
        ) : (
          <div className="bg-[#f8fafc] rounded-xl shadow p-4">
            <ul className="space-y-2">
              {history.map(item => (
                <li key={item.id} className="border-b last:border-b-0 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-medium text-gray-700">{item.fileName}</span>
                    <span className="ml-2 text-xs text-gray-400">{formatDate(item.timestamp)}</span>
                  </div>
                  <div className="mt-2 sm:mt-0 flex space-x-2">
                    <button 
                      className="text-[#2563eb] text-sm hover:underline" 
                      onClick={() => {
                        setAnalysisResult(item.result);
                        setCurrentPage('results');
                      }}
                    >
                      View Result
                    </button>
                    <button className="text-[#059669] text-sm hover:underline">
                      Download
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'results' && analysisResult && renderResultsPage()}
      {currentPage === 'history' && renderHistoryPage()}
      <Footer />
    </div>
  );
}

export default App;
