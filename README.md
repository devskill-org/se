# Full Stack Engineering Mentorship Platform

An interactive, zero-dependency static web application and 12-week curriculum blueprint designed for 1:1 engineering mentorship.

## 🚀 How to Run Locally

Because this is a pure static website (HTML, modern CSS, and vanilla JS), you do not need to install heavy dependencies or build tools.

### Option 1: Python
```bash
python3 -m http.server 3000
# Open http://localhost:3000 in your browser
```

### Option 2: Node.js / npx
```bash
npx serve .
# or
npx http-server -p 3000
```

### Option 3: Direct File
You can also open `index.html` directly in any modern web browser.

---

## 🛠️ Get Started: Developer Terminal Setup (macOS & Windows)

Before starting the curriculum modules (Linux process lifecycle, SSH key authentication, Docker containers, and Git DAGs), every engineer needs a reliable Unix terminal workstation.

### 🍎 macOS Setup

macOS is built on a Unix foundation (Darwin/BSD) and uses **Zsh** by default.

1. **Install Xcode Command Line Tools:**
   Provides `git`, `make`, `clang`, and core Unix developer tools without downloading the multi-gigabyte Xcode IDE:
   ```bash
   xcode-select --install
   ```
2. **Install Homebrew (The macOS Package Manager):**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   Add Homebrew to your shell environment (follow the prompt output at the end of the installation):
   ```bash
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
   eval "$(/opt/homebrew/bin/brew shellenv)"
   ```
3. **Recommended Terminal Emulator:**
   - **Ghostty** (ultra-fast, GPU-accelerated: `brew install --cask ghostty`)
   - **iTerm2** (battle-tested with tabs & split panes: `brew install --cask iterm2`)
   - Or stick with the native macOS Terminal.app.
4. **Install Essential CLI Tools:**
   ```bash
   brew install git curl wget jq tree starship
   ```
5. **Configure Starship Prompt (Displays Git branch & status):**
   ```bash
   echo 'eval "$(starship init zsh)"' >> ~/.zshrc
   source ~/.zshrc
   ```

---

### 🪟 Windows Setup: WSL 2 vs. Virtual Machine

#### 💡 Mentor Recommendation: Use WSL 2 (Windows Subsystem for Linux 2)
For full-stack engineering, **WSL 2 is unequivocally recommended over a traditional Virtual Machine (VirtualBox / VMware)**.

| Comparison Factor | WSL 2 (Recommended ⭐️) | Virtual Machine (VirtualBox / VMware) | Git Bash (Fallback) |
| :--- | :--- | :--- | :--- |
| **Linux Kernel** | Real Linux kernel running on lightweight Hyper-V | Real Linux kernel inside a full guest OS | Emulated POSIX translation |
| **Memory / CPU Allocation** | **Dynamic**: claims RAM on-demand and returns it to Windows | **Static**: locks 4–8 GB RAM permanently even when idle | Minimal footprint |
| **VS Code Integration** | **Seamless**: 1-click remote dev via WSL extension (`code .`) | Cumbersome: requires SSH server or shared folders | Native on Windows files |
| **Docker Integration** | **Native**: Docker Desktop uses the WSL 2 backend | Nested virtualization overhead or VM-only Docker | Limited Windows containers |
| **Boot / Startup Speed** | **< 1 second** | 30–60 seconds per boot | Instant |
| **File Interoperability** | Two-way: `\\wsl$\Ubuntu` and `/mnt/c/` | Guest additions shared folders (prone to sync issues) | Windows filesystem only |
| **Verdict** | **Standard for modern web & backend development** | Use only for GUI Linux desktop testing or strict IT locks | Bare-minimum fallback |

#### Why NOT a traditional Virtual Machine?
- **Static RAM hog:** VirtualBox and VMware carve out a dedicated chunk of RAM (e.g. 6 GB) that Windows cannot use, starving your browser and IDE. WSL 2 scales memory dynamically.
- **Developer ergonomics:** Running a code editor inside a VM GUI feels sluggish, while editing files outside via shared network folders introduces file watch latency and permission bugs.
- **Docker in a VM:** Running Docker inside a VM requires nested virtualization, resulting in poor CPU and I/O performance.

> **When is a Virtual Machine justified?**
> Only if your corporate IT security policies explicitly block Hyper-V/WSL on Windows, or if you specifically need a full desktop GUI (GNOME/KDE) or custom Linux kernel driver development.

#### Step-by-Step WSL 2 Setup Guide

1. **Install WSL 2 & Ubuntu:**
   Open PowerShell as **Administrator** and run:
   ```powershell
   wsl --install
   ```
   *(Installs WSL 2, the Virtual Machine Platform component, and Ubuntu LTS automatically).*
   Restart your PC when prompted.

2. **Initialize Your Linux Account:**
   Launch **Ubuntu** from the Windows Start menu. Set your Unix username and password.

3. **Update Packages & Install Core Tools:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y build-essential curl git wget jq tree
   ```

4. **Install Windows Terminal:**
   Install **Windows Terminal** from the Microsoft Store or via Winget:
   ```powershell
   winget install Microsoft.WindowsTerminal
   ```
   Set Ubuntu as your default profile in Windows Terminal settings.

5. **Install VS Code with WSL Extension:**
   - Install [Visual Studio Code](https://code.visualstudio.com/) on Windows.
   - Install the **WSL** extension (`ms-vscode-remote.remote-wsl`).
   - In your Ubuntu terminal, navigate to your project and run:
     ```bash
     code .
     ```
     VS Code runs its server inside Linux while rendering the UI with Windows hardware acceleration.

6. **Install Docker Desktop with WSL 2 Backend:**
   - Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
   - Ensure "Use the WSL 2 based engine" is enabled in Docker Settings > General.
   - Under Settings > Resources > WSL Integration, enable integration for Ubuntu.

7. **⚠️ Critical Performance Tip for Windows:**
   - Always store your git repositories inside the **Linux filesystem** (e.g., `~/projects/...` or `/home/<username>/code/`).
   - **Do NOT** place active projects in `/mnt/c/Users/...`. Accessing Windows NTFS through the 9P translation bridge causes severe file I/O latency for `npm install`, Git operations, and build tools.

---

### ✅ Terminal Verification Drill

Run this one-liner in your terminal (macOS or Windows WSL 2) to verify your environment is ready for the mentorship:

```bash
echo "OS: $(uname -s) | Shell: $SHELL | Git: $(git --version | awk '{print $3}') | Python: $(python3 --version 2>&1 | awk '{print $2}')"
```

---

## 🎯 Curriculum Structure

1. **Linux & Process Lifecycle:** Background jobs (`&`), streams/redirection (`> 2>&1`), process management (`lsof`/`ps`), real-time log following (`tail -f | grep`), and OS signals (`kill -15`).
2. **Git & Version Control:** DAG mental model, interactive rebasing, merge vs rebase, resolving conflicts, reflog recovery.
3. **PKI & SSH Key Mastery:** Asymmetric cryptography, Ed25519 vs RSA, strict Unix permissions (600/700), `ssh-agent`, `~/.ssh/config` multiplexing, SSH port forwarding tunnels, and Certificate Authorities.
4. **Computer Networking:** OSI/TCP-IP, DNS resolution, HTTP/1.1 vs HTTP/2/3, TLS handshake, CORS, REST, WebSockets, gRPC.
5. **Web Architecture & Security:** Critical rendering path (DOM/CSSOM), SSR vs CSR, Session cookies vs JWTs, OAuth2/OIDC.
6. **Databases & Data Modeling:** Relational schema design, indexes (B-Tree), `EXPLAIN ANALYZE`, transactions & ACID, N+1 query problem, migrations.
7. **Application Security (OWASP Top 10):** SQL injection, XSS, CSRF, SSRF, password hashing (Argon2), secure cookie flags.
8. **Docker & Containers:** Namespaces, cgroups, multi-stage Dockerfiles, caching layers, volumes, bridge networks, Docker Compose.
9. **CI/CD & Automation:** Automated testing pipelines, linting, GitHub Actions workflows, secrets management, deployment strategies.
10. **Testing & Code Quality:** The Test Pyramid (Unit, Integration, E2E), testing with real ephemeral databases, mocking strategies.
11. **System Design & Scalability:** Stateless services, horizontal scaling, load balancers, caching strategies (Redis Cache-Aside), async queues.
12. **AI Tools for Dev:** Prompt engineering for code, context management, test generation, debugging workflows, hallucination verification.

---

## 🌟 Interactive Features for Mentors & Mentees

- **Live Progress Tracking:** Track completion percentage across all modules and sub-checkpoints.
- **Local Persistence:** All checked checkpoints and completed topics are automatically saved in `localStorage`.
- **Export & Import Progress:** Export progress as a JSON file during weekly 1:1 syncs so the mentor can review and sync state.
- **Quick Command Cheatsheets:** Interactive terminal commands with 1-click clipboard copy.
- **Hands-on Labs:** Real-world challenges designed for mentee practice.
- **Dark & Light Mode:** Developer-friendly themes.
