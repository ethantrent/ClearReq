import re
import random
from typing import List
from models.schemas import Requirement

class AIAnalyzer:
    """AI service for enhancing requirements with suggestions and ambiguity detection"""
    
    def __init__(self):
        # Ambiguous terms that need clarification
        self.ambiguous_terms = {
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
        
        # Enhancement suggestions by requirement type
        self.enhancement_suggestions = {
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
    
    async def enhance_requirements(self, requirements: List[Requirement]) -> List[Requirement]:
        """
        Enhance requirements with AI-generated suggestions and improved ambiguity detection
        """
        enhanced_requirements = []
        
        for requirement in requirements:
            enhanced_req = await self._enhance_single_requirement(requirement)
            enhanced_requirements.append(enhanced_req)
        
        return enhanced_requirements
    
    async def _enhance_single_requirement(self, requirement: Requirement) -> Requirement:
        """
        Enhance a single requirement with better suggestions and ambiguity detection
        """
        # Analyze for ambiguous terms
        ambiguous_terms = self._detect_ambiguous_terms(requirement.text)
        
        # Generate enhanced suggestion
        enhanced_suggestion = self._generate_enhanced_suggestion(
            requirement.text, 
            requirement.type, 
            ambiguous_terms
        )
        
        # Update ambiguity level based on detected terms
        new_ambiguity = self._calculate_enhanced_ambiguity(ambiguous_terms)
        
        # Create enhanced requirement
        enhanced_requirement = Requirement(
            id=requirement.id,
            text=requirement.text,
            type=requirement.type,
            confidence=requirement.confidence,
            ambiguity=new_ambiguity,
            suggestion=enhanced_suggestion
        )
        
        return enhanced_requirement
    
    def _detect_ambiguous_terms(self, text: str) -> List[str]:
        """
        Detect ambiguous terms in requirement text
        """
        detected_terms = []
        text_lower = text.lower()
        
        for term in self.ambiguous_terms.keys():
            if term.lower() in text_lower:
                detected_terms.append(term)
        
        return detected_terms
    
    def _generate_enhanced_suggestion(self, text: str, req_type: str, ambiguous_terms: List[str]) -> str:
        """
        Generate enhanced suggestion based on requirement type and ambiguous terms
        """
        suggestions = []
        
        # Add suggestions for ambiguous terms
        for term in ambiguous_terms:
            if term in self.ambiguous_terms:
                suggestions.append(f"'{term}': {self.ambiguous_terms[term]}")
        
        # Add type-specific suggestions
        if req_type in self.enhancement_suggestions:
            type_suggestions = self.enhancement_suggestions[req_type]
            suggestions.append(random.choice(type_suggestions))
        
        # Add general improvement suggestions
        general_suggestions = [
            "Consider adding measurable acceptance criteria.",
            "Define specific success metrics for this requirement.",
            "Include testable conditions for validation.",
            "Specify dependencies and constraints.",
            "Add exception handling requirements."
        ]
        suggestions.append(random.choice(general_suggestions))
        
        # Combine suggestions
        if suggestions:
            return " | ".join(suggestions[:3])  # Limit to 3 suggestions
        else:
            return "Consider adding more specific details and measurable criteria."
    
    def _calculate_enhanced_ambiguity(self, ambiguous_terms: List[str]) -> str:
        """
        Calculate enhanced ambiguity level based on detected terms
        """
        if len(ambiguous_terms) >= 3:
            return "High"
        elif len(ambiguous_terms) >= 1:
            return "Medium"
        else:
            return "Low"
    
    async def analyze_ambiguity_patterns(self, requirements: List[Requirement]) -> List[dict]:
        """
        Analyze patterns of ambiguity across all requirements
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
    
    async def generate_improvement_recommendations(self, requirements: List[Requirement]) -> List[dict]:
        """
        Generate comprehensive improvement recommendations
        """
        recommendations = []
        
        # Analyze requirement types distribution
        type_counts = {}
        for req in requirements:
            type_counts[req.type] = type_counts.get(req.type, 0) + 1
        
        # Generate type-specific recommendations
        if type_counts.get("Functional", 0) > type_counts.get("Non-Functional", 0):
            recommendations.append({
                "category": "Balance",
                "title": "Consider adding more non-functional requirements",
                "description": "Your document has more functional than non-functional requirements. Consider adding performance, security, and usability requirements.",
                "priority": "Medium"
            })
        
        # Analyze ambiguity patterns
        high_ambiguity_count = len([r for r in requirements if r.ambiguity == "High"])
        if high_ambiguity_count > len(requirements) * 0.3:  # More than 30% high ambiguity
            recommendations.append({
                "category": "Clarity",
                "title": "High ambiguity detected",
                "description": f"{high_ambiguity_count} out of {len(requirements)} requirements have high ambiguity. Consider replacing subjective terms with measurable criteria.",
                "priority": "High"
            })
        
        # Check for completeness
        if len(requirements) < 5:
            recommendations.append({
                "category": "Completeness",
                "title": "Consider adding more requirements",
                "description": "Your document has relatively few requirements. Consider if all system aspects are covered.",
                "priority": "Medium"
            })
        
        return recommendations 