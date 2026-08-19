/**
 * Basit Hussain Shah - Main Portfolio Script
 * Handles navigation, theme toggle, typewriter, terminal runner, modals,
 * clipboard tools, and scroll animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Management (Dark / Light) ---
  const themeToggleBtn = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('bhs_theme') || (prefersDark ? 'dark' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('bhs_theme', nextTheme);
      updateThemeIcon(nextTheme);
      showToast(`Switched to ${nextTheme} theme`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }

  // --- 2. Navbar & Mobile Menu ---
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header scroll background
    if (scrollPos > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollPos > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Active Section Tracking
    highlightActiveNav();
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        activeLink?.classList.add('active');
      } else {
        activeLink?.classList.remove('active');
      }
    });
  }

  // --- 3. Dynamic Typewriter Effect ---
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const words = [
      'Full Stack Developer',
      'Python & Flask Specialist',
      'Cybersecurity & Ethical Hacking Enthusiast',
      'AI & Web Solutions Builder',
      'B.Tech CSE @ Anna University'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 95;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 1600; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  // --- 4. Interactive Mini Terminal ---
  const terminalBody = document.getElementById('terminalBody');
  const chipBtns = document.querySelectorAll('.chip-btn');

  const terminalCommands = {
    help: 'Available commands: \n• <strong>skills</strong>: List core tech stack\n• <strong>projects</strong>: View highlighted projects\n• <strong>edu</strong>: Academic journey\n• <strong>contact</strong>: Direct contact info\n• <strong>clear</strong>: Clean terminal window',
    skills: '⚙️ <strong>Skills</strong>:\n- Backend: Python, Flask, SQL, REST APIs\n- Frontend: HTML5, CSS3, JavaScript (ES6+)\n- Security: Ethical Hacking, Network Scanning, Vulnerability Assessment\n- Tools: Git, GitHub, VS Code',
    projects: '🚀 <strong>Projects</strong>:\n1. <em>AI Powered Education Assistant</em> (Virtual Tutor for Adaptive Learning)\n2. <em>CyberSec Vulnerability Assessment & Network Scanner</em>\n3. <em>Full Stack Flask CRUD & Data Management System</em>',
    edu: '🎓 <strong>Education</strong>:\n- B.Tech CSE (2024-2027) @ Anna University / NIET\n- Diploma Electrical Engg (2020-2023) @ Govt Polytechnic Srinagar\n- 10th (2018-2019) @ Darul Islamia High School',
    contact: '📬 <strong>Contact Basit</strong>:\n- Email: shahb5812@gmail.com\n- Phone: +91 6005013244\n- GitHub: github.com/shahb5812\n- LinkedIn: linkedin.com/in/basit-hussain-shah-a06b88405\n- Location: Pulwama, J&K / Coimbatore, TN',
    about: '👨‍💻 <strong>Basit Hussain Shah</strong>: Full-Stack Developer with passion for secure code, database design, and intelligent web applications.'
  };

  function executeTerminalCommand(cmd) {
    if (!terminalBody) return;
    const cleanCmd = cmd.trim().toLowerCase();

    if (cleanCmd === 'clear') {
      terminalBody.innerHTML = `
        <div class="terminal-line"><span class="prompt">basit@portfolio:~$</span> <span class="command">help</span></div>
        <div class="terminal-line"><span class="output">${terminalCommands.help.replace(/\n/g, '<br>')}</span></div>
      `;
      return;
    }

    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="prompt">basit@portfolio:~$</span> <span class="command">${cleanCmd}</span>`;
    terminalBody.appendChild(commandLine);

    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';

    if (terminalCommands[cleanCmd]) {
      outputLine.innerHTML = `<span class="output">${terminalCommands[cleanCmd].replace(/\n/g, '<br>')}</span>`;
    } else {
      outputLine.innerHTML = `<span class="output" style="color: #ef4444;">Command not recognized: "${cleanCmd}". Type "help" or click a quick chip below.</span>`;
    }

    terminalBody.appendChild(outputLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) executeTerminalCommand(cmd);
    });
  });

  // --- 5. Skills Category Filter ---
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category?.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // --- 6. CV Viewer Modal & Print ---
  const cvModalBackdrop = document.getElementById('cvModal');
  const openCvBtns = document.querySelectorAll('.open-cv-modal');
  const closeCvBtns = document.querySelectorAll('.close-cv-modal');
  const printCvBtn = document.getElementById('printCvBtn');

  openCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cvModalBackdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeCvBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cvModalBackdrop?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  if (cvModalBackdrop) {
    cvModalBackdrop.addEventListener('click', (e) => {
      if (e.target === cvModalBackdrop) {
        cvModalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- 7. Copy to Clipboard Tools ---
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = originalText; }, 1800);
        }).catch(() => {
          showToast('Failed to copy to clipboard');
        });
      }
    });
  });

  // --- 8. Contact Form Handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || 'Friend';
      const email = document.getElementById('senderEmail')?.value;
      const subject = document.getElementById('emailSubject')?.value || 'Portfolio Contact';
      const message = document.getElementById('emailMessage')?.value;

      if (!email || !message) {
        showToast('Please provide your email and message.');
        return;
      }

      showToast('Sending message to server...');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          showToast(data.message || 'Message stored in database successfully! ✨');
          contactForm.reset();
          return;
        }
        throw new Error(data.error || 'API error');
      } catch (err) {
        // Fallback for static hosting
        const mailtoLink = `mailto:shahb5812@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
        showToast(`Saved locally! Opening your email client to notify Basit...`);
        setTimeout(() => {
          window.location.href = mailtoLink;
        }, 800);
        contactForm.reset();
      }
    });
  }

  // --- 9. Toast Notification System ---
  function showToast(message, duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- 10. Photo Upload & Preview Handler ---
  const photoUploadInput = document.getElementById('photoUploadInput');
  const heroAvatarImg = document.getElementById('heroAvatarImg');
  const savedCustomPhoto = localStorage.getItem('bhs_custom_avatar');

  if (savedCustomPhoto && heroAvatarImg) {
    heroAvatarImg.src = savedCustomPhoto;
  }

  if (photoUploadInput && heroAvatarImg) {
    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file (JPG, PNG, WebP).');
          return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          const base64Data = event.target.result;
          heroAvatarImg.src = base64Data;
          try {
            localStorage.setItem('bhs_custom_avatar', base64Data);
          } catch (err) {
            console.warn('Image too large for localStorage, showing for current session only.');
          }
          showToast('Profile photo updated successfully! ✨');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Keyboard shortcut to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModalBackdrop?.classList.contains('active')) {
      cvModalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});
