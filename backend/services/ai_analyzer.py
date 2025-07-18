import re
import random
from typing import List, Dict
from models.schemas import Requirement
import os
import requests
try:
    from openai import OpenAI
    _openai_available = True
except ImportError:
    _openai_available = False

# Constants for ambiguous terms and enhancement suggestions
AMBIGUOUS_TERMS = {
    'fast': 'Define specific response time (e.g., "under 2 seconds")',
    'quick': 'Specify time constraints (e.g., "within 30 seconds")',
    'efficient': 'Define efficiency metrics (e.g., "using less than 100MB RAM")',
    'user-friendly': 'Define usability criteria (e.g., "completable in under 3 clicks")',
    'intuitive': 'Specify user experience requirements (e.g., "follows standard UI patterns")',
    'secure': 'Define security standards (e.g., "AES-256 encryption, HTTPS only")',
    'reliable': 'Specify reliability metrics (e.g., "99.9% uptime")',
    'scalable': 'Define scalability requirements (e.g., "support 10,000 concurrent users")',
    'maintainable': 'Specify maintainability criteria (e.g., "modular architecture")',
    'compatible': 'Define compatibility requirements (e.g., "works with Chrome 90+")',
    'portable': 'Specify portability requirements (e.g., "runs on Windows, Mac, Linux")',
    'robust': 'Define robustness criteria (e.g., "handles network failures gracefully")',
    'stable': 'Specify stability requirements (e.g., "no crashes during normal operation")',
    'good': 'Replace with specific, measurable criteria',
    'better': 'Define improvement metrics',
    'best': 'Specify optimal performance criteria',
    'appropriate': 'Define what constitutes appropriateness',
    'suitable': 'Specify suitability criteria',
    'adequate': 'Define adequacy standards',
    'reasonable': 'Specify reasonableness criteria'
}
ENHANCEMENT_SUGGESTIONS = {
    'Functional': [
        'Add specific acceptance criteria for testing.',
        'Define input validation requirements.',
        'Specify error handling behavior.',
        'Include user role and permission requirements.',
        'Define integration points with other systems.',
        'Specify data validation rules.',
        'Include audit trail requirements.',
        'Define backup and recovery procedures.'
    ],
    'Non-Functional': [
        'Add specific performance metrics and thresholds.',
        'Define availability requirements (e.g., 99.9% uptime).',
        'Specify security compliance standards.',
        'Include scalability requirements.',
        'Define maintainability criteria.',
        'Specify usability standards.',
        'Include accessibility requirements.',
        'Define compatibility requirements.'
    ]
}
GENERAL_SUGGESTIONS = [
    "Consider adding measurable acceptance criteria.",
    "Define specific success metrics for this requirement.",
    "Include testable conditions for validation.",
    "Specify dependencies and constraints.",
    "Add exception handling requirements."
]

class AIAnalyzer:
    """AI service for enhancing requirements with suggestions and ambiguity detection."""

    def __init__(self):
        self.ambiguous_terms = AMBIGUOUS_TERMS
        self.enhancement_suggestions = ENHANCEMENT_SUGGESTIONS

    async def enhance_requirements(self, requirements: List[Requirement]) -> List[Requirement]:
        """
        Enhance requirements with AI-generated suggestions and improved ambiguity detection.
        If HF_API_KEY is set, use Hugging Face Inference API; else, try OpenAI; else, use local heuristics.
        """
        hf_api_key = os.getenv("HF_API_KEY")
        if hf_api_key:
            return await self._enhance_with_huggingface(requirements, hf_api_key)
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if openai_api_key and _openai_available:
            return await self._enhance_with_openai(requirements, openai_api_key)
        # fallback to local logic
        enhanced_requirements = []
        for requirement in requirements:
            enhanced_req = await self._enhance_single_requirement(requirement)
            enhanced_requirements.append(enhanced_req)
        return enhanced_requirements

    async def _enhance_single_requirement(self, requirement: Requirement) -> Requirement:
        """
        Enhance a single requirement with better suggestions and ambiguity detection.

        Args:
            requirement (Requirement): The requirement to enhance.

        Returns:
            Requirement: Enhanced requirement.
        """
        ambiguous_terms = self._detect_ambiguous_terms(requirement.text)
        enhanced_suggestion = self._generate_enhanced_suggestion(
            requirement.text, requirement.type, ambiguous_terms
        )
        new_ambiguity = self._calculate_enhanced_ambiguity(ambiguous_terms)
        return Requirement(
            id=requirement.id,
            text=requirement.text,
            type=requirement.type,
            confidence=requirement.confidence,
            ambiguity=new_ambiguity,
            suggestion=enhanced_suggestion
        )

    async def _enhance_with_openai(self, requirements: List[Requirement], api_key: str) -> List[Requirement]:
        """
        Use OpenAI API to enhance requirements with suggestions and ambiguity detection.
        """
        client = OpenAI(api_key=api_key)
        enhanced_requirements = []
        for req in requirements:
            prompt = (
                f"Requirement: {req.text}\n"
                f"Type: {req.type}\n"
                f"Confidence: {req.confidence}\n"
                "\n"
                "Analyze the above software requirement.\n"
                "1. Detect and list any ambiguous terms or phrases.\n"
                "2. Rate the overall ambiguity as Low, Medium, or High.\n"
                "3. Suggest a concrete, measurable improvement.\n"
                "Respond in JSON with keys: ambiguous_terms (list), ambiguity (str), suggestion (str)."
            )
            try:
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=256,
                    temperature=0.2
                )
                import json as _json
                content = response.choices[0].message.content
                # Try to parse JSON from the response
                result = _json.loads(content)
                ambiguous_terms = result.get("ambiguous_terms", [])
                ambiguity = result.get("ambiguity", "Medium")
                suggestion = result.get("suggestion", "Consider making this requirement more specific.")
            except Exception as e:
                ambiguous_terms = []
                ambiguity = "Medium"
                suggestion = f"OpenAI error: {e}. Falling back to local suggestion."
            enhanced_requirements.append(Requirement(
                id=req.id,
                text=req.text,
                type=req.type,
                confidence=req.confidence,
                ambiguity=ambiguity,
                suggestion=suggestion
            ))
        return enhanced_requirements

    async def _enhance_with_huggingface(self, requirements: List[Requirement], api_key: str) -> List[Requirement]:
        """
        Use Hugging Face Inference API to enhance requirements with suggestions and ambiguity detection.
        """
        # Changed to a public, API-enabled model
        model_id = "google/flan-t5-base"
        api_url = f"https://api-inference.huggingface.co/models/{model_id}"
        headers = {"Authorization": f"Bearer {api_key}"}
        enhanced_requirements = []
        for req in requirements:
            prompt = (
                f"Requirement: {req.text}\n"
                f"Type: {req.type}\n"
                f"Confidence: {req.confidence}\n"
                "\n"
                "Analyze the above software requirement.\n"
                "1. Detect and list any ambiguous terms or phrases.\n"
                "2. Rate the overall ambiguity as Low, Medium, or High.\n"
                "3. Suggest a concrete, measurable improvement.\n"
                "Respond in JSON with keys: ambiguous_terms (list), ambiguity (str), suggestion (str)."
            )
            try:
                response = requests.post(api_url, headers=headers, json={"inputs": prompt}, timeout=30)
                response.raise_for_status()
                import json as _json
                content = response.json()
                if isinstance(content, list) and content and 'generated_text' in content[0]:
                    result = _json.loads(content[0]['generated_text'])
                else:
                    result = _json.loads(content)
                ambiguous_terms = result.get("ambiguous_terms", [])
                ambiguity = result.get("ambiguity", "Medium")
                suggestion = result.get("suggestion", "Consider making this requirement more specific.")
            except Exception as e:
                ambiguous_terms = []
                ambiguity = "Medium"
                suggestion = f"Hugging Face error: {e}. Falling back to local suggestion."
            enhanced_requirements.append(Requirement(
                id=req.id,
                text=req.text,
                type=req.type,
                confidence=req.confidence,
                ambiguity=ambiguity,
                suggestion=suggestion
            ))
        return enhanced_requirements

    def _detect_ambiguous_terms(self, text: str) -> List[str]:
        """
        Detect ambiguous terms in requirement text.

        Args:
            text (str): Requirement text.

        Returns:
            List[str]: List of detected ambiguous terms.
        """
        detected_terms = []
        text_lower = text.lower()
        for term in self.ambiguous_terms.keys():
            if term.lower() in text_lower:
                detected_terms.append(term)
        return detected_terms

    def _generate_enhanced_suggestion(self, text: str, req_type: str, ambiguous_terms: List[str]) -> str:
        """
        Generate enhanced suggestion based on requirement type and ambiguous terms.

        Args:
            text (str): Requirement text.
            req_type (str): Requirement type.
            ambiguous_terms (List[str]): List of ambiguous terms.

        Returns:
            str: Enhanced suggestion.
        """
        suggestions = []
        for term in ambiguous_terms:
            if term in self.ambiguous_terms:
                suggestions.append(f"'{term}': {self.ambiguous_terms[term]}")
        if req_type in self.enhancement_suggestions:
            type_suggestions = self.enhancement_suggestions[req_type]
            suggestions.append(random.choice(type_suggestions))
        suggestions.append(random.choice(GENERAL_SUGGESTIONS))
        if suggestions:
            return " | ".join(suggestions[:3])
        else:
            return "Consider adding more specific details and measurable criteria."

    def _calculate_enhanced_ambiguity(self, ambiguous_terms: List[str]) -> str:
        """
        Calculate enhanced ambiguity level based on detected terms.

        Args:
            ambiguous_terms (List[str]): List of ambiguous terms.

        Returns:
            str: Ambiguity level.
        """
        if len(ambiguous_terms) >= 3:
            return "High"
        elif len(ambiguous_terms) >= 1:
            return "Medium"
        else:
            return "Low"

    async def analyze_ambiguity_patterns(self, requirements: List[Requirement]) -> List[Dict]:
        """
        Analyze patterns of ambiguity across all requirements.

        Args:
            requirements (List[Requirement]): List of requirements.

        Returns:
            List[Dict]: List of ambiguity patterns.
        """
        ambiguity_patterns = []
        for req in requirements:
            if req.ambiguity in ["High", "Medium"]:
                ambiguous_terms = self._detect_ambiguous_terms(req.text)
                pattern = {
                    "requirement_id": req.id,
                    "text": req.text,
                    "ambiguity_level": req.ambiguity,
                    "ambiguous_terms": ambiguous_terms,
                    "suggestions": self._generate_enhanced_suggestion(req.text, req.type, ambiguous_terms)
                }
                ambiguity_patterns.append(pattern)
        return ambiguity_patterns

    async def generate_improvement_recommendations(self, requirements: List[Requirement]) -> List[Dict]:
        """
        Generate comprehensive improvement recommendations.

        Args:
            requirements (List[Requirement]): List of requirements.

        Returns:
            List[Dict]: List of recommendations.
        """
        recommendations = []
        type_counts = {}
        for req in requirements:
            type_counts[req.type] = type_counts.get(req.type, 0) + 1
        if type_counts.get("Functional", 0) > type_counts.get("Non-Functional", 0):
            recommendations.append({
                "category": "Balance",
                "title": "Consider adding more non-functional requirements",
                "description": "Your document has more functional than non-functional requirements. Consider adding performance, security, and usability requirements.",
                "priority": "Medium"
            })
        high_ambiguity_count = len([r for r in requirements if r.ambiguity == "High"])
        if high_ambiguity_count > len(requirements) * 0.3:
            recommendations.append({
                "category": "Clarity",
                "title": "High ambiguity detected",
                "description": f"{high_ambiguity_count} out of {len(requirements)} requirements have high ambiguity. Consider replacing subjective terms with measurable criteria.",
                "priority": "High"
            })
        if len(requirements) < 5:
            recommendations.append({
                "category": "Completeness",
                "title": "Consider adding more requirements",
                "description": "Your document has relatively few requirements. Consider if all system aspects are covered.",
                "priority": "Medium"
            })
        return recommendations 