import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Logo from './components/Logo';
import ClearReqLogo from '../site-plan/ClearReq-Logo.png';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import HistoryList from './components/HistoryList';
import Header from './components/Header';
import Footer from './components/Footer';

// Constants
const ALLOWED_FILE_TYPES = ['text/plain', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['.txt', '.pdf'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
const HERO_LOGO_SIZE = 432; // px
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'results', 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef();

  // Filter requirements by search query (top-level, not inside renderResultsPage)
  const filteredRequirements = useMemo(() => {
    if (!analysisResult?.requirements) return [];
    if (!searchQuery.trim()) return analysisResult.requirements;
    const q = searchQuery.trim().toLowerCase();
    return analysisResult.requirements.filter(req =>
      req.text.toLowerCase().includes(q) ||
      req.id.toLowerCase().includes(q)
    );
  }, [analysisResult, searchQuery]);

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
  const validateFile = useCallback((file) => {
    const ext = file.name ? file.name.toLowerCase().slice(file.name.lastIndexOf('.')) : '';
    const typeOk = ALLOWED_FILE_TYPES.includes(file.type);
    const extOk = ALLOWED_EXTENSIONS.includes(ext);
    if (!typeOk && !extOk) {
      return 'Only .txt and .pdf files are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB.`;
    }
    return '';
  }, []);

  // Handle file selection
  const handleFileChange = useCallback((file) => {
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
  }, [validateFile]);

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
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
  }, [validateFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle click on label to open file dialog
  const handleLabelClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  // Real API call for analysis
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    setLoading(true);
    setAnalysisResult(null);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await fetch(`${API_URL}/api/analyze`, {
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
  }, [selectedFile]);

  // Clear history
  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Format date
  const formatDate = useCallback((iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  }, []);

  // Copy results to clipboard
  const copyResults = useCallback(() => {
    if (!analysisResult) return;
    const text = analysisResult.requirements.map(req => 
      `${req.id}: ${req.text} (${req.type})`
    ).join('\n');
    navigator.clipboard.writeText(text);
  }, [analysisResult]);

  // Features Section
  const features = useMemo(() => [
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
  ], []);

  const FeaturesSection = useMemo(() => () => (
    <section id="features" className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="col-span-full mb-8 text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-[#2563eb]">Features</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover how ClearReq leverages AI and machine learning to transform requirements analysis, detect ambiguities, and provide actionable insights for your projects.</p>
      </div>
      {features.map((f, i) => (
        <div key={i} className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition">
          {f.icon}
          <h3 className="mt-4 text-lg font-bold text-gray-900">{f.title}</h3>
          <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
        </div>
      ))}
    </section>
  ), [features]);

  // About Section
  const AboutSection = () => (
    <section id="about" className="max-w-4xl mx-auto py-16 px-4 text-center mt-12">
      <div className="bg-gradient-to-br from-[#f0f9ff] via-[#e0e7ff] to-[#f8fafc] rounded-2xl shadow-xl border border-gray-200 p-10">
        <h2 className="text-3xl font-extrabold mb-2 text-[#059669]">About ClearReq</h2>
        <div className="flex justify-center mb-6">
          <span className="inline-block w-24 h-1 rounded bg-gradient-to-r from-[#059669] via-[#2563eb] to-[#a855f7] opacity-70" />
        </div>
        <p className="text-lg text-gray-800 mb-6 max-w-2xl mx-auto">
          ClearReq is an <span className="font-semibold text-[#2563eb]">AI-driven requirements analysis tool</span> designed to help teams write clearer, more actionable requirements. By leveraging advanced machine learning and natural language processing, ClearReq identifies ambiguities, classifies requirements, and provides improvement suggestions—empowering you to deliver better software, faster.
        </p>
        <div className="mb-4 text-gray-700">
          <strong className="text-[#059669]">Mission:</strong> Make requirements engineering smarter, faster, and more reliable for everyone.
        </div>
        <div className="mb-4 text-gray-700">
          <strong className="text-[#2563eb]">Technology:</strong> Built with FastAPI, React, and state-of-the-art AI/ML models for natural language understanding.
        </div>
        <div className="text-gray-700">
          <strong className="text-[#a855f7]">Contact:</strong> <a href="mailto:support@clearreq.ai" className="text-[#2563eb] underline">support@clearreq.ai</a>
        </div>
      </div>
    </section>
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
          <div className="flex-1 mb-12 md:mb-0 text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#2563eb] via-[#059669] to-[#a855f7] bg-clip-text text-transparent drop-shadow-lg">
              <span className="underline decoration-[#059669]/40">AI</span>-Driven Requirements Engineering
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto">
              Upload your requirements documents and get instant insights, ambiguity detection, and improvement suggestions powered by advanced machine learning.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                className="bg-[#059669] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-[#047857] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150 text-lg"
                onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </button>
              <button className="bg-white/80 border border-[#2563eb] text-[#2563eb] px-8 py-3 rounded-xl font-semibold hover:bg-[#f0f9ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150 text-lg shadow">
                View Demo
              </button>
            </div>
          </div>
          {/* Illustration */}
          <div className="flex-1 flex justify-center">
            <div
              className={`w-[${HERO_LOGO_SIZE}px] h-[${HERO_LOGO_SIZE}px] bg-white/80 rounded-2xl flex items-center justify-center shadow-xl border border-gray-100`}
            >
              <img
                src={ClearReqLogo}
                alt="ClearReq Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                className="block mx-auto rounded-xl shadow-lg p-4 border border-gray-200 bg-white/70"
              />
            </div>
          </div>
        </div>
      </main>

      {/* File Upload Section */}
      <FileUpload
        selectedFile={selectedFile}
        error={error}
        loading={loading}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onLabelClick={handleLabelClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onAnalyze={handleAnalyze}
      />
      {/* Features Section */}
      <FeaturesSection />
    </>
  );

  // Render Results Page
  const renderResultsPage = () => (
    <div className="flex-1 py-8 px-4 bg-gradient-to-br from-[#e0e7ff] via-[#f0f9ff] to-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-4 mb-6">
          <span className="text-[#2563eb]">Home &gt; Results</span>
        </div>
        {/* Summary Card */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/80 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-[#2563eb]">{analysisResult?.summary.total || 0}</h3>
              <p className="text-gray-600">Total Requirements</p>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-[#059669]">{analysisResult?.summary.functional || 0}</h3>
              <p className="text-gray-600">Functional</p>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-[#ea580c]">{analysisResult?.summary.nonFunctional || 0}</h3>
              <p className="text-gray-600">Non-Functional</p>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-[#dc2626]">{analysisResult?.summary.ambiguities || 0}</h3>
              <p className="text-gray-600">Ambiguities</p>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4">
          <select className="px-3 py-2 border rounded-lg bg-white text-black">
            <option>Sort by: ID</option>
            <option>Sort by: Type</option>
            <option>Sort by: Confidence</option>
          </select>
          <select className="px-3 py-2 border rounded-lg bg-white text-black">
            <option>Filter: All</option>
            <option>Filter: Functional</option>
            <option>Filter: Non-Functional</option>
          </select>
          <input 
            type="text" 
            placeholder="Search requirements..." 
            className="px-3 py-2 border rounded-lg flex-1 min-w-48 bg-white text-black"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search requirements"
          />
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results Table */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Requirements Analysis Results</h3>
            <ResultsTable requirements={filteredRequirements} />
          </div>
          {/* Sidebar */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ambiguity Highlights</h3>
            <div className="space-y-3 mb-6">
              {analysisResult?.ambiguities.map(amb => (
                <div key={amb.id} className="bg-white/90 p-3 rounded border border-gray-200 shadow-sm">
                  <strong className="text-[#ea580c]">{amb.id}:</strong> {amb.text}
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-[#059669] text-white px-4 py-2 rounded hover:bg-[#047857] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150">
                Export to PDF
              </button>
              <button 
                className="w-full bg-[#2563eb] text-white px-4 py-2 rounded hover:bg-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150"
                onClick={copyResults}
              >
                Copy All Results
              </button>
              <button className="w-full bg-[#ea580c] text-white px-4 py-2 rounded hover:bg-[#c2410c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150">
                Save Analysis
              </button>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="bg-[#059669] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#047857] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150">
            Download Results
          </button>
          <button 
            className="bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150"
            onClick={copyResults}
          >
            Copy to Clipboard
          </button>
          <button 
            className="bg-[#ea580c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c2410c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 active:scale-95 transition-all duration-150"
            onClick={() => setCurrentPage('home')}
          >
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );

  // Render History Page
  const handleViewResult = useCallback((item) => {
    setAnalysisResult(item.result);
    setCurrentPage('results');
  }, []);
  const handleDownload = useCallback((item) => {
    // Stub: implement download logic if needed
  }, []);
  const renderHistoryPage = () => (
    <div className="flex-1 py-8 px-4 bg-gradient-to-br from-[#e0e7ff] via-[#f0f9ff] to-[#f8fafc]">
      <div className="max-w-4xl mx-auto">
        <HistoryList
          history={history}
          onViewResult={handleViewResult}
          onDownload={handleDownload}
          onClear={handleClearHistory}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' && (
        <>
          {renderHomePage()}
          <AboutSection />
        </>
      )}
      {currentPage === 'results' && analysisResult && renderResultsPage()}
      {currentPage === 'history' && renderHistoryPage()}
      <Footer />
    </div>
  );
}

export default App;
