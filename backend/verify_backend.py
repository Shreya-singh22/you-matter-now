"""End-to-end smoke test for the You Matter Now API.

Run the server first, then:  python verify_backend.py
Exits non-zero on the first failure so it can be used in CI.
"""

import sys
import time

import requests

BASE_URL = "http://127.0.0.1:8000"
PASSWORD = "password123"

passed, failed = [], []


def check(name, condition, detail=""):
    if condition:
        passed.append(name)
        print(f"  PASS  {name}")
    else:
        failed.append(f"{name} - {detail}")
        print(f"  FAIL  {name}  {detail}")
    return condition


def wait_for_server(timeout=600):
    print(f"Waiting for {BASE_URL} (first boot builds the vector store)...")
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            if requests.get(BASE_URL, timeout=3).status_code == 200:
                print("Server is up.\n")
                return True
        except requests.exceptions.RequestException:
            pass
        time.sleep(3)
    print("Server did not become ready in time.")
    return False


def test_auth():
    print("AUTH")
    email = f"testuser_{int(time.time())}@example.com"

    r = requests.post(
        f"{BASE_URL}/auth/signup",
        json={"email": email, "password": PASSWORD, "name": "Test User"},
    )
    if not check("signup returns 200", r.status_code == 200, r.text[:200]):
        return None
    token = r.json().get("access_token")
    check("signup returns a token", bool(token))

    r = requests.post(
        f"{BASE_URL}/auth/signup",
        json={"email": email, "password": PASSWORD, "name": "Duplicate"},
    )
    check("duplicate email rejected with 400", r.status_code == 400, f"got {r.status_code}")

    r = requests.post(
        f"{BASE_URL}/auth/login", data={"username": email, "password": PASSWORD}
    )
    check("login returns 200", r.status_code == 200, r.text[:200])

    r = requests.post(
        f"{BASE_URL}/auth/login", data={"username": email, "password": "wrongpassword"}
    )
    check("wrong password rejected with 401", r.status_code == 401, f"got {r.status_code}")

    r = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
    check("/auth/me returns the user", r.status_code == 200 and r.json().get("email") == email)
    check("name was persisted", r.json().get("name") == "Test User", f"got {r.json().get('name')}")

    r = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    check("garbage token rejected with 401", r.status_code == 401, f"got {r.status_code}")

    print()
    return token


def test_journal(token):
    print("JOURNAL")
    headers = {"Authorization": f"Bearer {token}"}

    r = requests.get(f"{BASE_URL}/journal/")
    check("journal requires auth", r.status_code == 401, f"got {r.status_code}")

    entry = {
        "title": "Test Entry",
        "content": "This is a test.",
        "mood": "Happy",
        "gratitude": ["Coding", "Coffee"],
    }
    r = requests.post(f"{BASE_URL}/journal/", json=entry, headers=headers)
    if not check("create returns 200", r.status_code == 200, r.text[:200]):
        return
    created = r.json()
    entry_id = created["id"]
    check("gratitude round-trips as a list", created["gratitude"] == ["Coding", "Coffee"],
          f"got {created['gratitude']!r}")

    r = requests.get(f"{BASE_URL}/journal/", headers=headers)
    check("entry appears in list", any(e["id"] == entry_id for e in r.json()))

    r = requests.put(
        f"{BASE_URL}/journal/{entry_id}",
        json={**entry, "title": "Updated", "gratitude": ["Rest"]},
        headers=headers,
    )
    check("update returns 200", r.status_code == 200, r.text[:200])
    check("update persisted", r.json()["title"] == "Updated")

    # A second user must not see or be able to touch the first user's entry.
    other_email = f"other_{int(time.time())}@example.com"
    other = requests.post(
        f"{BASE_URL}/auth/signup",
        json={"email": other_email, "password": PASSWORD, "name": "Other"},
    ).json()["access_token"]
    other_headers = {"Authorization": f"Bearer {other}"}

    r = requests.get(f"{BASE_URL}/journal/", headers=other_headers)
    check("other user sees no entries", r.json() == [], f"got {len(r.json())} entries")

    r = requests.delete(f"{BASE_URL}/journal/{entry_id}", headers=other_headers)
    check("other user cannot delete (404)", r.status_code == 404, f"got {r.status_code}")

    r = requests.delete(f"{BASE_URL}/journal/{entry_id}", headers=headers)
    check("owner can delete (204)", r.status_code == 204, f"got {r.status_code}")

    print()


def test_chat():
    print("CHAT")
    r = requests.post(f"{BASE_URL}/chat/", json={"message": "I feel anxious today."}, timeout=90)
    if not check("chat returns 200", r.status_code == 200, r.text[:200]):
        return
    reply = r.json().get("response", "")
    check("chat returns a non-empty reply", len(reply) > 20, f"got {reply[:80]!r}")
    check(
        "knowledge base is loaded",
        "cannot access my knowledge base" not in reply and "can't access my knowledge base" not in reply,
        "vector store failed to build",
    )
    print(f"\n  Reply: {reply[:180]}...\n")


if __name__ == "__main__":
    if not wait_for_server():
        sys.exit(1)

    token = test_auth()
    if not token:
        sys.exit(1)
    test_journal(token)
    test_chat()

    print("=" * 52)
    print(f"{len(passed)} passed, {len(failed)} failed")
    for f in failed:
        print(f"  - {f}")
    sys.exit(1 if failed else 0)
