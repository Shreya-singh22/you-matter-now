# 🌱 You Matter Now

**You Matter Now** is an AI-powered mental health platform designed to provide accessible, compassionate, and continuous support for individuals through technology.

The platform focuses on **self-reflection, emotional well-being, and guided mental health assistance**, helping users feel heard, supported, and empowered.

---

## ✨ Features

- 🤖 **AI Chatbot (24/7 Support)**  
  Provides empathetic conversations and mental health guidance anytime using Groq's Llama 3 models.

- 📓 **Journaling System**  
  Users can write and reflect on their thoughts and emotions securely. Includes mood tracking and gratitude prompts.

- 🧠 **Self-Assessments**  
  Includes basic anxiety and depression screening tools for self-awareness.

- 👩‍⚕️ **Doctor / Therapist Discovery**  
  Helps users find relevant mental health professionals.

- 🎮 **Wellness-Oriented Experience**  
  Designed to reduce stress and encourage healthy emotional habits through games and mindfulness activities.

---

## 🛠️ Tech Stack

- **Frontend:** TypeScript, React, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Python, FastAPI, SQLite
- **AI Integration:** LangChain, Groq API (Llama 3.3)

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js and npm
- Python 3.10+
- Groq API Key

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with your credentials
# GROQ_API_KEY=your_key_here

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
# In the root directory (you-matter-games-journal-main)
npm install
npm run dev
```

Visit `http://localhost:8080` (or `http://localhost:5173`) to view the application.

---

## 🌐 Live Deployment

🚀 Live Website:
👉 https://you-matter-games-journal-main.vercel.app
