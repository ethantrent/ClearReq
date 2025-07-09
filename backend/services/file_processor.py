import PyPDF2
import io
from fastapi import UploadFile, HTTPException
import re
from typing import List

SUPPORTED_EXTENSIONS = ['.txt', '.pdf']
REQUIREMENT_KEYWORDS = [
    'shall', 'should', 'must', 'will', 'can', 'may',
    'system', 'user', 'shall be', 'must be', 'should be',
    'the system', 'the user', 'users can', 'system shall'
]

class FileProcessor:
    """Service for processing uploaded files and extracting text content"""
    
    def __init__(self):
        self.supported_extensions = SUPPORTED_EXTENSIONS
    
    async def extract_text(self, file: UploadFile) -> str:
        """
        Extract text content from uploaded file
        Supports .txt and .pdf files
        """
        try:
            if file.filename.lower().endswith('.txt'):
                return await self._extract_text_from_txt(file)
            elif file.filename.lower().endswith('.pdf'):
                return await self._extract_text_from_pdf(file)
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file type. Supported types: {', '.join(self.supported_extensions)}"
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error extracting text from file: {str(e)}"
            )
    
    async def _extract_text_from_txt(self, file: UploadFile) -> str:
        """Extract text from .txt file"""
        try:
            content = await file.read()
            text = content.decode('utf-8')
            return self._clean_text(text)
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                content = await file.read()
                text = content.decode('latin-1')
                return self._clean_text(text)
            except Exception as e:
                raise Exception(f"Could not decode text file: {str(e)}")
    
    async def _extract_text_from_pdf(self, file: UploadFile) -> str:
        """Extract text from .pdf file"""
        try:
            content = await file.read()
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            return self._clean_text(text)
        except Exception as e:
            raise Exception(f"Could not extract text from PDF: {str(e)}")
    
    def _clean_text(self, text: str) -> str:
        """
        Clean and preprocess extracted text
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might interfere with processing
        text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)]', '', text)
        
        # Normalize line breaks
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        
        # Remove empty lines
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        text = '\n'.join(lines)
        
        return text.strip()
    
    def extract_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences for requirement extraction
        """
        # Simple sentence splitting (can be improved with NLP libraries)
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]
        return sentences
    
    def is_requirement_like(self, sentence: str) -> bool:
        """
        Basic heuristic to identify if a sentence looks like a requirement
        """
        sentence_lower = sentence.lower()
        
        # Check for requirement keywords
        for keyword in REQUIREMENT_KEYWORDS:
            if keyword in sentence_lower:
                return True
        
        # Check for imperative structure
        if sentence_lower.startswith(('the system', 'the user', 'users')):
            return True
        
        return False 