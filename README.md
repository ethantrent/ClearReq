# ClearReq – AI-Driven Requirements Analyzer

ClearReq is a full-stack web application that uses AI and machine learning to automate the extraction, classification, and improvement of software requirements from documents. It features a modern React frontend and a FastAPI backend, with support for both Hugging Face and OpenAI for advanced ambiguity detection and suggestions.

---

## Table of Contents

- [Features](#features)
- [Demo & Screenshots](#demo--screenshots)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [AI Integration](#ai-integration)
- [Usage](#usage)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Configuration & Environment Variables](#configuration--environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **File Upload:** Upload TXT or PDF requirements documents.
- **ML Pipeline:** Extracts and classifies requirements (functional vs. non-functional).
- **AI-Powered Analysis:** Detects ambiguities and generates improvement suggestions using Hugging Face or OpenAI.
- **Results Dashboard:** View extracted requirements, ambiguity levels, and AI suggestions in a responsive UI.
- **History:** Track and review past analyses.
- **Export:** Copy or download results for further use.
- **Accessibility:** Responsive, accessible design with modern UI/UX.

---

## Demo & Screenshots

- ![ClearReq Logo](site-plan/ClearReq-Logo.png)
- See wireframes and design: [Home Wireframe](site-plan/home-wireframe.html), [Results Wireframe](site-plan/results-wireframe.html)

---

## Architecture

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI (Python), REST API
- **AI/ML:** Hugging Face Inference API (default), OpenAI API (optional), local heuristics fallback
- **Testing:** Jest (frontend), Python unittest/requests (backend)

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- pip

---

### Frontend

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

---

### Backend

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```
2. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   pip install requests  # For Hugging Face API
   ```
3. **Set up environment variables:**  
   Create a `.env` file in the `backend/` directory:
   ```
   # For Hugging Face (recommended, free tier)
   HF_API_KEY=your_huggingface_token_here

   # (Optional) For OpenAI
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. **Run the backend server:**
   ```bash
   cd backend
   python main.py
   ```
   The API will be available at `http://localhost:8000`

---

## AI Integration

- **Hugging Face (default):**  
  Uses the Mixtral-8x7B-Instruct model for ambiguity detection and suggestions.  
  Get a free API key at [huggingface.co](https://huggingface.co/settings/tokens).

- **OpenAI (optional):**  
  If `OPENAI_API_KEY` is set, uses GPT-4o for analysis (requires paid account or trial credits).

- **Local Heuristics:**  
  If no API keys are set, falls back to built-in pattern matching and suggestions.

---

## Usage

1. Open the frontend in your browser (`http://localhost:5173`).
2. Upload a requirements document (TXT or PDF).
3. Click “Analyze.”
4. View extracted requirements, ambiguity levels, and AI suggestions.
5. Copy or download results as needed.
6. Review analysis history.

---

## Testing

### Frontend

- Run all tests:
  ```bash
  npm test
  ```

### Backend

- Run API tests:
  ```bash
  cd backend
  python test_api.py
  ```

---

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.py          # API test script
│   ├── models/
│   ├── services/
│   └── ...
├── src/
│   ├── App.jsx              # Main React app
│   ├── components/          # React components
│   └── ...
├── public/
├── site-plan/               # Design docs, wireframes, logo
├── package.json
└── README.md
```

---

## Configuration & Environment Variables

- **HF_API_KEY:** Hugging Face API key (recommended, free tier available)
- **OPENAI_API_KEY:** OpenAI API key (optional, paid or trial)
- **Other backend settings:** See `backend/.env` and `backend/README.md` for more.

**Never commit your `.env` file or API keys to version control!**

---

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests.
3. Submit a pull request with a clear description.

---

## License

This project is part of the ClearReq AI-Driven Requirements Analyzer.
