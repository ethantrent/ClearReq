import requests
import json

# Test the API endpoints
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health Check Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_root():
    """Test the root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Root endpoint failed: {e}")
        return False

def test_analyze_endpoint():
    """Test the analyze endpoint with a sample text file"""
    try:
        # Create a sample text file
        sample_text = """
        The system shall allow users to log in using their email and password.
        The system must be fast and responsive to user interactions.
        Users can upload files in various formats including PDF, DOC, and TXT.
        The user interface must be intuitive and user-friendly.
        The system shall encrypt all sensitive data during transmission and storage.
        """
        
        # Create a temporary file
        with open("sample_requirements.txt", "w") as f:
            f.write(sample_text)
        
        # Test file upload
        with open("sample_requirements.txt", "rb") as f:
            files = {"file": ("sample_requirements.txt", f, "text/plain")}
            response = requests.post(f"{BASE_URL}/api/analyze", files=files)
        
        print(f"Analyze Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Analysis Results:")
            print(f"  Total Requirements: {result['summary']['total']}")
            print(f"  Functional: {result['summary']['functional']}")
            print(f"  Non-Functional: {result['summary']['nonFunctional']}")
            print(f"  Ambiguities: {result['summary']['ambiguities']}")
            print(f"  Requirements: {len(result['requirements'])}")
        else:
            print(f"Error: {response.text}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Analyze endpoint failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing ClearReq API...")
    print("=" * 50)
    
    # Test health check
    print("\n1. Testing Health Check:")
    health_ok = test_health_check()
    
    # Test root endpoint
    print("\n2. Testing Root Endpoint:")
    root_ok = test_root()
    
    # Test analyze endpoint
    print("\n3. Testing Analyze Endpoint:")
    analyze_ok = test_analyze_endpoint()
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Root Endpoint: {'✅ PASS' if root_ok else '❌ FAIL'}")
    print(f"Analyze Endpoint: {'✅ PASS' if analyze_ok else '❌ FAIL'}")
    
    if health_ok and root_ok and analyze_ok:
        print("\n🎉 All tests passed! The API is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the server logs for details.") 