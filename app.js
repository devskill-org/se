// Main Application Logic for FullStack Core Mentorship Platform

(function () {
  'use strict';

  // Storage key
  const STORAGE_KEY = 'fullstack_mentorship_state_v1';

  // Default state
  let state = {
    theme: 'dark',
    completedTopics: {},
    completedCheckpoints: {},
    activeView: 'overview' // 'overview' or topicId
  };

  // Load state from localStorage
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = { ...state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
  }

  // Save state to localStorage
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  // DOM Elements
  const themeToggle = document.getElementById('themeToggle');
  const navMenu = document.getElementById('navMenu');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const totalPercent = document.getElementById('totalPercent');
  const totalProgressBar = document.getElementById('totalProgressBar');
  const completedCount = document.getElementById('completedCount');
  const totalCount = document.getElementById('totalCount');
  const contentContainer = document.getElementById('contentContainer');
  const breadcrumbPhase = document.getElementById('breadcrumbPhase');
  const breadcrumbTopic = document.getElementById('breadcrumbTopic');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  const exportProgressBtn = document.getElementById('exportProgressBtn');
  const importProgressBtn = document.getElementById('importProgressBtn');
  const importFileInput = document.getElementById('importFileInput');
  const resetProgressBtn = document.getElementById('resetProgressBtn');

  // Flatten all modules for fast lookup
  const allModules = [];
  CURRICULUM_DATA.phases.forEach(phase => {
    phase.modules.forEach(mod => {
      allModules.push({ ...mod, phaseId: phase.id, phaseName: phase.name, phaseDuration: phase.duration });
    });
  });

  // Calculate Progress
  function updateProgress() {
    const total = allModules.length;
    let completed = 0;
    allModules.forEach(mod => {
      if (state.completedTopics[mod.id]) {
        completed++;
      }
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    if (totalPercent) totalPercent.textContent = `${percent}%`;
    if (totalProgressBar) totalProgressBar.style.width = `${percent}%`;
    if (completedCount) completedCount.textContent = completed;
    if (totalCount) totalCount.textContent = total;

    // Update nav item check indicators
    document.querySelectorAll('.nav-item').forEach(el => {
      const id = el.dataset.id;
      if (id && state.completedTopics[id]) {
        el.classList.add('completed');
      } else {
        el.classList.remove('completed');
      }
    });
  }

  // Render Sidebar Navigation
  function renderNav(filterQuery = '') {
    navMenu.innerHTML = '';

    // "Overview & Blueprint" Nav Item
    const overviewItem = document.createElement('a');
    overviewItem.className = `nav-item ${state.activeView === 'overview' ? 'active' : ''}`;
    overviewItem.href = '#overview';
    overviewItem.innerHTML = `
      <div class="nav-item-left">
        <span class="nav-item-icon">📋</span>
        <span>Roadmap & Schedule</span>
      </div>
      <span class="nav-item-badge">Overview</span>
    `;
    overviewItem.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('overview');
      closeMobileSidebar();
    });
    navMenu.appendChild(overviewItem);

    // "Get Started: Terminal Setup" Nav Item
    const getStartedItem = document.createElement('a');
    getStartedItem.className = 'nav-item';
    getStartedItem.href = '#getting-started';
    getStartedItem.innerHTML = `
      <div class="nav-item-left">
        <span class="nav-item-icon">🚀</span>
        <span>Get Started: Terminal</span>
      </div>
      <span class="nav-item-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">Setup</span>
    `;
    getStartedItem.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.activeView !== 'overview') {
        switchView('overview');
      }
      closeMobileSidebar();
      setTimeout(() => {
        const el = document.getElementById('getting-started');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
    navMenu.appendChild(getStartedItem);

    const query = filterQuery.toLowerCase().trim();

    CURRICULUM_DATA.phases.forEach((phase, phaseIdx) => {
      const matchingModules = phase.modules.filter(mod => {
        if (!query) return true;
        const inTitle = mod.title.toLowerCase().includes(query);
        const inSummary = mod.summary.toLowerCase().includes(query);
        const inConcepts = mod.keyConcepts.some(c => c.name.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query));
        const inCmds = mod.commands.some(c => c.cmd.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query));
        return inTitle || inSummary || inConcepts || inCmds;
      });

      if (matchingModules.length === 0) return;

      const groupEl = document.createElement('div');
      groupEl.className = 'nav-phase-group';

      const headerEl = document.createElement('div');
      headerEl.className = 'nav-phase-header';
      headerEl.textContent = `${phase.name.split(':')[0]} (${phase.duration})`;
      groupEl.appendChild(headerEl);

      matchingModules.forEach(mod => {
        const itemEl = document.createElement('a');
        const isActive = state.activeView === mod.id;
        const isCompleted = !!state.completedTopics[mod.id];
        itemEl.className = `nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        itemEl.dataset.id = mod.id;
        itemEl.href = `#${mod.id}`;

        const isMissing = mod.category.includes('Missing');
        const badgeClass = isMissing ? 'tag-missing' : 'tag-requested';

        itemEl.innerHTML = `
          <div class="nav-item-left">
            <span class="nav-item-icon">${mod.icon}</span>
            <span title="${mod.title}">${mod.title}</span>
          </div>
          <span class="nav-item-check" title="Mastered">✓</span>
        `;

        itemEl.addEventListener('click', (e) => {
          e.preventDefault();
          switchView(mod.id);
          closeMobileSidebar();
        });

        groupEl.appendChild(itemEl);
      });

      navMenu.appendChild(groupEl);
    });

    updateProgress();
  }

  // Switch View
  function switchView(viewId) {
    state.activeView = viewId;
    saveState();

    // Update active class in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active');
      if (el.dataset.id === viewId || (viewId === 'overview' && !el.dataset.id && el.getAttribute('href') === '#overview')) {
        el.classList.add('active');
      }
    });

    if (viewId === 'overview') {
      breadcrumbPhase.textContent = 'Roadmap';
      breadcrumbTopic.textContent = 'Mentorship Blueprint & 12-Week Plan';
      renderOverview();
      window.location.hash = 'overview';
    } else {
      const mod = allModules.find(m => m.id === viewId);
      if (mod) {
        breadcrumbPhase.textContent = mod.phaseName.split(':')[0];
        breadcrumbTopic.textContent = mod.title;
        renderTopic(mod);
        window.location.hash = mod.id;
      }
    }

    // Scroll to top of content
    document.getElementById('mainContent').scrollTop = 0;
  }

  // Hook up Copy buttons
  function hookUpCopyButtons(container = document) {
    container.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-clipboard');
        if (navigator.clipboard && text) {
          navigator.clipboard.writeText(text).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.backgroundColor = 'var(--accent-emerald)';
            btn.style.color = 'white';
            setTimeout(() => {
              btn.textContent = original;
              btn.style.backgroundColor = '';
              btn.style.color = '';
            }, 1800);
          }).catch(err => {
            console.error('Clipboard copy failed:', err);
          });
        }
      });
    });
  }

  // Render Overview View
  function renderOverview() {
    const totalTopics = allModules.length;
    const requestedCount = allModules.filter(m => m.category.includes('Requested')).length;
    const missingCount = allModules.filter(m => m.category.includes('Missing')).length;

    contentContainer.innerHTML = `
      <div class="hero-section">
        <span class="hero-badge">⚡ Full Stack Engineering Mentorship Curriculum</span>
        <h1 class="hero-title">From Code to Production: The Complete Roadmap</h1>
        <p class="hero-desc">
          A hands-on, structured guide designed for 1:1 engineering mentorship. Bridging the gap between writing application logic and mastering the underlying network, container, database, and infrastructure systems.
        </p>
        <div class="hero-stats-row">
          <div class="stat-box">
            <div class="stat-number">12</div>
            <div class="stat-label">Weeks Roadmap</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${totalTopics}</div>
            <div class="stat-label">Core Modules</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">20+</div>
            <div class="stat-label">Practical Labs</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">40+</div>
            <div class="stat-label">Checkpoints</div>
          </div>
        </div>
      </div>

      <!-- Getting Started Section -->
      <section class="getting-started-section" id="getting-started">
        <div class="section-label">🚀 Get Started: Developer Terminal Setup (macOS &amp; Windows)</div>
        <div class="os-guide-container">
          <div class="os-guide-header">
            <h3><span>💻</span> Prepare Your Engineering Workstation</h3>
            <p>
              Phase 1 dives straight into Linux processes, stream redirection, SSH keys, Docker containers, and Git DAGs. 
              Before writing code, your terminal must be configured with a true POSIX/Unix environment. Select your OS below:
            </p>
          </div>

          <!-- OS Selector Tabs -->
          <div class="os-tabs-nav" role="tablist">
            <button class="os-tab-btn active" data-tab="tab-mac" role="tab">
              <span>🍎</span> macOS Setup
            </button>
            <button class="os-tab-btn" data-tab="tab-win" role="tab">
              <span>🪟</span> Windows (WSL 2 Setup)
            </button>
            <button class="os-tab-btn" data-tab="tab-compare" role="tab">
              <span>⚖️</span> WSL 2 vs. Virtual Machine
            </button>
            <button class="os-tab-btn" data-tab="tab-verify" role="tab">
              <span>✅</span> Verification Drill
            </button>
          </div>

          <!-- Tab 1: macOS -->
          <div class="os-tab-pane active" id="tab-mac">
            <div class="rec-banner" style="background: rgba(59, 130, 246, 0.08); border-color: rgba(59, 130, 246, 0.3);">
              <div class="rec-banner-title" style="color: var(--accent-blue);">
                <span>🍎</span> Native Unix (Darwin / Zsh)
              </div>
              <div class="rec-banner-desc">
                macOS runs directly on a certified Unix foundation with <strong>Zsh</strong> as the default shell. You get native POSIX compliance out of the box. Follow these 4 steps to install standard compilers and package management:
              </div>
            </div>

            <div class="os-steps-list">
              <div class="os-step">
                <div class="os-step-num">1</div>
                <div class="os-step-body">
                  <div class="os-step-title">Install Xcode Command Line Tools</div>
                  <div class="os-step-desc">Provides <code>git</code>, <code>clang</code>, <code>make</code>, and core Unix compilers without needing the full 15GB+ Xcode app.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">xcode-select --install</span>
                      <span class="code-desc">Run in Terminal.app, then click 'Install' on the popup dialog</span>
                    </div>
                    <button class="copy-btn" data-clipboard="xcode-select --install">Copy</button>
                  </div>
                </div>
              </div>

              <div class="os-step">
                <div class="os-step-num">2</div>
                <div class="os-step-body">
                  <div class="os-step-title">Install Homebrew Package Manager</div>
                  <div class="os-step-desc">The industry standard package manager for macOS to install developer tools, runtimes, and databases.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</span>
                      <span class="code-desc">Installs brew to /opt/homebrew (Apple Silicon) or /usr/local (Intel)</span>
                    </div>
                    <button class="copy-btn" data-clipboard='/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'>Copy</button>
                  </div>
                </div>
              </div>

              <div class="os-step">
                <div class="os-step-num">3</div>
                <div class="os-step-body">
                  <div class="os-step-title">Install Recommended Terminal Emulator &amp; Core CLI Tools</div>
                  <div class="os-step-desc">We recommend modern GPU-accelerated terminals like <strong>Ghostty</strong> or <strong>iTerm2</strong> alongside essential Unix utilities.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">brew install --cask ghostty &amp;&amp; brew install git curl wget jq tree starship</span>
                      <span class="code-desc">Installs Ghostty terminal and standard command-line diagnostic utilities</span>
                    </div>
                    <button class="copy-btn" data-clipboard="brew install --cask ghostty &amp;&amp; brew install git curl wget jq tree starship">Copy</button>
                  </div>
                </div>
              </div>

              <div class="os-step">
                <div class="os-step-num">4</div>
                <div class="os-step-body">
                  <div class="os-step-title">Configure Starship Shell Prompt</div>
                  <div class="os-step-desc">Adds an informative, high-speed status prompt to Zsh showing active Git branch, dirty state, and runtime versions.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">echo 'eval "$(starship init zsh)"' >> ~/.zshrc &amp;&amp; source ~/.zshrc</span>
                      <span class="code-desc">Appends Starship prompt configuration to ~/.zshrc and reloads current shell</span>
                    </div>
                    <button class="copy-btn" data-clipboard='echo "eval \"$(starship init zsh)\"" >> ~/.zshrc &amp;&amp; source ~/.zshrc'>Copy</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Windows Setup (WSL 2) -->
          <div class="os-tab-pane" id="tab-win">
            <div class="rec-banner">
              <div class="rec-banner-title">
                <span>⭐️</span> Mentor Recommendation: WSL 2 (Windows Subsystem for Linux 2)
              </div>
              <div class="rec-banner-desc">
                For Windows users, <strong>we strongly recommend WSL 2 with Ubuntu over a traditional Virtual Machine</strong>. 
                WSL 2 runs a real Linux kernel under a lightweight Hyper-V utility VM with dynamic RAM allocation, 1-click VS Code remote integration, and native Docker Desktop support.
              </div>
            </div>

            <div class="os-steps-list">
              <div class="os-step">
                <div class="os-step-num">1</div>
                <div class="os-step-body">
                  <div class="os-step-title">Install WSL 2 &amp; Ubuntu with 1 Command</div>
                  <div class="os-step-desc">Open <strong>PowerShell as Administrator</strong> and run the command below. Restart your PC if prompted.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">wsl --install</span>
                      <span class="code-desc">Enables WSL 2 &amp; Virtual Machine Platform, downloads the Linux kernel and Ubuntu</span>
                    </div>
                    <button class="copy-btn" data-clipboard="wsl --install">Copy</button>
                  </div>
                </div>
              </div>

              <div class="os-step">
                <div class="os-step-num">2</div>
                <div class="os-step-body">
                  <div class="os-step-title">Create Linux Account &amp; Update Packages</div>
                  <div class="os-step-desc">Open <strong>Ubuntu</strong> from the Windows Start Menu, choose a UNIX username/password, and install fundamental build tools.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">sudo apt update &amp;&amp; sudo apt upgrade -y &amp;&amp; sudo apt install -y build-essential curl git wget jq tree</span>
                      <span class="code-desc">Updates APT repositories and installs gcc, make, git, curl, and json processing utilities</span>
                    </div>
                    <button class="copy-btn" data-clipboard="sudo apt update &amp;&amp; sudo apt upgrade -y &amp;&amp; sudo apt install -y build-essential curl git wget jq tree">Copy</button>
                  </div>
                </div>
              </div>

              <div class="os-step">
                <div class="os-step-num">3</div>
                <div class="os-step-body">
                  <div class="os-step-title">Install Windows Terminal</div>
                  <div class="os-step-desc">Install <strong>Windows Terminal</strong> from the Microsoft Store or via Winget for tabbed profiles, UTF-8 font rendering, and GPU acceleration.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">winget install Microsoft.WindowsTerminal</span>
                      <span class="code-desc">Installs official Windows Terminal via Windows Package Manager</span>
                    </div>
                    <button class="copy-btn" data-clipboard="winget install Microsoft.WindowsTerminal">Copy</button>
                  </div>
                </div>
              </div>

              <div class="os-step">
                <div class="os-step-num">4</div>
                <div class="os-step-body">
                  <div class="os-step-title">Connect VS Code to Linux via WSL Extension</div>
                  <div class="os-step-desc">Install <a href="https://code.visualstudio.com/" target="_blank" style="color: var(--accent-blue);">VS Code</a> on Windows and add the <strong>WSL extension</strong> (<code>ms-vscode-remote.remote-wsl</code>). Inside Ubuntu, navigate to your project and run <code>code .</code>.</div>
                  <div class="code-block">
                    <div class="code-content">
                      <span class="code-cmd">mkdir -p ~/projects &amp;&amp; cd ~/projects &amp;&amp; code .</span>
                      <span class="code-desc">Launches VS Code connected to Ubuntu with zero latency</span>
                    </div>
                    <button class="copy-btn" data-clipboard="mkdir -p ~/projects &amp;&amp; cd ~/projects &amp;&amp; code .">Copy</button>
                  </div>
                </div>
              </div>

              <div class="os-step">
                <div class="os-step-num">5</div>
                <div class="os-step-body">
                  <div class="os-step-title">Docker Desktop Integration</div>
                  <div class="os-step-desc">Install Docker Desktop for Windows. In <strong>Settings &gt; General</strong>, verify <em>"Use the WSL 2 based engine"</em> is checked. In <strong>Resources &gt; WSL Integration</strong>, enable your Ubuntu distro.</div>
                </div>
              </div>
            </div>

            <div class="warning-banner">
              <div class="warning-banner-title">
                <span>⚠️</span> The Golden Windows Performance Rule
              </div>
              <div class="warning-banner-desc">
                <strong>Always keep your code inside the Linux filesystem</strong> (e.g., <code>/home/&lt;user&gt;/projects/...</code> or <code>~/projects</code>). 
                <strong>Do NOT</strong> store active code in <code>/mnt/c/Users/...</code>. Crossing the Windows-to-WSL 9P translation boundary slows down <code>git status</code>, Docker volumes, and <code>npm install</code> by 5x–10x!
              </div>
            </div>
          </div>

          <!-- Tab 3: Comparison WSL 2 vs Virtual Machine -->
          <div class="os-tab-pane" id="tab-compare">
            <div class="rec-banner">
              <div class="rec-banner-title">
                <span>💡</span> Architectural Verdict: WSL 2 vs Virtual Machine
              </div>
              <div class="rec-banner-desc">
                <strong>Recommendation:</strong> Use <strong>WSL 2</strong> for 99% of full stack engineering. 
                Traditional Virtual Machines (VirtualBox, VMware) are monolithic: they statically reserve fixed gigabytes of RAM, take 30–60 seconds to boot, and create severe friction with IDEs and Docker. 
                WSL 2 gives you a real Linux kernel with native host performance and seamless developer ergonomics.
              </div>
            </div>

            <div class="comparison-table-wrapper">
              <table class="plan-table">
                <thead>
                  <tr>
                    <th style="width: 22%;">Feature</th>
                    <th style="width: 32%;">WSL 2 <span class="badge-recommended">Recommended ⭐️</span></th>
                    <th style="width: 28%;">Virtual Machine (VirtualBox/VMware)</th>
                    <th style="width: 18%;">Git Bash <span class="badge-fallback">Fallback</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Linux Kernel</strong></td>
                    <td>Real Linux 5.15 / 6.x kernel managed by Hyper-V</td>
                    <td>Real Linux kernel in full guest OS</td>
                    <td>No kernel (MSYS2 translation layer)</td>
                  </tr>
                  <tr>
                    <td><strong>RAM &amp; CPU Usage</strong></td>
                    <td><strong style="color: var(--accent-emerald);">Dynamic:</strong> Claims RAM on demand, frees it back to Windows</td>
                    <td><strong style="color: var(--accent-rose);">Static:</strong> Locks 4–8 GB of RAM permanently while open</td>
                    <td>Negligible</td>
                  </tr>
                  <tr>
                    <td><strong>IDE Integration (VS Code)</strong></td>
                    <td><strong style="color: var(--accent-emerald);">Native 1-click remote:</strong> UI runs on Windows, language server in Linux</td>
                    <td>Clunky: requires SSH server setup or shared folders</td>
                    <td>Runs directly on Windows host files</td>
                  </tr>
                  <tr>
                    <td><strong>Docker &amp; Containers</strong></td>
                    <td><strong style="color: var(--accent-emerald);">Native:</strong> Docker Desktop shares the WSL 2 Linux kernel</td>
                    <td>Requires nested virtualization or running Docker inside guest</td>
                    <td>Limited to Windows container mode</td>
                  </tr>
                  <tr>
                    <td><strong>Startup Latency</strong></td>
                    <td>&lt; 1 second</td>
                    <td>30–60 seconds OS boot</td>
                    <td>Instant</td>
                  </tr>
                  <tr>
                    <td><strong>File Interoperability</strong></td>
                    <td>Two-way: <code>\\\\wsl$\\Ubuntu</code> and <code>/mnt/c/</code></td>
                    <td>Shared folders (frequent permission/symlink issues)</td>
                    <td>Native Windows NTFS only</td>
                  </tr>
                  <tr>
                    <td><strong>When to Choose?</strong></td>
                    <td><strong>Standard for Full Stack, DevOps, Docker &amp; Cloud</strong></td>
                    <td>Only if corporate IT blocks WSL or you need a desktop GUI (GNOME)</td>
                    <td>Quick fallback if virtualization disabled</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab 4: Terminal Verification Drill -->
          <div class="os-tab-pane" id="tab-verify">
            <div class="rec-banner" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3);">
              <div class="rec-banner-title">
                <span>🎯</span> Phase 1 Readiness Verification Drill
              </div>
              <div class="rec-banner-desc">
                Once your terminal is installed (on macOS or Windows WSL 2), open it and run the diagnostic commands below. This verifies that your POSIX environment, Git, and networking tools are ready for Week 1.
              </div>
            </div>

            <div class="code-list">
              <div class="code-block">
                <div class="code-content">
                  <span class="code-cmd">echo "OS: $(uname -s) | Shell: $SHELL | Git: $(git --version | awk '{print $3}') | Python: $(python3 --version 2&gt;&amp;1 | awk '{print $2}')"</span>
                  <span class="code-desc">Quick 1-liner sanity check: prints OS kernel, active shell, Git release, and Python version</span>
                </div>
                <button class="copy-btn" data-clipboard='echo "OS: $(uname -s) | Shell: $SHELL | Git: $(git --version | awk &apos;{print $3}&apos;) | Python: $(python3 --version 2&gt;&amp;1 | awk &apos;{print $2}&apos;)"'>Copy</button>
              </div>

              <div class="code-block">
                <div class="code-content">
                  <span class="code-cmd">curl -s -I https://github.com | head -n 5</span>
                  <span class="code-desc">Verify outbound TLS networking and HTTP resolution from your new shell</span>
                </div>
                <button class="copy-btn" data-clipboard="curl -s -I https://github.com | head -n 5">Copy</button>
              </div>

              <div class="code-block">
                <div class="code-content">
                  <span class="code-cmd">git config --global user.name "Your Name" &amp;&amp; git config --global user.email "you@example.com"</span>
                  <span class="code-desc">Configure your global Git commit identity before starting Version Control labs</span>
                </div>
                <button class="copy-btn" data-clipboard='git config --global user.name "Your Name" &amp;&amp; git config --global user.email "you@example.com"'>Copy</button>
              </div>

              <div class="code-block">
                <div class="code-content">
                  <span class="code-cmd">ssh -V &amp;&amp; ls -la ~/.ssh/ 2&gt;/dev/null || echo "Ready to generate SSH keys in Week 2"</span>
                  <span class="code-desc">Verify OpenSSH installation and check if ~/.ssh directory is initialized</span>
                </div>
                <button class="copy-btn" data-clipboard='ssh -V &amp;&amp; ls -la ~/.ssh/ 2&gt;/dev/null || echo "Ready to generate SSH keys in Week 2"'>Copy</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gap Analysis Section -->
      <section class="gap-analysis-card">
        <div class="gap-header">
          <h3>🎯 Mentor Blueprint: What You Listed vs Crucial Missing Fundamentals</h3>
          <span class="tag tag-missing">${missingCount} Essential Additions</span>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 0.95rem; line-height: 1.6;">
          Your initial list (<strong>Network, Docker, Git, CI/CD, AI Tools</strong>) forms a fantastic foundation for the modern developer workflow. However, for a <em>Full Stack Software Engineer</em> to be autonomous in production, several foundational pillars are indispensable:
        </p>

        <div class="gap-grid">
          <div class="gap-column">
            <div class="gap-col-title" style="color: var(--accent-purple);">
              <span>📋</span> Topics You Requested (${requestedCount})
            </div>
            <ul class="gap-list">
              <li><strong>1. Git & Version Control:</strong> DAG mental model, interactive rebase, conflict resolution, bisect, reflog.</li>
              <li><strong>2. Computer Networking:</strong> TCP/IP vs UDP, DNS resolution, HTTP/1.1-2-3, TLS handshake, CORS, WebSockets.</li>
              <li><strong>3. Docker & Containers:</strong> Namespaces/cgroups, multi-stage Dockerfiles, volumes, bridge networks, Compose.</li>
              <li><strong>4. CI/CD:</strong> GitHub Actions, quality gates (lint/type/test), secrets management, deployment strategies.</li>
              <li><strong>5. AI Tools for Dev:</strong> Prompt engineering for code, context management, test generation, verification against hallucinations.</li>
            </ul>
          </div>

          <div class="gap-column" style="border-color: rgba(245, 158, 11, 0.4);">
            <div class="gap-col-title" style="color: var(--accent-amber);">
              <span>⭐</span> Crucial Fundamentals Added (${missingCount})
            </div>
            <ul class="gap-list">
              <li><strong>Linux & Process Lifecycle:</strong> Background jobs (&), streams/redirection (> 2>&1), lsof/ps inspection, live log follow (tail -f), signals (SIGTERM/KILL).</li>
              <li><strong>PKI & SSH Key Mastery:</strong> Asymmetric crypto, Ed25519, strict permissions (600/700), ssh-agent, ~/.ssh/config, tunnels, Certificate Authorities.</li>
              <li><strong>Web Architecture & Browsers:</strong> Critical rendering path (DOM/CSSOM), SSR vs CSR, Session cookies vs JWTs, OAuth2.</li>
              <li><strong>Databases & Query Optimization:</strong> Normalization, B-Tree indexes, EXPLAIN ANALYZE, N+1 query problem, migrations.</li>
              <li><strong>Application Security (OWASP):</strong> SQLi, XSS, CSRF, SSRF, password hashing (Argon2), secure cookie flags.</li>
              <li><strong>System Design & Scalability:</strong> Horizontal scaling, load balancers, Cache-Aside with Redis, background worker queues.</li>
              <li><strong>Testing & Code Quality:</strong> The Test Pyramid, integration tests with real databases, deterministic testing.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 12-Week Mentorship Plan Table -->
      <section class="topic-section" id="learning-plan">
        <div class="section-label">📅 Recommended 12-Week Mentorship Timeline</div>
        <table class="plan-table">
          <thead>
            <tr>
              <th style="width: 12%;">Week</th>
              <th style="width: 32%;">Topic & Weekly Focus</th>
              <th style="width: 30%;">Practical Deliverable</th>
              <th style="width: 26%;">Weekly 1:1 Mentor Checkpoint</th>
            </tr>
          </thead>
          <tbody>
            ${CURRICULUM_DATA.learningPlan.map(w => `
              <tr>
                <td>
                  <span class="plan-week-tag">${w.week}</span>
                  <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">${w.phase}</div>
                </td>
                <td>
                  <div class="plan-title-col">${w.title}</div>
                  <div class="plan-focus-text">${w.focus}</div>
                </td>
                <td>
                  <div class="plan-deliverable">${w.deliverable}</div>
                </td>
                <td>
                  <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${w.mentor1on1}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <!-- Quick Cheatsheet Section -->
      <section class="topic-section" id="quick-cheatsheet" style="margin-top: 3rem;">
        <div class="section-label">📑 Quick Reference & Rules of Thumb for Mentees</div>
        <div class="cheatsheet-grid">
          <div class="cheatsheet-card">
            <h4>🐧 CLI Docs & Man Navigation</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Use <code>&lt;cmd&gt; --help</code> for quick syntax summaries. Use <code>man &lt;cmd&gt;</code> for in-depth manuals: press <code>/pattern</code> + <kbd>Enter</kbd> to search forward, <code>n</code> for next match, and <code>q</code> to exit.
            </p>
          </div>
          <div class="cheatsheet-card">
            <h4>🔑 SSH & PKI Golden Rule</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Private keys (<code>id_ed25519</code>) must be <code>chmod 600</code> and never leave your computer. Public keys (<code>.pub</code>) are the padlock you distribute. Always manage aliases via <code>~/.ssh/config</code>.
            </p>
          </div>
          <div class="cheatsheet-card">
            <h4>🌐 Networking Golden Rule</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              CORS is enforced by the <strong>browser</strong>, never by the backend or curl. If curl succeeds but browser fails, it's missing <code>Access-Control-Allow-Origin</code> response headers.
            </p>
          </div>
          <div class="cheatsheet-card">
            <h4>🐳 Docker Caching Tip</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Always <code>COPY package.json</code> or dependency manifests <strong>before</strong> <code>COPY . .</code>. Docker invalidates every subsequent layer cache whenever copied files change.
            </p>
          </div>
          <div class="cheatsheet-card">
            <h4>🌿 Git Conflict Rule</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Never resolve a merge conflict blindly. Test the application locally after resolving conflicts and run unit tests <em>before</em> running <code>git rebase --continue</code> or <code>git commit</code>.
            </p>
          </div>
          <div class="cheatsheet-card">
            <h4>🤖 AI Coding Golden Rule</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Never commit code generated by AI without reading every line and running tests. If you cannot explain what a line does in code review, don't commit it.
            </p>
          </div>
          <div class="cheatsheet-card">
            <h4>💾 Database Querying</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              When response latency spikes, run <code>EXPLAIN ANALYZE</code>. If you see <em>Seq Scan on [large table]</em>, an index is missing. Watch out for N+1 queries in loops.
            </p>
          </div>
          <div class="cheatsheet-card">
            <h4>🛡️ Security Mindset</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              All user input is hostile until sanitized. Use parameterized SQL queries, store sensitive auth tokens only in <code>HttpOnly, SameSite</code> cookies, never in localStorage.
            </p>
          </div>
        </div>
      </section>
    `;

    // Hook up OS Setup tabs
    document.querySelectorAll('.os-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        document.querySelectorAll('.os-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.os-tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const activePane = document.getElementById(tabTarget);
        if (activePane) activePane.classList.add('active');
      });
    });

    // Hook up Copy buttons in Overview
    hookUpCopyButtons(contentContainer);
  }

  // Render Topic View
  function renderTopic(mod) {
    const isCompleted = !!state.completedTopics[mod.id];
    const isMissing = mod.category.includes('Missing');

    contentContainer.innerHTML = `
      <div class="topic-header-view">
        <div class="topic-meta-row">
          <span class="tag tag-phase">${mod.phaseName.split(':')[0]} (${mod.phaseDuration})</span>
          <span class="tag ${isMissing ? 'tag-missing' : 'tag-requested'}">${mod.category}</span>
          <span class="tag" style="background: var(--bg-tertiary); color: var(--text-secondary);">${mod.badge}</span>
        </div>
        <div class="topic-title-row">
          <h1 class="topic-main-title">
            <span>${mod.icon}</span>
            <span>${mod.title}</span>
          </h1>
          <div class="topic-action-complete">
            <button id="toggleCompleteBtn" class="toggle-complete-btn ${isCompleted ? 'is-completed' : ''}">
              <span>${isCompleted ? '✓ Completed' : 'Mark as Mastered'}</span>
            </button>
          </div>
        </div>
        <p class="topic-summary">${mod.summary}</p>
      </div>

      <!-- Why it matters -->
      <section class="topic-section">
        <div class="section-label">💡 Why It Matters in Real Engineering</div>
        <div class="callout-box">
          ${mod.whyItMatters}
        </div>
      </section>

      <!-- Mental Model -->
      <section class="topic-section">
        <div class="section-label">🧠 The Mental Model</div>
        <div class="callout-box mental-model">
          ${mod.mentalModel}
        </div>
      </section>

      <!-- Key Concepts -->
      <section class="topic-section">
        <div class="section-label">🔑 Core Concepts & Architecture</div>
        <div class="concepts-grid">
          ${mod.keyConcepts.map(c => `
            <div class="concept-card">
              <h4>${c.name}</h4>
              <p>${c.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Essential Commands & Code -->
      <section class="topic-section">
        <div class="section-label">💻 Essential Commands & Practical Snippets</div>
        <div class="code-list">
          ${mod.commands.map(cmd => `
            <div class="code-block">
              <div class="code-content">
                <code class="code-cmd">${escapeHtml(cmd.cmd)}</code>
                <span class="code-desc">${cmd.desc}</span>
              </div>
              <button class="copy-btn" data-clipboard="${escapeHtml(cmd.cmd)}">Copy</button>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Practical Hands-on Labs -->
      <section class="topic-section">
        <div class="section-label">🛠️ Hands-on Labs & Mentorship Challenges</div>
        <div class="labs-container">
          ${mod.labs.map(lab => `
            <div class="lab-card">
              <h4 class="lab-title">${lab.title}</h4>
              <div class="lab-goal"><strong>Goal:</strong> ${formatInlineCode(lab.goal)}</div>
              ${lab.steps ? `
                <div class="lab-task">
                  <div class="lab-task-heading"><strong>Exercise Steps:</strong></div>
                  <ol class="lab-steps-list">
                    ${lab.steps.map(step => `<li>${formatInlineCode(step)}</li>`).join('')}
                  </ol>
                </div>
              ` : (lab.task ? `<div class="lab-task"><strong>Exercise:</strong> ${formatInlineCode(lab.task)}</div>` : '')}
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Common Pitfalls -->
      <section class="topic-section">
        <div class="section-label">⚠️ Common Junior Engineer Pitfalls to Avoid</div>
        <div class="pitfalls-card">
          <ul class="pitfalls-list">
            ${mod.pitfalls.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      </section>

      <!-- Checkpoint Checklist -->
      <section class="topic-section">
        <div class="section-label">✅ Mentee Checkpoint & Verification Checklist</div>
        <div class="checkpoint-card">
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Tick off each item during your 1:1 mentor sync when you can comfortably explain or demonstrate it:
          </p>
          <ul class="checkpoint-list">
            ${mod.checkpoint.map((item, idx) => {
              const checkKey = `${mod.id}_cp_${idx}`;
              const isChecked = !!state.completedCheckpoints[checkKey];
              return `
                <li class="checkpoint-item ${isChecked ? 'checked' : ''}" data-key="${checkKey}">
                  <input type="checkbox" id="${checkKey}" ${isChecked ? 'checked' : ''} />
                  <label for="${checkKey}"><span>${item}</span></label>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      </section>
    `;

    // Hook up Toggle Complete button
    const toggleBtn = document.getElementById('toggleCompleteBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        state.completedTopics[mod.id] = !state.completedTopics[mod.id];
        saveState();
        renderTopic(mod);
        updateProgress();
      });
    }

    // Hook up Checkpoint checkboxes
    document.querySelectorAll('.checkpoint-item input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const key = e.target.id;
        state.completedCheckpoints[key] = e.target.checked;
        saveState();
        const parentLi = e.target.closest('.checkpoint-item');
        if (e.target.checked) {
          parentLi.classList.add('checked');
        } else {
          parentLi.classList.remove('checked');
        }
      });
    });

    // Hook up Copy buttons
    hookUpCopyButtons(contentContainer);
  }

  // Helper to escape HTML in code blocks
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Format inline code snippets wrapped in backticks
  function formatInlineCode(str) {
    if (!str) return '';
    const escaped = escapeHtml(str);
    return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  // Theme Handling
  function initTheme() {
    if (state.theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeToggle) themeToggle.querySelector('.theme-icon').textContent = '☀️';
    } else {
      document.body.classList.remove('light-theme');
      if (themeToggle) themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      saveState();
      initTheme();
    });
  }

  // Mobile menu toggle
  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('open');
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (sidebar) sidebar.classList.toggle('open');
    });
  }

  // Search Handling
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length > 0) {
        clearSearch.hidden = false;
      } else {
        clearSearch.hidden = true;
      }
      renderNav(val);
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      clearSearch.hidden = true;
      renderNav('');
    });
  }

  // Progress Export / Import / Reset
  if (exportProgressBtn) {
    exportProgressBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mentee_progress_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  if (importProgressBtn && importFileInput) {
    importProgressBtn.addEventListener('click', () => {
      importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported && typeof imported === 'object') {
            state = { ...state, ...imported };
            saveState();
            renderNav(searchInput.value);
            switchView(state.activeView || 'overview');
            alert('Mentee progress imported successfully!');
          }
        } catch (err) {
          alert('Failed to parse imported JSON file.');
        }
      };
      reader.readAsText(file);
      importFileInput.value = '';
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all checklist and completion progress?')) {
        state.completedTopics = {};
        state.completedCheckpoints = {};
        saveState();
        renderNav(searchInput.value);
        if (state.activeView !== 'overview') {
          const mod = allModules.find(m => m.id === state.activeView);
          if (mod) renderTopic(mod);
        } else {
          renderOverview();
        }
        updateProgress();
      }
    });
  }

  // Overview anchor targets
  const overviewAnchors = ['overview', 'getting-started', 'learning-plan', 'quick-cheatsheet'];

  // Initial Hash routing check
  function initRouting() {
    loadState();
    initTheme();

    const hash = window.location.hash.replace('#', '');
    if (hash && (overviewAnchors.includes(hash) || allModules.some(m => m.id === hash))) {
      state.activeView = overviewAnchors.includes(hash) ? 'overview' : hash;
    } else {
      state.activeView = 'overview';
    }

    renderNav();
    switchView(state.activeView);

    if (overviewAnchors.includes(hash) && hash !== 'overview') {
      setTimeout(() => {
        const targetEl = document.getElementById(hash);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }

  // Listen to hash change for browser back/forward buttons
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && (overviewAnchors.includes(hash) || allModules.some(m => m.id === hash))) {
      const targetView = overviewAnchors.includes(hash) ? 'overview' : hash;
      if (targetView !== state.activeView) {
        switchView(targetView);
      }
      if (overviewAnchors.includes(hash) && hash !== 'overview') {
        setTimeout(() => {
          const targetEl = document.getElementById(hash);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    }
  });

  // Boot app
  initRouting();
})();
