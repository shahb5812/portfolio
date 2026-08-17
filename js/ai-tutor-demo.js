/**
 * AI Virtual Tutor - Interactive Simulator
 * Demonstrates Basit Hussain Shah's flagship project:
 * "AI Power Education Assistant: A Virtual Tutor For Personalized Learning"
 */

(function () {
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  const promptButtons = document.querySelectorAll('.quick-prompt-btn');

  if (!chatMessages || !chatInput || !chatForm) return;

  // Knowledge base for instant, high-quality responses
  const tutorResponses = {
    python_list: {
      keywords: ['list', 'array', 'append', 'extend', 'slice'],
      response: `**Python Lists** are ordered, mutable collections capable of holding diverse data types:

\`\`\`python
# Creating and modifying lists
tech_stack = ["Python", "Flask", "SQL"]
tech_stack.append("JavaScript")

# Slicing example
frontend = tech_stack[2:]  # ['SQL', 'JavaScript']
print(f"Total tools: {len(tech_stack)}")
\`\`\`
💡 *Tip: Lists provide $O(1)$ amortized append and $O(1)$ index access!*`
    },
    flask_route: {
      keywords: ['flask', 'route', 'backend', 'server', 'api'],
      response: `**Flask Routing & RESTful API Setup:**

In Flask, the \`@app.route()\` decorator binds a URL path to a Python view function:

\`\`\`python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/students/<int:id>', methods=['GET'])
def get_student(id):
    student_data = {"id": id, "name": "Basit", "major": "Computer Science"}
    return jsonify({"success": True, "data": student_data}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
\`\`\`
🔒 *Security Tip: Always validate incoming request payloads before database queries!*`
    },
    sql_injection: {
      keywords: ['sql', 'injection', 'cyber', 'security', 'vulnerability', 'hack', 'database'],
      response: `**SQL Injection (SQLi) & Defense Mechanism:**

SQLi happens when untrusted user input is directly concatenated into a database query.

❌ **Vulnerable Query:**
\`\`\`python
# NEVER do this:
cursor.execute(f"SELECT * FROM users WHERE username = '{user_input}'")
\`\`\`

✅ **Secure Parameterized Query:**
\`\`\`python
# Use parameterized prepared statements:
cursor.execute("SELECT * FROM users WHERE username = %s", (user_input,))
\`\`\`
🛡️ *Key Takeaway: Always use ORM (e.g. SQLAlchemy) or parameterized queries to neutralize malicious SQL sequences.*`
    },
    data_structures: {
      keywords: ['data structure', 'tree', 'graph', 'stack', 'queue', 'linked list', 'complexity', 'big o'],
      response: `**Core Data Structures in Python:**

1. **Stack (LIFO)**: Use \`list.append()\` & \`list.pop()\`
2. **Queue (FIFO)**: Use \`collections.deque\` for $O(1)$ left pops.
3. **Hash Map / Dict**: $O(1)$ average time key-value lookups.

\`\`\`python
from collections import deque

queue = deque(["Task 1", "Task 2", "Task 3"])
queue.append("Task 4")
processed = queue.popleft()  # 'Task 1'
print(f"Next to process: {queue[0]}")
\`\`\``
    },
    cyber_scanning: {
      keywords: ['scan', 'network', 'port', 'nmap', 'socket', 'ethical'],
      response: `**Network Port Scanning Concept (Python Sockets):**

A fundamental step in ethical hacking and vulnerability assessment is identifying open network services:

\`\`\`python
import socket

def scan_port(host, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    try:
        status = s.connect_ex((host, port))
        if status == 0:
            print(f"[+] Port {port} is OPEN")
        s.close()
    except Exception as e:
        print(f"[-] Scan error: {e}")

# Example: scan_port("127.0.0.1", 80)
\`\`\`
⚠️ *Note: Only scan networks and targets you own or have explicit written permission to test.*`
    }
  };

  function appendMessage(sender, text, isCode = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.textContent = sender === 'bot' ? 'AI' : 'You';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    // Format simple markdown (bold, code blocks, backticks)
    let formattedText = text
      .replace(/\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g, (match, lang, code) => {
        return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
      })
      .replace(/\`([^`]+)\`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    bubble.innerHTML = formattedText;

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getTutorResponse(userInput) {
    const cleanInput = userInput.toLowerCase();

    for (const key in tutorResponses) {
      const item = tutorResponses[key];
      if (item.keywords.some(k => cleanInput.includes(k))) {
        return item.response;
      }
    }

    // Default intelligent guidance
    return `Great question about **${escapeHtml(userInput)}**! 

As your **AI Virtual Tutor**, here is a recommended roadmap:
1. **Analyze the problem requirement** and identify edge cases.
2. **Design the database and system data flow** before writing code.
3. **Implement clean backend logic** in Flask / Python with structured error handling.
4. **Enforce cybersecurity standards** like input sanitization and secure authentication.

Would you like to explore **Python data structures**, **Flask backend APIs**, or **Cybersecurity fundamentals**?`;
  }

  function handleUserQuery(query) {
    if (!query || !query.trim()) return;

    // User message
    appendMessage('user', query.trim());
    chatInput.value = '';

    // Show temporary typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-msg bot typing-temp';
    typingIndicator.innerHTML = `
      <div class="chat-avatar">AI</div>
      <div class="chat-bubble" style="opacity: 0.7; font-style: italic;">
        AI Tutor is thinking...
      </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingIndicator.remove();
      const answer = getTutorResponse(query);
      appendMessage('bot', answer);
    }, 450);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserQuery(chatInput.value);
  });

  promptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      handleUserQuery(prompt);
    });
  });
})();
