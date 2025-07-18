from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class Requirement(BaseModel):
    """Individual requirement model"""
    id: str = Field(..., description="Unique requirement identifier")
    text: str = Field(..., description="Requirement text content")
    type: str = Field(..., description="Requirement type: Functional, Non-Functional, or Ambiguous")
    confidence: int = Field(..., ge=0, le=100, description="ML confidence score (0-100)")
    ambiguity: str = Field(..., description="Ambiguity level: Low, Medium, or High")
    suggestion: str = Field(..., description="AI-generated improvement suggestion")

class Summary(BaseModel):
    """Analysis summary statistics"""
    total: int = Field(..., description="Total number of requirements")
    functional: int = Field(..., description="Number of functional requirements")
    nonFunctional: int = Field(..., description="Number of non-functional requirements")
    ambiguities: int = Field(..., description="Number of ambiguous requirements")

class Ambiguity(BaseModel):
    """Ambiguity detection result"""
    id: str = Field(..., description="Requirement ID with ambiguity")
    text: str = Field(..., description="Description of the ambiguity")
    severity: str = Field(..., description="Severity level: Low, Medium, or High")

class AnalysisRequest(BaseModel):
    """Request model for analysis"""
    filename: str = Field(..., description="Name of the uploaded file")

class AnalysisResponse(BaseModel):
    """Response model for analysis results"""
    summary: Summary = Field(..., description="Analysis summary statistics")
    requirements: List[Requirement] = Field(..., description="List of extracted requirements")
    ambiguities: List[Ambiguity] = Field(..., description="List of detected ambiguities")
    filename: str = Field(..., description="Original filename")
    timestamp: str = Field(..., description="Analysis timestamp")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="API version")
    services: Dict[str, str] = Field(..., description="Service statuses") 