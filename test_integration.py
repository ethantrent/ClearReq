import requests
import time
import os

def test_backend():
    """Test if the backend API is responding"""
    try:
        # Test health endpoint
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend API is running!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend API is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Backend API error: {e}")
        return False

def test_frontend():
    """Test if the frontend is accessible"""
    try:
        # Try common React dev server ports
        ports = [5173, 3000, 8080]
        for port in ports:
            try:
                response = requests.get(f"http://localhost:{port}", timeout=5)
                if response.status_code == 200:
                    print(f"✅ Frontend is running on port {port}!")
                    return True
            except:
                continue
        print("❌ Frontend is not running on common ports (5173, 3000, 8080)")
        return False
    except Exception as e:
        print(f"❌ Frontend test error: {e}")
        return False

def test_file_upload():
    """Test the file upload and analysis endpoint"""
    try:
        # Create a test file
        test_content = """
        The system shall allow users to log in using their email and password.
        The system must be fast and responsive to user interactions.
        Users can upload files in various formats including PDF, DOC, and TXT.
        The user interface must be intuitive and user-friendly.
        The system shall encrypt all sensitive data during transmission and storage.
        """
        
        with open("test_requirements.txt", "w") as f:
            f.write(test_content)
        
        # Test file upload
        with open("test_requirements.txt", "rb") as f:
            files = {"file": ("test_requirements.txt", f, "text/plain")}
            response = requests.post("http://localhost:8000/api/analyze", files=files, timeout=30)
        
        # Clean up test file
        os.remove("test_requirements.txt")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ File upload and analysis working!")
            print(f"   Total Requirements: {result['summary']['total']}")
            print(f"   Functional: {result['summary']['functional']}")
            print(f"   Non-Functional: {result['summary']['nonFunctional']}")
            print(f"   Ambiguities: {result['summary']['ambiguities']}")
            return True
        else:
            print(f"❌ File upload failed with status {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ File upload test error: {e}")
        return False

def main():
    print("🧪 Testing ClearReq Integration...")
    print("=" * 50)
    
    # Test backend
    print("\n1. Testing Backend API:")
    backend_ok = test_backend()
    
    # Test frontend
    print("\n2. Testing Frontend:")
    frontend_ok = test_frontend()
    
    # Test file upload (only if backend is working)
    if backend_ok:
        print("\n3. Testing File Upload and Analysis:")
        upload_ok = test_file_upload()
    else:
        print("\n3. Skipping File Upload Test (backend not available)")
        upload_ok = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"Backend API: {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"Frontend: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    print(f"File Upload: {'✅ PASS' if upload_ok else '❌ FAIL'}")
    
    if backend_ok and frontend_ok and upload_ok:
        print("\n🎉 All tests passed! ClearReq is fully functional!")
        print("\n🌐 You can now:")
        print("   • Open your browser to the frontend URL")
        print("   • Upload requirements documents")
        print("   • Get AI-powered analysis results")
    else:
        print("\n⚠️  Some tests failed. Check the server logs for details.")
        
        if not backend_ok:
            print("\n🔧 Backend troubleshooting:")
            print("   • Make sure you're in the backend directory")
            print("   • Activate virtual environment: venv\\Scripts\\activate")
            print("   • Start server: python main.py")
            
        if not frontend_ok:
            print("\n🔧 Frontend troubleshooting:")
            print("   • Make sure you're in the project root")
            print("   • Start server: npm run dev")

if __name__ == "__main__":
    main() 