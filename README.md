# Basit Hussain Shah — Personal Portfolio Website & Full-Stack API Suite

A full-stack personal developer portfolio and REST API built for **Basit Hussain Shah**, showcasing Full Stack Web Development (Python, Flask, JavaScript, SQL, HTML/CSS) and Cybersecurity & Ethical Hacking skills.

## ✨ Features Included

- **Python Flask Backend & REST APIs**: Built with Flask and SQLite database persistence.
  - `POST /api/chat`: Context-aware AI Chatbot & Virtual Tutor assistant.
  - `POST /api/contact`: Form handler with parameterized SQLite insertion and validation.
  - `GET /api/projects`: RESTful JSON endpoint for featured projects.
  - `GET /api/skills`: RESTful JSON endpoint for skill categories.
  - `POST /api/scan`: Simulated Cybersecurity network & vulnerability scanner endpoint.
  - `GET /api/health`: Health & status check endpoint.
- **Floating AI Chatbot Widget**: Interactive assistant available at the bottom-right corner of the site answering questions about Basit's background, education, projects, skills, and coding queries.
- **Interactive AI Virtual Tutor Live Demo**: Functional simulation of the flagship project (*AI Power Education Assistant: A Virtual Tutor For Personalized Learning*).
- **Skills Matrix with Category Filters**: Filterable capabilities for Backend, Frontend, and Cybersecurity.
- **Experience & Education Timeline**: Detailed journey from Diploma in Electrical Engineering (Srinagar) to B.Tech in CSE at Anna University / NIET and Cyber Security Internship at CODTECH IT Solutions.
- **Certifications Showcase**: Verified credentials from Intel, University of Maryland, and Python Data Structures.
- **Built-in Printable CV Modal**: One-click preview and PDF printing matching the official resume format.
- **Connect Suite**: 1-click clipboard copy for email/phone, direct LinkedIn profile link, and responsive contact form.

## 🚀 How to Run Locally

### Method 1: Run Full-Stack Flask Server (Recommended)

```bash
# 1. Navigate to the project directory
cd C:\Users\EliteBook\.gemini\antigravity\scratch\portfolio

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the Flask server
python app.py
```

Then open your browser and go to:
```
http://localhost:5000
```

### Method 2: Run as Static Site

You can also run directly with any static server or double-click `index.html`:
```bash
python -m http.server 3000
```

## 📁 Project Structure

```
portfolio/
├── app.py                # Python Flask server & REST API endpoints
├── requirements.txt      # Python dependencies (Flask, Flask-Cors)
├── index.html            # Main portfolio webpage
├── resume.html           # Standalone printable resume
├── database/
│   └── schema.sql        # SQLite database tables (messages, chat_logs, scans)
├── css/
│   └── style.css         # Modern design tokens, responsive styles & theme variables
├── js/
│   ├── main.js           # Theme, navigation, terminal runner, modals, contact API
│   ├── chatbot.js        # Floating AI Chatbot assistant
│   └── ai-tutor-demo.js  # Interactive simulator for the AI Virtual Tutor project
└── assets/
    └── images/
        ├── avatar.jpg    # Basit's portrait photo
        ├── basit-photo.jpg
        └── ai-tutor.jpg  # AI Virtual Tutor project graphic
```
