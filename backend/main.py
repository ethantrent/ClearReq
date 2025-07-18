from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import List, Dict, Any
import os
from datetime import datetime
import json

# Import our modules (we'll create these next)
from services.file_processor import FileProcessor
from services.ml_pipeline import MLPipeline
from services.ai_analyzer import AIAnalyzer
from models.schemas import AnalysisRequest, AnalysisResponse, Requirement

app = FastAPI(
    title="ClearReq API",
    description="AI-Driven Requirements Analyzer API",
    version="1.0.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
file_processor = FileProcessor()
ml_pipeline = MLPipeline()
ai_analyzer = AIAnalyzer()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "ClearReq API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "services": {
            "file_processor": "ready",
            "ml_pipeline": "ready", 
            "ai_analyzer": "ready"
        }
    }

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_requirements(file: UploadFile = File(...)):
    """
    Analyze requirements from uploaded document
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.txt', '.pdf')):
            raise HTTPException(
                status_code=400, 
                detail="Only .txt and .pdf files are supported"
            )
        
        # Validate file size (10MB limit)
        if file.size > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size must be less than 10MB"
            )
        
        # Process the file
        print(f"Processing file: {file.filename}")
        
        # Extract text from file
        text_content = await file_processor.extract_text(file)
        
        # Extract requirements using ML
        requirements = await ml_pipeline.extract_requirements(text_content)
        
        # Analyze with AI for suggestions and ambiguities
        enhanced_requirements = await ai_analyzer.enhance_requirements(requirements)
        
        # Generate summary
        summary = {
            "total": len(enhanced_requirements),
            "functional": len([r for r in enhanced_requirements if r.type == "Functional"]),
            "nonFunctional": len([r for r in enhanced_requirements if r.type == "Non-Functional"]),
            "ambiguities": len([r for r in enhanced_requirements if r.ambiguity in ["High", "Medium"]])
        }
        
        # Identify ambiguities
        ambiguities = [
            {"id": r.id, "text": r.text, "severity": r.ambiguity}
            for r in enhanced_requirements 
            if r.ambiguity in ["High", "Medium"]
        ]
        
        return AnalysisResponse(
            summary=summary,
            requirements=enhanced_requirements,
            ambiguities=ambiguities,
            filename=file.filename,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/api/history")
async def get_analysis_history():
    """Get analysis history (placeholder for now)"""
    return {"history": []}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 