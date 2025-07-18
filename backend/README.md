# ClearReq Backend API

AI-Driven Requirements Analyzer Backend

## Overview

This is the FastAPI backend for the ClearReq application. It provides REST API endpoints for:
- File upload and text extraction (TXT, PDF)
- Requirements extraction and classification
- AI-powered ambiguity detection and suggestions
- Analysis history management

## Features

- **File Processing**: Extract text from TXT and PDF files
- **ML Pipeline**: Extract and classify requirements using pattern matching
- **AI Analysis**: Detect ambiguities and generate improvement suggestions
- **REST API**: FastAPI-based endpoints with automatic documentation
- **CORS Support**: Configured for frontend integration

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the API

### Development Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Using Uvicorn (Alternative)

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

### Analysis
- `POST /api/analyze` - Upload and analyze requirements document
- `GET /api/history` - Get analysis history (placeholder)

## Testing

Run the test script to verify the API:

```bash
python test_api.py
```

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── test_api.py         # API test script
├── README.md           # This file
├── models/
│   ├── __init__.py
│   └── schemas.py      # Pydantic data models
└── services/
    ├── __init__.py
    ├── file_processor.py    # File processing service
    ├── ml_pipeline.py       # ML requirements extraction
    └── ai_analyzer.py       # AI analysis and suggestions
```

## Development

### Adding New Features

1. **New Endpoints**: Add to `main.py`
2. **Data Models**: Add to `models/schemas.py`
3. **Business Logic**: Add to appropriate service in `services/`

### Environment Variables

Create a `.env` file for configuration:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS Origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Next Steps

- [ ] Add OpenAI/HuggingFace integration for enhanced AI analysis
- [ ] Implement scikit-learn for better ML classification
- [ ] Add database for analysis history
- [ ] Add authentication and user management
- [ ] Add comprehensive test suite
- [ ] Add Docker containerization
- [ ] Add deployment scripts

## License

This project is part of the ClearReq AI-Driven Requirements Analyzer. 