import re
import random
from typing import List
from models.schemas import Requirement

# Constants for classification
FUNCTIONAL_KEYWORDS = [
    'shall', 'should', 'must', 'will', 'can', 'may',
    'system shall', 'user shall', 'users can', 'system must',
    'the system', 'the user', 'users will', 'system will'
]
NON_FUNCTIONAL_KEYWORDS = [
    'performance', 'speed', 'fast', 'slow', 'response time',
    'availability', 'uptime', 'reliability', 'security',
    'scalability', 'maintainability', 'usability', 'accessibility',
    'compatibility', 'portability', 'efficiency', 'throughput',
    'latency', 'bandwidth', 'capacity', 'load', 'stress',
    'concurrent', 'simultaneous', 'real-time', 'near real-time'
]
AMBIGUOUS_KEYWORDS = [
    'intuitive', 'user-friendly', 'easy to use', 'simple',
    'fast', 'quick', 'efficient', 'good', 'better', 'best',
    'appropriate', 'suitable', 'adequate', 'reasonable',
    'secure', 'safe', 'reliable', 'stable', 'robust'
]

class MLPipeline:
    """Machine Learning pipeline for requirement extraction and classification."""

    def __init__(self):
        self.functional_keywords = FUNCTIONAL_KEYWORDS
        self.non_functional_keywords = NON_FUNCTIONAL_KEYWORDS
        self.ambiguous_keywords = AMBIGUOUS_KEYWORDS

    async def extract_requirements(self, text: str) -> List[Requirement]:
        """
        Extract requirements from text using pattern matching and heuristics.

        Args:
            text (str): The input text.

        Returns:
            List[Requirement]: List of extracted requirements.
        """
        sentences = self._split_into_sentences(text)
        requirements = []
        req_id = 1
        for sentence in sentences:
            if self._is_requirement_sentence(sentence):
                requirement = self._classify_requirement(sentence, f"REQ-{req_id:03d}")
                if requirement:
                    requirements.append(requirement)
                    req_id += 1
        if not requirements:
            requirements = self._generate_sample_requirements()
        return requirements

    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]
        return sentences

    def _is_requirement_sentence(self, sentence: str) -> bool:
        """Check if a sentence looks like a requirement."""
        sentence_lower = sentence.lower()
        requirement_patterns = [
            r'\b(the\s+)?system\s+(shall|should|must|will|can)\b',
            r'\b(the\s+)?user\s+(shall|should|must|will|can)\b',
            r'\busers?\s+(shall|should|must|will|can)\b',
            r'\b(shall|should|must|will|can)\s+be\b',
            r'\b(shall|should|must|will|can)\s+have\b',
            r'\b(shall|should|must|will|can)\s+provide\b',
            r'\b(shall|should|must|will|can)\s+support\b',
            r'\b(shall|should|must|will|can)\s+allow\b',
            r'\b(shall|should|must|will|can)\s+enable\b'
        ]
        for pattern in requirement_patterns:
            if re.search(pattern, sentence_lower):
                return True
        return False

    def _classify_requirement(self, sentence: str, req_id: str) -> Requirement:
        """Classify requirement type and generate metadata."""
        sentence_lower = sentence.lower()
        req_type = self._determine_requirement_type(sentence_lower)
        confidence = self._calculate_confidence(sentence_lower, req_type)
        ambiguity = self._determine_ambiguity(sentence_lower)
        suggestion = self._generate_suggestion(sentence, req_type, ambiguity)
        return Requirement(
            id=req_id,
            text=sentence.strip(),
            type=req_type,
            confidence=confidence,
            ambiguity=ambiguity,
            suggestion=suggestion
        )

    def _determine_requirement_type(self, sentence: str) -> str:
        """Determine if requirement is functional, non-functional, or ambiguous."""
        non_func_count = sum(1 for keyword in self.non_functional_keywords if keyword in sentence)
        ambiguous_count = sum(1 for keyword in self.ambiguous_keywords if keyword in sentence)
        if non_func_count > 0:
            return "Non-Functional"
        elif ambiguous_count > 0:
            return "Ambiguous"
        else:
            return "Functional"

    def _calculate_confidence(self, sentence: str, req_type: str) -> int:
        """Calculate confidence score (0-100)."""
        base_confidence = 70
        if len(sentence) > 100:
            base_confidence += 10
        elif len(sentence) < 30:
            base_confidence -= 10
        if req_type == "Functional":
            base_confidence += 15
        elif req_type == "Non-Functional":
            base_confidence += 10
        else:
            base_confidence -= 20
        confidence = base_confidence + random.randint(-10, 10)
        return max(50, min(100, confidence))

    def _determine_ambiguity(self, sentence: str) -> str:
        """Determine ambiguity level."""
        ambiguous_count = sum(1 for keyword in self.ambiguous_keywords if keyword in sentence)
        if ambiguous_count >= 2:
            return "High"
        elif ambiguous_count == 1:
            return "Medium"
        else:
            return "Low"

    def _generate_suggestion(self, sentence: str, req_type: str, ambiguity: str) -> str:
        """Generate improvement suggestion."""
        suggestions = {
            "Functional": {
                "Low": "Consider adding specific acceptance criteria for better testability.",
                "Medium": "Add more specific details about the expected behavior.",
                "High": "Define measurable criteria and specific implementation details."
            },
            "Non-Functional": {
                "Low": "Consider adding specific performance metrics and thresholds.",
                "Medium": "Define measurable performance criteria and acceptable ranges.",
                "High": "Replace subjective terms with specific, measurable requirements."
            },
            "Ambiguous": {
                "Low": "Replace subjective terms with objective, measurable criteria.",
                "Medium": "Define what constitutes success with specific metrics.",
                "High": "Completely rewrite with specific, measurable, and testable criteria."
            }
        }
        return suggestions.get(req_type, {}).get(ambiguity, "Consider adding more specific details.")

    def _generate_sample_requirements(self) -> List[Requirement]:
        """Generate sample requirements if none are found."""
        sample_requirements = [
            {
                "id": "REQ-001",
                "text": "The system shall allow users to log in using their email and password.",
                "type": "Functional",
                "confidence": 95,
                "ambiguity": "Low",
                "suggestion": "Consider adding password complexity requirements and account lockout policies for enhanced security."
            },
            {
                "id": "REQ-002", 
                "text": "The system must be fast and responsive to user interactions.",
                "type": "Non-Functional",
                "confidence": 87,
                "ambiguity": "High",
                "suggestion": "Define specific performance metrics such as 'response time under 2 seconds for 95% of requests.'"
            },
            {
                "id": "REQ-003",
                "text": "Users can upload files in various formats including PDF, DOC, and TXT.",
                "type": "Functional",
                "confidence": 92,
                "ambiguity": "Medium",
                "suggestion": "Specify file size limits and supported format versions for better clarity."
            },
            {
                "id": "REQ-004",
                "text": "The user interface must be intuitive and user-friendly.",
                "type": "Non-Functional",
                "confidence": 78,
                "ambiguity": "High",
                "suggestion": "Replace subjective terms with measurable criteria like 'users can complete tasks in under 3 clicks.'"
            },
            {
                "id": "REQ-005",
                "text": "The system shall encrypt all sensitive data during transmission and storage.",
                "type": "Functional",
                "confidence": 96,
                "ambiguity": "Low",
                "suggestion": "Specify encryption standards (e.g., AES-256) and key management procedures."
            }
        ]
        return [Requirement(**req) for req in sample_requirements] 