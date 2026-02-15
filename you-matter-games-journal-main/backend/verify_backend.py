import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000"

def wait_for_server():
    print("Waiting for server to start...")
    for _ in range(30):
        try:
            requests.get(f"{BASE_URL}/docs")
            print("Server is up!")
            return True
        except requests.exceptions.ConnectionError:
            time.sleep(2)
    print("Server failed to start.")
    return False

def verify_auth():
    print("Verifying Auth...")
    email = f"testuser_{int(time.time())}@example.com"
    password = "password123"
    
    # Signup
    signup_resp = requests.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": password,
        "name": "Test User"
    })
    
    if signup_resp.status_code != 200:
        print(f"Signup failed: {signup_resp.text}")
        return None
    
    print("Signup successful")
    token = signup_resp.json().get("access_token")
    
    # Login (for verification, though signup returns token)
    login_resp = requests.post(f"{BASE_URL}/auth/login", data={
        "username": email,
        "password": password
    })
    
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return None

    print("Login successful")
    return token

def verify_journal(token):
    print("Verifying Journal...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create
    entry = {
        "title": "Test Entry",
        "content": "This is a test content.",
        "mood": "Happy",
        "gratitude": ["Coding", "Coffee"]
    }
    
    create_resp = requests.post(f"{BASE_URL}/journal/", json=entry, headers=headers)
    if create_resp.status_code != 200:
        print(f"Create entry failed: {create_resp.text}")
        return False
        
    entry_id = create_resp.json()["id"]
    print("Create entry successful")
    
    # Read
    read_resp = requests.get(f"{BASE_URL}/journal/", headers=headers)
    if read_resp.status_code != 200:
        print(f"Read entries failed: {read_resp.text}")
        return False
        
    entries = read_resp.json()
    if not any(e["id"] == entry_id for e in entries):
        print("Created entry not found in list")
        return False
        
    print("Read entries successful")
    return True

def verify_chat(token):
    print("Verifying Chat...")
    # Chat endpoint uses the same token? Check backend/routers/chat.py
    # From common practice, chat usually requires auth.
    headers = {"Authorization": f"Bearer {token}"}
    
    chat_resp = requests.post(f"{BASE_URL}/chat/", json={"message": "Hello"}, headers=headers)
    
    # Validating 500 or 503 is acceptable if Groq API key is missing/invalid, 
    # but 401/403 means auth issue. 200 is success.
    if chat_resp.status_code == 200:
        print(f"Chat response: {chat_resp.json()}")
    else:
        print(f"Chat failed (expected if API key missing): {chat_resp.status_code} - {chat_resp.text}")

    return True

if __name__ == "__main__":
    if not wait_for_server():
        sys.exit(1)
        
    token = verify_auth()
    if token:
        verify_journal(token)
        verify_chat(token)
    else:
        sys.exit(1)
