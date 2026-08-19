/**
 * Basit Hussain Shah - Floating AI Chatbot Assistant
 * Connects to /api/chat Flask backend with seamless client-side fallback.
 */

(function () {
  // Session ID generation
  const sessionId = 'session_' + Math.random().toString(36).substring(2, 9);
  const BACKEND_CHAT_API = '/api/chat';

  // Client-side fallback knowledge base (for static deployments like GitHub Pages)
  const localKnowledgeBase = [
    {
      keywords: ['who is', 'about basit', 'introduce', 'bio', 'who are you', 'tell me about yourself', 'background'],
      answer: `👨‍💻 **Basit Hussain Shah** is a Full Stack Developer & Cybersecurity Enthusiast.\n\n• **B.Tech CSE (2024–2027)** @ Anna University / Nehru Institute of Engineering & Technology, Coimbatore (CGPA: 6.49)\n• **Diploma in Electrical Engineering (2020–2023)** @ Govt. Polytechnic College Srinagar (CGPA: 6.9)\n• **Core Skills**: Python, Flask, SQL, JavaScript, HTML5/CSS3, Cybersecurity & Ethical Hacking.`
    },
    {
      keywords: ['skill', 'stack', 'technolog', 'languages', 'tools', 'know', 'frontend', 'backend'],
      answer: `⚙️ **Basit's Technical Stack:**\n\n• **Backend**: Python, Flask, RESTful APIs, Relational Database Design, System Workflows\n• **Frontend**: JavaScript (ES6+), HTML5, CSS3, Responsive UI\n• **Cybersecurity**: Ethical Hacking, Network Port Scanning, Vulnerability Assessment, OWASP\n• **Tools**: Git, GitHub, VS Code, SQLite`
    },
    {
      keywords: ['project', 'work', 'tutor', 'ai project', 'portfolio work', 'scanner'],
      answer: `🚀 **Highlighted Projects:**\n\n1. **AI Power Education Assistant: A Virtual Tutor For Personalized Learning** (Flagship 2-month project with AI model reasoning, Flask backend, and SQL database workflows)\n2. **Cyber Security Vulnerability Assessment & Network Scanner** (Socket-based multi-threaded scanning & audit reports)\n3. **Full Stack Flask CRUD & Data Management Suite** (Secure session auth & parameterized SQL)`
    },
    {
      keywords: ['education', 'college', 'degree', 'diploma', 'university', 'study', 'cgpa', 'school', '10th'],
      answer: `🎓 **Educational Qualifications:**\n\n1. **B.Tech / BE in CSE (2024–2027)** — Anna University / NIET, Coimbatore (CGPA: 6.49)\n2. **Diploma in Electrical Engineering (2020–2023)** — Govt. Polytechnic College Srinagar (CGPA: 6.9)\n3. **10th Standard (2018–2019)** — Darul Islamia High School Panzgam (61.8%)`
    },
    {
      keywords: ['intern', 'experience', 'codtech', 'work experience', 'soc', 'workshop'],
      answer: `💼 **Experience & Internships:**\n\n• **Cyber Security & Ethical Hacking Intern** @ CODTECH IT SOLUTIONS (1 Month, Online)\n  - Practiced ethical hacking phases, vulnerability assessment, and professional security reporting.\n• **Ethical Hacking & SOC Analyst Seminar** (3 Days intensive)`
    },
    {
      keywords: ['certif', 'certificate', 'intel', 'maryland', 'badge'],
      answer: `📜 **Certifications:**\n\n• **AI for Entrepreneurship** — Intel\n• **Cybersecurity for Everyone** — University of Maryland\n• **Python Data Structure**\n• **Ethical Hacking Principles**\n• **Introduction to Cybersecurity Essentials**`
    },
    {
      keywords: ['contact', 'email', 'phone', 'reach', 'hire', 'linkedin', 'github', 'number', 'address'],
      answer: `📬 **Contact Basit Hussain Shah:**\n\n• **Email**: [shahb5812@gmail.com](mailto:shahb5812@gmail.com)\n• **Phone**: [+91 6005013244](tel:+916005013244)\n• **LinkedIn**: [linkedin.com/in/basit-hussain-shah-a06b88405](https://www.linkedin.com/in/basit-hussain-shah-a06b88405/)\n• **GitHub**: [github.com/shahb5812](https://github.com/shahb5812)\n• **Location**: Coimbatore, TN / Pulwama, J&K`
    }
  ];

  function getLocalResponse(query) {
    const q = query.toLowerCase();
    for (const item of localKnowledgeBase) {
      if (item.keywords.some(k => q.includes(k))) {
        return item.answer;
      }
    }
    return `Thanks for asking about **"${escapeHtml(query)}"**!\n\nI am **Basit's AI Portfolio Assistant**. You can ask me about his:\n• **Background & Education** (Anna University B.Tech, Srinagar Diploma)\n• **Technical Skills** (Python, Flask, SQL, Cybersecurity)\n• **Featured Projects** (AI Virtual Tutor, Network Scanner)\n• **Contact & Social Profiles**`;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    return text
      .replace(/\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g, (m, lang, code) => {
        return `<div class="code-block-wrapper"><pre><code>${escapeHtml(code.trim())}</code></pre></div>`;
      })
      .replace(/\`([^`]+)\`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-cyan); text-decoration: underline;">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function createChatbotUI() {
    // Check if container already exists
    if (document.getElementById('floatingChatbot')) return;

    const chatbotHTML = `
      <!-- Floating Toggle Button -->
      <div class="chatbot-toggle-wrapper" id="chatbotToggleWrapper">
        <button class="chatbot-toggle-btn" id="chatbotToggleBtn" aria-label="Open AI Assistant Chatbot" title="Chat with Basit's AI Assistant">
          <div class="bot-icon-glow">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span class="chatbot-toggle-label">Ask Basit's AI</span>
          <span class="chatbot-pulse-dot"></span>
        </button>
      </div>

      <!-- Chatbot Window -->
      <div class="chatbot-window" id="chatbotWindow" aria-hidden="true">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-left">
            <div class="bot-status-avatar">
              <span>AI</span>
              <span class="status-indicator"></span>
            </div>
            <div class="bot-title-info">
              <h4>Basit's AI Assistant</h4>
              <p><span class="api-status-badge">REST API Active</span></p>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button class="bot-action-btn" id="clearChatBtn" title="Clear Chat History" aria-label="Clear chat">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="bot-action-btn" id="closeChatBtn" title="Close Chat" aria-label="Close chat">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div class="chatbot-body" id="chatbotMessages">
          <div class="bot-msg bot-incoming">
            <div class="bot-msg-bubble">
              👋 Hi there! I'm <strong>Basit Hussain Shah's AI Assistant</strong> powered by our Flask REST API.
              <br><br>
              How can I assist you today? You can click any quick question below or ask me anything!
            </div>
          </div>
        </div>

        <!-- Suggestion Chips -->
        <div class="chatbot-chips" id="chatbotChips">
          <button class="bot-chip" data-query="Tell me about Basit Hussain Shah">👨‍💻 About Basit</button>
          <button class="bot-chip" data-query="What are Basit's core skills and tech stack?">⚙️ Skills & Stack</button>
          <button class="bot-chip" data-query="Tell me about the AI Virtual Tutor project">🤖 AI Tutor Project</button>
          <button class="bot-chip" data-query="How can I contact or hire Basit?">📬 Contact & Hire</button>
          <button class="bot-chip" data-query="What is his cybersecurity experience?">🛡️ Cybersecurity</button>
          <button class="bot-chip" data-query="Explain his education and diploma">🎓 Education</button>
        </div>

        <!-- Input Form -->
        <form class="chatbot-footer" id="chatbotForm">
          <input type="text" id="chatbotInput" placeholder="Ask about Basit's projects, skills, or coding..." autocomplete="off" required>
          <button type="submit" class="bot-send-btn" id="chatbotSendBtn" aria-label="Send message">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    `;

    const container = document.createElement('div');
    container.id = 'floatingChatbot';
    container.innerHTML = chatbotHTML;
    document.body.appendChild(container);

    setupChatbotListeners();
  }

  function setupChatbotListeners() {
    const toggleBtn = document.getElementById('chatbotToggleBtn');
    const closeBtn = document.getElementById('closeChatBtn');
    const clearBtn = document.getElementById('clearChatBtn');
    const chatWindow = document.getElementById('chatbotWindow');
    const chatForm = document.getElementById('chatbotForm');
    const chatInput = document.getElementById('chatbotInput');
    const chips = document.querySelectorAll('.chatbot-chips .bot-chip');

    if (toggleBtn && chatWindow) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = chatWindow.classList.toggle('active');
        chatWindow.setAttribute('aria-hidden', !isOpen);
        if (isOpen) {
          setTimeout(() => chatInput?.focus(), 150);
        }
      });
    }

    if (closeBtn && chatWindow) {
      closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        chatWindow.setAttribute('aria-hidden', 'true');
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const msgs = document.getElementById('chatbotMessages');
        if (msgs) {
          msgs.innerHTML = `
            <div class="bot-msg bot-incoming">
              <div class="bot-msg-bubble">
                🧹 Chat history cleared! Ask me anything about Basit's full-stack work, cybersecurity, or projects.
              </div>
            </div>
          `;
        }
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) {
          sendUserMessage(query);
        }
      });
    });

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text) {
          sendUserMessage(text);
          chatInput.value = '';
        }
      });
    }
  }

  function appendChatMsg(sender, rawText) {
    const msgsContainer = document.getElementById('chatbotMessages');
    if (!msgsContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `bot-msg ${sender === 'user' ? 'bot-outgoing' : 'bot-incoming'}`;

    const bubble = document.createElement('div');
    bubble.className = 'bot-msg-bubble';
    bubble.innerHTML = formatMarkdown(rawText);

    msgDiv.appendChild(bubble);
    msgsContainer.appendChild(msgDiv);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const msgsContainer = document.getElementById('chatbotMessages');
    if (!msgsContainer) return null;

    const indicator = document.createElement('div');
    indicator.className = 'bot-msg bot-incoming bot-typing-indicator';
    indicator.id = 'botTyping';
    indicator.innerHTML = `
      <div class="bot-msg-bubble">
        <span class="typing-dots"><span></span><span></span><span></span></span>
      </div>
    `;
    msgsContainer.appendChild(indicator);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
    return indicator;
  }

  async function sendUserMessage(query) {
    appendChatMsg('user', query);
    const typingIndicator = showTypingIndicator();

    try {
      // Attempt backend API call
      const response = await fetch(BACKEND_CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        typingIndicator?.remove();
        appendChatMsg('bot', data.response || 'No response received.');
        return;
      }
      throw new Error('Backend returned non-200');
    } catch (err) {
      // Graceful offline fallback
      setTimeout(() => {
        typingIndicator?.remove();
        const fallbackAns = getLocalResponse(query);
        appendChatMsg('bot', fallbackAns);
      }, 400);
    }
  }

  // Initialize UI once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbotUI);
  } else {
    createChatbotUI();
  }
})();
