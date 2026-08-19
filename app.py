"""
Basit Hussain Shah — Portfolio Backend Server & REST API
Built with Python & Flask, SQLite Database, and Intelligent AI Assistant Engine.
"""

import os
import sqlite3
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'portfolio.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'database', 'schema.sql')


def get_db_connection():
    """Create a database connection with dictionary-like row access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the SQLite database with the defined schema."""
    conn = get_db_connection()
    if os.path.exists(SCHEMA_PATH):
        with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
    else:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read INTEGER DEFAULT 0
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS chat_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                user_query TEXT NOT NULL,
                bot_response TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS security_scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                target TEXT NOT NULL,
                ports_scanned TEXT,
                open_ports TEXT,
                vulnerability_score TEXT,
                scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
    conn.commit()
    conn.close()


# Initialize database at startup
init_db()


# ==============================================================================
# STATIC & WEB ROUTES
# ==============================================================================

@app.route('/')
def index():
    """Serve main portfolio page."""
    return send_from_directory('.', 'index.html')


@app.route('/resume')
def resume():
    """Serve standalone printable resume."""
    return send_from_directory('.', 'resume.html')


# ==============================================================================
# REST API ENDPOINTS
# ==============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """System health check endpoint."""
    return jsonify({
        "status": "online",
        "service": "Basit Hussain Shah Portfolio API",
        "database": "SQLite connected",
        "version": "2.0.0",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }), 200


@app.route('/api/skills', methods=['GET'])
def get_skills():
    """Return categorized skill matrix."""
    skills_data = {
        "languages": ["Python", "JavaScript (ES6+)", "SQL", "HTML5", "CSS3"],
        "frameworks_backend": ["Flask", "RESTful APIs", "Relational Database Design", "System Workflow"],
        "cybersecurity": ["Ethical Hacking Methodologies", "Network Scanning", "Vulnerability Assessment", "OWASP Defenses"],
        "tools": ["Git", "GitHub", "VS Code", "SQLite", "Postman"]
    }
    return jsonify({"success": True, "skills": skills_data}), 200


@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Return list of featured projects."""
    projects_data = [
        {
            "id": 1,
            "title": "AI Power Education Assistant: A Virtual Tutor For Personalized Learning",
            "category": "Artificial Intelligence & Full Stack Web",
            "period": "2 Months (Coimbatore)",
            "description": "Adaptive conversational tutoring system integrating AI model reasoning, Python Flask RESTful backend, and optimized SQL database workflows.",
            "tech_stack": ["Python", "Flask", "JavaScript", "SQL", "HTML5/CSS3", "AI Integration"],
            "github": "https://github.com/shahb5812"
        },
        {
            "id": 2,
            "title": "Cyber Security Vulnerability Assessment & Network Scanner",
            "category": "Cybersecurity & Network Security",
            "period": "CODTECH IT SOLUTIONS Internship",
            "description": "Multi-threaded socket port scanner, service enumeration, vulnerability evaluation, and automated professional security audit reporting.",
            "tech_stack": ["Python", "Socket Programming", "Network Scanning", "Security Auditing"],
            "github": "https://github.com/shahb5812"
        },
        {
            "id": 3,
            "title": "Full Stack Flask CRUD & Relational Data Management Suite",
            "category": "Full Stack Web Engineering",
            "period": "Full Stack Project",
            "description": "Secure database-driven web application featuring session auth, hashed passwords, parameterized SQL protection, and responsive dashboard.",
            "tech_stack": ["Python", "Flask", "SQL", "JavaScript", "HTML5/CSS3"],
            "github": "https://github.com/shahb5812"
        }
    ]
    return jsonify({"success": True, "projects": projects_data}), 200


@app.route('/api/contact', methods=['POST'])
def handle_contact():
    """Process and securely store contact messages."""
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    subject = (data.get('subject') or 'Portfolio Inquiry').strip()
    message = (data.get('message') or '').strip()

    # Validation
    if not name or not email or not message:
        return jsonify({
            "success": False,
            "error": "Name, email, and message are required fields."
        }), 400

    if '@' not in email or '.' not in email:
        return jsonify({
            "success": False,
            "error": "Please provide a valid email address."
        }), 400

    # Parameterized SQL insert to prevent SQL Injection
    try:
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            (name, email, subject, message)
        )
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Thank you, {name}! Your message has been received. Basit will respond to {email} shortly."
        }), 201
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Database error: {str(e)}"
        }), 500


@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Retrieve submitted messages (administrative view)."""
    try:
        conn = get_db_connection()
        rows = conn.execute('SELECT id, name, email, subject, message, created_at FROM messages ORDER BY created_at DESC').fetchall()
        conn.close()
        messages_list = [dict(row) for row in rows]
        return jsonify({"success": True, "count": len(messages_list), "messages": messages_list}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/scan', methods=['POST'])
def run_scan_demo():
    """Simulated network scanner & vulnerability assessment endpoint."""
    data = request.get_json() or {}
    target = data.get('target', '127.0.0.1')
    ports = data.get('ports', [21, 22, 80, 443, 3306, 5000, 8080])

    # Simulation results based on Basit's cybersecurity tool logic
    open_ports = []
    for p in ports:
        if p in [80, 443, 5000]:
            open_ports.append({"port": p, "service": "HTTP/Web", "status": "OPEN", "risk": "Low (Public Service)"})
        elif p == 22:
            open_ports.append({"port": p, "service": "SSH", "status": "OPEN", "risk": "Medium (Enforce Key Auth)"})
        else:
            open_ports.append({"port": p, "service": "Unknown", "status": "CLOSED", "risk": "None"})

    score = "92/100 (Secure)" if 21 not in [p['port'] for p in open_ports if p['status'] == 'OPEN'] else "75/100"

    # Log to DB
    try:
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO security_scans (target, ports_scanned, open_ports, vulnerability_score) VALUES (?, ?, ?, ?)',
            (target, str(ports), str([p['port'] for p in open_ports if p['status'] == 'OPEN']), score)
        )
        conn.commit()
        conn.close()
    except Exception:
        pass

    return jsonify({
        "success": True,
        "target": target,
        "results": open_ports,
        "vulnerability_score": score,
        "assessment": "No critical vulnerabilities identified. Standard web ports open."
    }), 200


# ==============================================================================
# AI CHATBOT & TUTOR ENGINE
# ==============================================================================

@app.route('/api/chat', methods=['POST'])
def handle_chat():
    """
    Intelligent chatbot endpoint answering questions about Basit's profile,
    skills, background, and programming concepts.
    """
    data = request.get_json() or {}
    user_query = (data.get('message') or '').strip()
    session_id = data.get('session_id', 'anonymous')

    if not user_query:
        return jsonify({"success": False, "error": "Query message cannot be empty."}), 400

    response_text = generate_bot_response(user_query)

    # Log chat to SQLite
    try:
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO chat_logs (session_id, user_query, bot_response) VALUES (?, ?, ?)',
            (session_id, user_query, response_text)
        )
        conn.commit()
        conn.close()
    except Exception:
        pass

    return jsonify({
        "success": True,
        "response": response_text,
        "sender": "bot",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }), 200


def generate_bot_response(query):
    """Context-aware response generator tailored to Basit's portfolio & CS concepts."""
    q = query.lower()

    # 1. Who is Basit / About
    if any(k in q for k in ['who is', 'about basit', 'introduce', 'bio', 'who are you', 'tell me about yourself']):
        return (
            "👨‍💻 **Basit Hussain Shah** is a passionate Full Stack Developer and Cybersecurity Enthusiast.\n\n"
            "• **Undergraduate**: B.Tech in Computer Science & Engineering (2024–2027) at *Anna University / Nehru Institute of Engineering & Technology*, Coimbatore.\n"
            "• **Diploma**: 3-Year Diploma in Electrical Engineering (2020–2023) from *Govt. Polytechnic College Srinagar*.\n"
            "• **Core Focus**: Building robust web applications with **Python, Flask, JavaScript, SQL**, and applying secure coding and ethical hacking fundamentals.\n\n"
            "How can I help you explore his work or technical projects?"
        )

    # 2. Skills
    if any(k in q for k in ['skill', 'stack', 'technolog', 'languages', 'tools', 'know']):
        return (
            "⚙️ **Basit's Technical Stack & Core Competencies:**\n\n"
            "• **Backend & Databases**: Python, Flask, SQL, RESTful APIs, Relational Database Schema Design, System & Data Flow Workflows.\n"
            "• **Frontend & UI**: JavaScript (ES6+), HTML5, CSS3, Responsive Design, DOM Manipulation, Glassmorphic UI.\n"
            "• **Cybersecurity**: Ethical Hacking Methodologies, Network Port Scanning, Vulnerability Assessment, OWASP Security Defenses.\n"
            "• **Tools**: Git, GitHub, VS Code, SQLite, Linux/Bash."
        )

    # 3. Projects
    if any(k in q for k in ['project', 'work', 'tutor', 'portfolio work', 'built', 'creations']):
        return (
            "🚀 **Featured Projects Built by Basit:**\n\n"
            "1. **AI Power Education Assistant: A Virtual Tutor For Personalized Learning** (Flagship Project)\n"
            "   - Built in Coimbatore (2 months duration).\n"
            "   - Features conversational AI model reasoning, Flask backend APIs, optimized SQL database schemas, and dynamic data flow design for adaptive student learning.\n\n"
            "2. **Cyber Security Vulnerability Assessment & Network Scanner**\n"
            "   - Developed based on practical methodologies from CODTECH IT Solutions.\n"
            "   - Multi-threaded Python socket scanning, port inspection, and security audit reports.\n\n"
            "3. **Full Stack Flask CRUD & Data Management Suite**\n"
            "   - Complete relational web app with secure session auth, password hashing, and parameterized SQL queries."
        )

    # 4. Education & Qualifications
    if any(k in q for k in ['education', 'college', 'degree', 'diploma', 'university', 'study', 'cgpa', 'school']):
        return (
            "🎓 **Educational Background:**\n\n"
            "1. **B.Tech / BE in Computer Science & Engineering (2024 – 2027)**\n"
            "   - *Nehru Institute of Engineering and Technology (Anna University)*, Coimbatore.\n"
            "   - CGPA: **6.49**\n\n"
            "2. **Diploma in Electrical Engineering (2020 – 2023)**\n"
            "   - *Government Polytechnic College Gogji Bagh Srinagar (BOTE J&K)*.\n"
            "   - CGPA: **6.9**\n\n"
            "3. **Secondary School Examination / 10th (2018 – 2019)**\n"
            "   - *Darul Islamia High School Panzgam (JKBOSE)*.\n"
            "   - Percentage: **61.8%**"
        )

    # 5. Internship & Experience
    if any(k in q for k in ['intern', 'experience', 'codtech', 'work experience', 'job', 'workshop', 'seminar']):
        return (
            "💼 **Internship & Hands-on Training:**\n\n"
            "• **Cyber Security & Ethical Hacking Intern** @ *CODTECH IT SOLUTIONS PVT. LTD.* (1 Month, Online)\n"
            "  - Practiced ethical hacking phases: Reconnaissance, Scanning, Vulnerability Assessment, and Remediation.\n"
            "  - Conducted network scanning and produced structured security audit reports.\n\n"
            "• **Ethical Hacking & SOC Analyst Seminar / Workshop** (3 Days, Online)\n"
            "  - Security Operations Center workflows, incident detection, and log monitoring."
        )

    # 6. Certifications
    if any(k in q for k in ['certif', 'certificate', 'intel', 'maryland', 'badge', 'courses']):
        return (
            "📜 **Verified Certifications:**\n\n"
            "1. **AI for Entrepreneurship** — *Intel*\n"
            "2. **Cybersecurity for Everyone** — *University of Maryland*\n"
            "3. **Python Data Structure** — *Core CS Foundations*\n"
            "4. **Ethical Hacking Principles** — *Cyber Security Domain*\n"
            "5. **Introduction to Cybersecurity Essentials** — *Security Fundamentals*"
        )

    # 7. Contact Info & Social
    if any(k in q for k in ['contact', 'email', 'phone', 'reach', 'hire', 'linkedin', 'github', 'number', 'message']):
        return (
            "📬 **Get in Touch with Basit Hussain Shah:**\n\n"
            "• **Email**: [shahb5812@gmail.com](mailto:shahb5812@gmail.com)\n"
            "• **Phone**: [+91 6005013244](tel:+916005013244)\n"
            "• **LinkedIn**: [linkedin.com/in/basit-hussain-shah-a06b88405](https://www.linkedin.com/in/basit-hussain-shah-a06b88405/)\n"
            "• **GitHub**: [github.com/shahb5812](https://github.com/shahb5812)\n"
            "• **Location**: Coimbatore, Tamil Nadu / Pulwama, Jammu & Kashmir\n\n"
            "You can also send a direct message using the contact form on this portfolio!"
        )

    # 8. Technical: Python / Flask
    if 'flask' in q or 'route' in q:
        return (
            "🌶️ **Flask Routing & API Architecture:**\n\n"
            "In Flask, `@app.route()` maps URLs to controller functions:\n"
            "```python\n"
            "from flask import Flask, jsonify, request\n"
            "app = Flask(__name__)\n\n"
            "@app.route('/api/portfolio', methods=['GET'])\n"
            "def get_info():\n"
            "    return jsonify({\n"
            "        'developer': 'Basit Hussain Shah',\n"
            "        'skills': ['Python', 'Flask', 'SQL', 'Cybersecurity']\n"
            "    }), 200\n"
            "```\n"
            "💡 *Tip: Use Flask-CORS for cross-origin API integration with frontends!*"
        )

    if 'sql' in q or 'injection' in q:
        return (
            "🛡️ **SQL Injection Defense:**\n\n"
            "SQLi happens when untrusted user input is directly concatenated into SQL queries.\n\n"
            "✅ **Secure Implementation:** Always use parameterized queries:\n"
            "```python\n"
            "# Secure parameterized query in Python SQLite:\n"
            "cursor.execute('SELECT * FROM users WHERE email = ?', (user_email,))\n"
            "```\n"
            "This ensures the database treats input purely as data, neutralizing malicious commands."
        )

    if 'python' in q or 'list' in q:
        return (
            "🐍 **Python Programming & Data Structures:**\n\n"
            "Python offers rich built-in data structures (Lists, Dicts, Sets, Tuples):\n"
            "```python\n"
            "# List comprehension & dictionary mapping\n"
            "skills = ['Python', 'Flask', 'SQL', 'JavaScript']\n"
            "formatted = [f'Skill: {s.upper()}' for s in skills]\n"
            "print(formatted)\n"
            "```\n"
            "Basit applies Python for backend engineering, AI model orchestration, and security socket scripting!"
        )

    if 'cyber' in q or 'hack' in q or 'scan' in q or 'port' in q:
        return (
            "🔐 **Cybersecurity & Network Scanning:**\n\n"
            "Network scanning maps active hosts and open ports to discover exposed services:\n"
            "```python\n"
            "import socket\n"
            "s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n"
            "s.settimeout(1.0)\n"
            "result = s.connect_ex(('127.0.0.1', 80))\n"
            "print('Port 80 is OPEN' if result == 0 else 'Port 80 is CLOSED')\n"
            "s.close()\n"
            "```\n"
            "Basit applies ethical hacking methodologies for defensive security audits and secure web development."
        )

    # General Fallback
    return (
        f"Thanks for asking about **'{query}'**!\n\n"
        "I am **Basit Hussain Shah's AI Assistant**. I can help you with:\n"
        "• **About Basit**: Education, background in J&K / Coimbatore, and career goals.\n"
        "• **Skills & Tech Stack**: Python, Flask, SQL, JavaScript, HTML5/CSS3, Cybersecurity.\n"
        "• **Featured Projects**: AI Virtual Tutor, CyberSec Scanner, Flask CRUD Suite.\n"
        "• **Contact & Hire**: Direct email, phone, LinkedIn, and GitHub links.\n\n"
        "Feel free to ask any specific question!"
    )


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Basit Hussain Shah Portfolio Server running at http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
