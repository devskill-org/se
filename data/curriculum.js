// Comprehensive Full Stack Engineering Curriculum Data

const CURRICULUM_DATA = {
  phases: [
    {
      id: "phase-1",
      name: "Phase 1: Developer Environment & Linux Foundations",
      duration: "Weeks 1 - 2",
      description: "Mastering the developer's core workstation: Linux process lifecycle, streams, pipes, background jobs, and Git internals.",
      modules: [
        {
          id: "linux-cli",
          title: "Linux & Shell Fundamentals",
          category: "Missing Core",
          badge: "Crucial",
          icon: "🐧",
          summary: "Process lifecycle, background execution, standard streams, real-time log streaming, and troubleshooting commands.",
          whyItMatters: "Every backend server, container, and CI runner operates on Linux. Engineers who lack shell fluency struggle to diagnose live process crashes, investigate open ports, or monitor production logs.",
          mentalModel: "In Unix, 'everything is a file'. Programs read from standard input (stdin 0), write to standard output (stdout 1), and report errors on standard error (stderr 2). A process runs in memory with a unique PID, receives OS signals (SIGTERM/SIGKILL), and communicates through file descriptors and network sockets.",
          keyConcepts: [
            {
              name: "Process Lifecycle & Background Jobs",
              desc: "Foreground vs background execution (`&`), Process IDs (PID), parent/child processes, and job control (`jobs`, `fg`, `bg`)."
            },
            {
              name: "Standard Streams & Redirection",
              desc: "stdin (0), stdout (1), stderr (2). Redirecting output (`>`), appending (`>>`), combining streams (`2>&1`), and sending to the null device (`> /dev/null`)."
            },
            {
              name: "OS Signals & Termination",
              desc: "Graceful shutdown with SIGTERM (15), force kill with SIGKILL (9), hangup with SIGHUP (1), and process probing with `kill -0 <PID>`."
            },
            {
              name: "File Descriptors & Sockets",
              desc: "How processes bind to network ports, tracking open sockets with `lsof` and `ss`, and inspecting `/proc/<PID>/` runtime data."
            },
            {
              name: "Live Log Streaming & Pipes",
              desc: "Following append-only files with `tail -f`, piping into `grep --line-buffered`, and combining stream filters like `awk`, `cut`, and `sort`."
            },
            {
              name: "Built-in Documentation: man & --help",
              desc: "Every standard Linux utility includes built-in documentation. Use `man <command>` for complete reference manuals, `<command> --help` or `-h` for quick argument summaries, and `help <builtin>` for shell built-ins. Manuals open in a pager (`less`): type `/pattern` to search forward, `n` / `N` for next/previous match, and `q` to exit."
            }
          ],
          commands: [
            {
              cmd: "python3 -u -m http.server 8080 > app.log 2>&1 &",
              desc: "Start an unbuffered HTTP server on port 8080 in background, redirecting stdout & stderr to app.log"
            },
            {
              cmd: "lsof -i :8080",
              desc: "Check which process is listening on port 8080 and retrieve its PID"
            },
            {
              cmd: "ps -fp $(lsof -ti :8080)",
              desc: "Inspect the running process hierarchy, user, CPU/memory, and startup arguments"
            },
            {
              cmd: "curl -s -o /dev/null -w \"HTTP %{http_code} | Total time: %{time_total}s\\n\" http://localhost:8080/api/health",
              desc: "Send an HTTP request to the running server, triggering a log entry in app.log"
            },
            {
              cmd: "tail -f app.log | grep --line-buffered \"GET /api/health\"",
              desc: "Stream the log file in real time and filter specifically for health check requests"
            },
            {
              cmd: "kill -15 $(lsof -ti :8080)",
              desc: "Send SIGTERM (15) to gracefully shut down the server process"
            },
            {
              cmd: "lsof -i :8080 || echo \"Port 8080 is clear and process terminated\"",
              desc: "Verify that the process terminated cleanly and the network socket was released"
            },
            {
              cmd: "lsof --help | head -n 12",
              desc: "Quick documentation flag: display syntax synopsis and common options right in the terminal"
            },
            {
              cmd: "man lsof",
              desc: "Open complete reference manual in the 'less' pager. Navigation: '/' to search, 'n' next match, 'q' to exit"
            }
          ],
          labs: [
            {
              title: "Lab 1.1: Hands-on Process & Log Lifecycle",
              goal: "Execute a practical process lifecycle drill from scratch in terminal using the commands above.",
              steps: [
                "Launch a background server on port 8080 logging unbuffered output to `app.log` (`python3 -u -m http.server 8080 > app.log 2>&1 &`).",
                "Inspect the running process and obtain its PID using `lsof -i :8080`.",
                "Open a separate terminal window and run `tail -f app.log` to follow logs in real time.",
                "Send 5 test `curl` requests with custom query parameters (`curl http://localhost:8080/api/health`).",
                "Verify the log entries appear in real time in your streaming terminal.",
                "Gracefully terminate the server with `kill -15` and verify port release with `lsof`."
              ]
            },
            {
              title: "Lab 1.2: Bash Data Processing Pipeline",
              goal: "Use `grep`, `awk`, `cut`, `sort`, and `uniq -c` to parse a mock web server access log to find top 5 requested endpoints and error counts."
            }
          ],
          pitfalls: [
            "Forgetting python output buffering (failing to pass `-u`), which prevents logs from writing to disk in real time.",
            "Using `kill -9` (SIGKILL) immediately instead of `kill -15` (SIGTERM), which prevents the application from closing database connections and flushing file buffers.",
            "Leaving zombie background processes bound to ports, then wondering why restarting a dev server throws `EADDRINUSE`."
          ],
          checkpoint: [
            "I can start a background process with stdout and stderr redirected to a log file.",
            "I can find the PID of any process occupying a port using `lsof -i` and inspect its state with `ps`.",
            "I can stream and filter live log files with `tail -f` and `grep --line-buffered`.",
            "I understand the difference between SIGTERM (15) and SIGKILL (9) and always terminate gracefully first.",
            "I can inspect command documentation with `<cmd> --help` and navigate manuals using `man <cmd>`, `/` to search, and `q` to exit."
          ]
        },
        {
          id: "git",
          title: "Git & Version Control Mastery",
          category: "Requested Core",
          badge: "Fundamental",
          icon: "🌿",
          summary: "Directed Acyclic Graphs (DAG), interactive rebasing, merge vs rebase, resolving conflicts, and trunk-based workflow.",
          whyItMatters: "Git is not just about `add`, `commit`, and `push`. Understanding Git's data structure prevents devastating data loss, keeps history clean for bisecting bugs, and streamlines team collaboration.",
          mentalModel: "Git is a content-addressable storage engine storing a Directed Acyclic Graph (DAG) of immutable commit objects. A branch is merely a lightweight movable pointer (a 41-byte text file) pointing to a commit hash. HEAD points to where you currently are.",
          keyConcepts: [
            {
              name: "Git's Three Trees & Object Model",
              desc: "Working Directory, Staging Area (Index), and Git Repository (.git commit history). Blobs, trees, commits, and tags."
            },
            {
              name: "Merge vs Rebase",
              desc: "Merge commits preserve historical branch topology. Rebase rewrites commit history onto a new base commit for a linear, bisectable log."
            },
            {
              name: "Interactive Rebase (git rebase -i)",
              desc: "Squashing micro-commits, rewording commit messages, dropping unwanted commits, and splitting changes before raising PRs."
            },
            {
              name: "Merge Conflict Resolution",
              desc: "Understanding `<<<<<<< HEAD`, `=======`, and `>>>>>>>`. 3-way merge tools (vimdiff, VS Code, delta), and `git rerere`."
            },
            {
              name: "Safety Nets: reflog & reset",
              desc: "`git reflog` records every movement of HEAD. Even 'deleted' commits can be recovered if not yet garbage-collected."
            }
          ],
          commands: [
            { cmd: "git log --oneline --graph --decorate --all", desc: "Visualize the commit DAG across all branches" },
            { cmd: "git rebase -i HEAD~4", desc: "Interactively tidy the last 4 commits (squash, reword, fixup)" },
            { cmd: "git stash push -m 'wip-feature' && git stash pop", desc: "Stash uncommitted changes with description" },
            { cmd: "git reflog", desc: "View history of HEAD positions to recover lost commits" },
            { cmd: "git bisect start HEAD <good-hash>", desc: "Binary search history to find the exact commit that introduced a bug" }
          ],
          labs: [
            {
              title: "Lab 2.1: The 'Oops I Deleted It' Recovery with Git Reflog",
              goal: "Simulate an accidental hard reset (`git reset --hard HEAD~3`) and use `git reflog` to safely restore the repository to the desired commit.",
              task: "Create 3 commits on a test repo, run hard reset, observe lost commits, run `git reflog`, locate the commit SHA before the reset, and recover with `git reset --hard HEAD@{1}`."
            },
            {
              title: "Lab 2.2: Clean PR Hygiene with Interactive Rebase",
              goal: "Take a dirty feature branch with 5 messy commits ('fix typo', 'wip', 'wip 2'), rebase interactively to squash into 1 atomic, conventional commit with an informative description."
            }
          ],
          pitfalls: [
            "Force-pushing (`git push --force`) to a shared branch instead of using `--force-with-lease`.",
            "Committing secrets (`.env`, private keys) and thinking deleting them in the next commit makes them safe (they stay forever in Git history unless rewritten with `filter-repo`).",
            "Writing vague commit messages ('fixed bug', 'update code') instead of explaining 'why' the change happened."
          ],
          checkpoint: [
            "I understand the difference between Working Directory, Staging, and Local Repository.",
            "I know when to merge and when to rebase, and how interactive rebase keeps PRs clean.",
            "I know how to use `git reflog` to recover commits after an accidental reset.",
            "I can confidently resolve merge conflicts and test the merged code before pushing."
          ]
        }
      ]
    },
    {
      id: "phase-2",
      name: "Phase 2: PKI, Asymmetric Cryptography & SSH Keys",
      duration: "Week 3",
      description: "Public Key Infrastructure (PKI), asymmetric cryptography, Ed25519 keypairs, SSH client configuration, agent forwarding, and bastion tunneling.",
      modules: [
        {
          id: "pki-ssh",
          title: "PKI & SSH Key Mastery",
          category: "Missing Core",
          badge: "Crucial",
          icon: "🔑",
          summary: "Asymmetric crypto, Ed25519 vs RSA, SSH key generation, permissions (600/700), ssh-agent, ~/.ssh/config, tunnels, and Certificate Authorities.",
          whyItMatters: "Every git push over SSH, cloud server login, database bastion tunnel, and TLS handshake relies on asymmetric cryptography and PKI. Mishandling private keys, ignoring permissions, or misconfiguring SSH hosts causes security leaks and severe developer downtime.",
          mentalModel: "Asymmetric cryptography separates the lock from the key. The Public Key (`.pub`) is an open padlock you distribute to the world (GitHub, server `authorized_keys`). The Private Key is your secret physical key that never leaves your machine. Public Key Infrastructure (PKI) introduces trusted Certificate Authorities (CAs) to digitally vouch for public keys at internet scale.",
          keyConcepts: [
            {
              name: "Symmetric vs Asymmetric Cryptography",
              desc: "Symmetric (AES): single shared secret for encryption & decryption. Asymmetric (RSA/ECC): mathematically linked public & private key pair used for identity verification and key exchange."
            },
            {
              name: "Modern Algorithms: Ed25519 vs RSA",
              desc: "Ed25519 (Elliptic Curve25519) is the modern gold standard: faster, smaller (256-bit key offers security equivalent to 3072-bit RSA), and immune to many side-channel attacks."
            },
            {
              name: "Strict Unix Permissions Model",
              desc: "OpenSSH strictly enforces file permissions: `~/.ssh/` directory must be `700` (`drwx------`), private keys must be `600` (`-rw-------`), and public keys `644`. OpenSSH refuses to use open keys."
            },
            {
              name: "SSH Agent & Passphrase Security",
              desc: "Always protect private keys with a strong passphrase. `ssh-agent` stores decrypted keys in memory for your session so you don't re-type the passphrase on every git or ssh command."
            },
            {
              name: "Host Configuration (~/.ssh/config)",
              desc: "Defining aliases (`Host dev-db`), custom ports, dedicated identity files per client/repo, ProxyJump through bastion jump-hosts, and ServerAliveInterval."
            },
            {
              name: "PKI, X.509 Certificates & CAs",
              desc: "How Certificate Authorities (CAs) sign Certificate Signing Requests (CSR). The Chain of Trust from Root CA to Intermediate CA to Leaf Certificate (used in TLS/HTTPS)."
            }
          ],
          commands: [
            {
              cmd: "ssh-keygen -t ed25519 -C \"mentee@company.com\" -f ~/.ssh/id_ed25519",
              desc: "Generate a modern, high-security Ed25519 keypair with an identifying comment"
            },
            {
              cmd: "chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_ed25519 && chmod 644 ~/.ssh/id_ed25519.pub",
              desc: "Set strict Unix permissions required by OpenSSH for directories, private keys, and public keys"
            },
            {
              cmd: "eval \"$(ssh-agent -s)\" && ssh-add ~/.ssh/id_ed25519",
              desc: "Start the background SSH agent and load your private key into memory"
            },
            {
              cmd: "ssh-add -l",
              desc: "List fingerprints of all SSH keys currently loaded into ssh-agent"
            },
            {
              cmd: "cat << 'EOF' > ~/.ssh/config\nHost github.com\n  User git\n  IdentityFile ~/.ssh/id_ed25519\n  IdentitiesOnly yes\nEOF",
              desc: "Configure ~/.ssh/config with a clean host alias and explicit identity key"
            },
            {
              cmd: "ssh -T git@github.com",
              desc: "Test authentication against GitHub using your SSH keypair"
            },
            {
              cmd: "ssh -N -L 5433:localhost:5432 user@remote-host",
              desc: "Create an encrypted SSH local port forwarding tunnel (connect to remote Postgres on local port 5433)"
            },
            {
              cmd: "openssl req -x509 -newkey rsa:2048 -keyout local.key -out local.crt -days 365 -nodes -subj \"/CN=localhost\"",
              desc: "Generate a self-signed X.509 SSL certificate and private key (PKI foundation)"
            }
          ],
          labs: [
            {
              title: "Lab 3.1: Complete SSH Keypair Generation & GitHub Setup",
              goal: "Generate an Ed25519 keypair with a passphrase, configure `~/.ssh/config`, add the public key to GitHub, and verify connection with `ssh -T git@github.com`.",
              steps: [
                "Run `ssh-keygen -t ed25519 -C \"mentee@company.com\"` and protect the private key with a passphrase.",
                "Enforce strict permissions: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_ed25519`.",
                "Launch the background SSH agent and load the key into memory (`eval \"$(ssh-agent -s)\" && ssh-add ~/.ssh/id_ed25519`).",
                "Copy `~/.ssh/id_ed25519.pub` to your GitHub account under Settings > SSH Keys.",
                "Verify connection with `ssh -T git@github.com` and inspect the successful authentication message."
              ]
            },
            {
              title: "Lab 3.2: Local SSH Tunneling (Database Bastion Pattern)",
              goal: "Use `ssh -L` to forward a local port to a remote service, proving that an isolated internal service can be accessed securely through an encrypted SSH tunnel without exposing ports publicly.",
              steps: [
                "Start a mock backend service listening on port 9000 (`python3 -u -m http.server 9000 &`).",
                "Create an SSH local port forwarding tunnel: `ssh -N -L 9001:localhost:9000 user@remote-host`.",
                "Send requests to `http://localhost:9001` and verify they reach the service on port 9000.",
                "Inspect the active tunnel socket with `lsof -i :9001`."
              ]
            },
            {
              title: "Lab 3.3: Self-Signed PKI Certificate & TLS Server",
              goal: "Generate a self-signed X.509 certificate using `openssl`, inspect the certificate details with `openssl x509 -text -noout`, and run a minimal HTTPS server."
            }
          ],
          pitfalls: [
            "Committing the private key (`id_ed25519`) to Git instead of only sharing the public key (`id_ed25519.pub`).",
            "Leaving private key permissions as `644` or `777`, causing OpenSSH to output `UNPROTECTED PRIVATE KEY FILE!` and refuse to connect.",
            "Creating keys without a passphrase, leaving your identity completely compromised if your laptop is lost or compromised.",
            "Blindly deleting `known_hosts` entries without verifying whether a host key changed legitimately or a Man-in-the-Middle attack occurred."
          ],
          checkpoint: [
            "I can explain the difference between a private key and a public key with a real-world analogy.",
            "I know why Ed25519 is preferred over RSA and how to generate it with `ssh-keygen`.",
            "I know exact file permissions for `~/.ssh` (700) and private keys (600) and why they are enforced.",
            "I can configure `~/.ssh/config` for multiple hosts and aliases.",
            "I know how to set up an SSH port forwarding tunnel (`ssh -L`).",
            "I understand the role of a Certificate Authority (CA) in Public Key Infrastructure (PKI)."
          ]
        }
      ]
    },
    {
      id: "phase-3",
      name: "Phase 3: Networking & Web Architecture",
      duration: "Weeks 4 - 5",
      description: "How computers communicate across the internet: TCP/IP, DNS, HTTP/1-2-3, TLS handshake, browser rendering, and web authentication.",
      modules: [
        {
          id: "network",
          title: "Computer Networking for Web Developers",
          category: "Requested Core",
          badge: "Fundamental",
          icon: "🌐",
          summary: "TCP/IP vs UDP, DNS resolution, HTTP/1.1 vs HTTP/2 vs HTTP/3, TLS/SSL handshake, REST, WebSockets, gRPC, and CORS.",
          whyItMatters: "Every API call, database query, cache lookup, and asset download travels over a network. Without networking foundations, latency issues, security flaws (CORS/TLS), and architectural disconnects are impossible to diagnose.",
          mentalModel: "Networking is layered abstraction (OSI / TCP/IP model). Your application builds an HTTP request, the OS wraps it in TCP segments for reliable delivery, IP routes packets between router hops, and TLS negotiates encryption before any plaintext byte is exchanged.",
          keyConcepts: [
            {
              name: "The Networking Stack (TCP/IP)",
              desc: "IP (addressing & routing), TCP (reliable, ordered, 3-way handshake SYN/SYN-ACK/ACK, flow control), UDP (fast, connectionless, streaming/HTTP3)."
            },
            {
              name: "DNS (Domain Name System)",
              desc: "Recursive resolver, root/TLD servers, authoritative nameservers, record types (A, AAAA, CNAME, TXT, MX), and DNS TTL/caching."
            },
            {
              name: "HTTP Anatomy & Evolution",
              desc: "Request/Response anatomy (Method, Path, Headers, Body, Status codes: 2xx, 3xx, 4xx, 5xx). HTTP/1.1 (keep-alive, head-of-line blocking), HTTP/2 (multiplexing streams over single TCP), HTTP/3 (QUIC over UDP)."
            },
            {
              name: "TLS / HTTPS Handshake",
              desc: "Symmetric vs Asymmetric encryption, Certificate Authorities (CA), Public Key Infrastructure (PKI), TLS 1.3 handshake (1-RTT)."
            },
            {
              name: "CORS & Browser Security",
              desc: "Same-Origin Policy (SOP). Cross-Origin Resource Sharing (CORS): preflight `OPTIONS` request, Access-Control-Allow-Origin, credentials header."
            },
            {
              name: "Protocols: REST vs WebSockets vs gRPC",
              desc: "REST (stateless, request-response), WebSockets (full-duplex persistent connection for realtime chats/tickers), gRPC (Protobuf, binary, high-performance microservices)."
            }
          ],
          commands: [
            { cmd: "dig +trace api.github.com", desc: "Trace DNS resolution path from root servers to authoritative server" },
            { cmd: "curl -v --trace-time https://httpbin.org/get", desc: "Inspect TLS handshake, headers, and timings" },
            { cmd: "curl -X OPTIONS -H 'Origin: http://localhost:3000' -H 'Access-Control-Request-Method: POST' -i https://api.example.com", desc: "Test CORS preflight request directly" },
            { cmd: "openssl s_client -connect github.com:443", desc: "Verify SSL certificate chain and expiration dates" }
          ],
          labs: [
            {
              title: "Lab 4.1: Build an HTTP Server from Raw TCP Sockets",
              goal: "Write a minimal TCP server in Node.js or Python using raw sockets (not Express/Flask) that accepts a connection, parses the raw HTTP request string, and replies with a valid HTTP/1.1 response string.",
              task: "Demonstrate that HTTP is just formatted text sent over a TCP stream. Include status line, Content-Type, Content-Length, and double CRLF `\\r\\n\\r\\n`."
            },
            {
              title: "Lab 4.2: Demystifying CORS with Two Local Servers",
              goal: "Set up Server A (Frontend on :3000) and Server B (Backend on :5000). Trigger a CORS error in the browser console, inspect the Preflight OPTIONS request in DevTools, and fix it properly with HTTP headers."
            }
          ],
          pitfalls: [
            "Confusing 401 Unauthorized (unauthenticated - 'who are you?') with 403 Forbidden (authenticated but not permitted - 'you cannot do this').",
            "Setting `Access-Control-Allow-Origin: *` in production when credentials (cookies/auth headers) are required.",
            "Failing to understand HTTP Keep-Alive, resulting in costly repeated TCP + TLS handshakes for every micro-request."
          ],
          checkpoint: [
            "I can explain what happens step-by-step from typing a URL in the browser to page render.",
            "I can explain what causes a CORS error and how to fix it securely without wildcard hacks.",
            "I know the difference between TCP and UDP, and why HTTP/3 switched to UDP (QUIC).",
            "I can use `curl -v` and browser Network DevTools to inspect headers, cookies, and timings."
          ]
        },
        {
          id: "web-architecture",
          title: "Web Architecture, Browsers & Auth",
          category: "Missing Core",
          badge: "Crucial",
          icon: "🏗️",
          summary: "Browser Critical Rendering Path, Client vs Server Rendering (SSR/SSG/SPA), Session cookies vs JWTs, and OAuth2.",
          whyItMatters: "Full stack engineers must understand both sides of the wire: how browsers parse HTML/CSS/JS and render pixels, and how user identity is securely verified across requests.",
          mentalModel: "The browser builds the DOM tree from HTML tokens, the CSSOM from styles, combines them into a Render Tree, calculates Layout (geometry), and Paints pixels. On the auth side, HTTP is stateless, so identity must be passed on every request via cryptographically signed tokens or session IDs.",
          keyConcepts: [
            {
              name: "Critical Rendering Path",
              desc: "DOM + CSSOM -> Render Tree -> Layout -> Paint -> Composite. Reflow vs Repaint, render-blocking scripts (`defer` vs `async`)."
            },
            {
              name: "Rendering Architectures",
              desc: "SPA (Single Page App - CSR), SSR (Server-Side Rendering), SSG (Static Site Generation), and Hybrid/Edge rendering tradeoffs (SEO, TTFB, TTI)."
            },
            {
              name: "Stateful Sessions vs Stateless JWTs",
              desc: "Session Cookies: stored in Redis/DB, invalidated server-side easily, vulnerable to CSRF. JWT: stateless, self-contained signed payload, difficult to revoke before expiration unless using blocklists/short expiry."
            },
            {
              name: "Cookie Security Flags",
              desc: "`HttpOnly` (inaccessible to JavaScript, mitigates XSS cookie theft), `Secure` (HTTPS only), `SameSite=Strict/Lax/None` (CSRF defense)."
            },
            {
              name: "OAuth 2.0 & OpenID Connect (OIDC)",
              desc: "Authorization Code flow with PKCE, Access Tokens, Refresh Tokens, Identity Tokens, and third-party login (Google, GitHub)."
            }
          ],
          commands: [
            { cmd: "openssl rand -base64 32", desc: "Generate a cryptographically secure JWT secret key" },
            { cmd: "curl -i -c cookie.txt -b cookie.txt http://localhost:4000/auth", desc: "Manage session cookies in terminal with curl" }
          ],
          labs: [
            {
              title: "Lab 5.1: Build Secure Auth with HttpOnly Refresh Tokens",
              goal: "Implement authentication with short-lived JWT access tokens in memory and long-lived refresh tokens in an HttpOnly, SameSite cookie, with token rotation.",
              task: "Ensure that if an access token is compromised, its lifetime is capped to 15 minutes, while refresh tokens allow seamless UX without exposing secrets to `localStorage`."
            }
          ],
          pitfalls: [
            "Storing JWT access tokens in `localStorage` or `sessionStorage` where any XSS attack can silently steal them.",
            "Not understanding `SameSite` cookie attributes, leaving APIs open to Cross-Site Request Forgery (CSRF).",
            "Blocking the browser main thread with heavy synchronous JavaScript during initial page load."
          ],
          checkpoint: [
            "I understand the trade-offs between CSR, SSR, and SSG.",
            "I can explain why `HttpOnly` and `SameSite` cookie flags are essential for security.",
            "I know the pros and cons of JWTs versus Redis-backed sessions.",
            "I can trace the OAuth 2.0 Authorization Code flow with PKCE."
          ]
        }
      ]
    },
    {
      id: "phase-4",
      name: "Phase 4: Data, Storage & Application Security",
      duration: "Weeks 6 - 7",
      description: "Designing reliable relational schemas, query performance optimization, and defending applications against OWASP Top 10 vulnerabilities.",
      modules: [
        {
          id: "databases",
          title: "Databases, Data Modeling & Storage",
          category: "Missing Core",
          badge: "Crucial",
          icon: "💾",
          summary: "Relational modeling (Postgres), Normalization vs Denormalization, Indexes (B-Tree), Transactions & ACID, N+1 query problem, and migrations.",
          whyItMatters: "Code is temporary; data is permanent. 90% of backend performance bottlenecks and data corruption bugs stem from poorly designed database schemas, missing indexes, or naive ORM queries.",
          mentalModel: "A relational database is an optimized storage engine built on B-Tree indexes and Write-Ahead Logs (WAL). Without an index, the database must execute a sequential scan (O(N)) through every disk page to find a row.",
          keyConcepts: [
            {
              name: "Relational Modeling & Normalization",
              desc: "1NF, 2NF, 3NF. Foreign keys, primary keys (UUID vs auto-increment bigint), one-to-one, one-to-many, many-to-many junction tables."
            },
            {
              name: "ACID Properties & Isolation Levels",
              desc: "Atomicity, Consistency, Isolation (Read Committed, Repeatable Read, Serializable), Durability. Transactions (`BEGIN ... COMMIT / ROLLBACK`)."
            },
            {
              name: "Indexing & Query Plans",
              desc: "B-Tree, composite indexes (column order matters!), partial indexes, running `EXPLAIN ANALYZE` to spot Sequential Scans vs Index Scans."
            },
            {
              name: "The N+1 Query Problem",
              desc: "Occurs when an ORM queries a parent list (1 query) and then runs an additional query for each item's children (N queries). Solved with SQL JOINs or eager loading (`includes`/`select_related`)."
            },
            {
              name: "Database Migrations",
              desc: "Schema versioning, forward and rollback scripts, zero-downtime migrations (expand and contract pattern)."
            }
          ],
          commands: [
            { cmd: "EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';", desc: "Inspect actual query execution time and index usage in PostgreSQL" },
            { cmd: "SELECT pid, query, state, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != 'idle';", desc: "Find long-running locking queries in Postgres" }
          ],
          labs: [
            {
              title: "Lab 6.1: The 1-Million Row Indexing Experiment",
              goal: "Populate a table with 1,000,000 mock user rows, run a query without an index and benchmark execution time with `EXPLAIN ANALYZE`, add a B-Tree index, and observe the 100x performance leap.",
              task: "Create `users (id serial, email text, created_at timestamp)`. Insert 1M rows. Query `WHERE email = '...'`. Compare Sequential Scan (50ms+) vs Index Scan (<0.5ms)."
            },
            {
              title: "Lab 6.2: Detect and Eliminate N+1 Queries",
              goal: "Write an API endpoint with an ORM that exhibits the N+1 problem, inspect database logs to see 101 queries executed, and optimize it into 1-2 queries with eager loading."
            }
          ],
          pitfalls: [
            "Over-indexing tables (each index slows down `INSERT`, `UPDATE`, and `DELETE` operations and wastes memory).",
            "Trusting ORMs blindly without checking the underlying SQL queries generated.",
            "Altering large tables with locking operations in production without running non-blocking migrations (`ADD COLUMN ... DEFAULT NULL`, `CREATE INDEX CONCURRENTLY`)."
          ],
          checkpoint: [
            "I can design a normalized 3NF relational schema with proper primary/foreign keys.",
            "I can read `EXPLAIN ANALYZE` output to check if a query is using an index scan.",
            "I know how the N+1 query problem occurs and how to fix it in code.",
            "I understand ACID guarantees and when database transactions are required."
          ]
        },
        {
          id: "security",
          title: "Application Security & OWASP Top 10",
          category: "Missing Core",
          badge: "Crucial",
          icon: "🛡️",
          summary: "SQL Injection, Cross-Site Scripting (XSS), CSRF, Server-Side Request Forgery (SSRF), Rate Limiting, and Secrets Management.",
          whyItMatters: "A feature is broken if it is insecure. Modern full-stack engineers are the first line of defense; security can no longer be an afterthought passed to an external audit team.",
          mentalModel: "Never trust user input. All input across HTTP parameters, headers, bodies, and query strings is untrusted data until validated, sanitized, and passed via parameterized queries.",
          keyConcepts: [
            {
              name: "SQL Injection (SQLi)",
              desc: "Concatenating user strings into SQL queries allows attackers to execute arbitrary SQL commands. Defended by parameterized queries and prepared statements."
            },
            {
              name: "Cross-Site Scripting (XSS)",
              desc: "Stored, Reflected, and DOM-based XSS. Attackers inject malicious JavaScript to steal cookies or session tokens. Defended by Content Security Policy (CSP) and HTML escaping."
            },
            {
              name: "Cross-Site Request Forgery (CSRF)",
              desc: "Tricking an authenticated user's browser into submitting unauthorized requests. Defended by `SameSite` cookies and Anti-CSRF tokens."
            },
            {
              name: "SSRF (Server-Side Request Forgery)",
              desc: "When a server is tricked into fetching an attacker-supplied URL, exposing internal services like AWS metadata `169.254.169.254`."
            },
            {
              name: "Rate Limiting & Brute Force Defense",
              desc: "Token bucket & sliding window algorithms, Redis-backed rate limiters for login and public API endpoints."
            }
          ],
          commands: [
            { cmd: "npm audit --production", desc: "Scan project dependencies for known security vulnerabilities" },
            { cmd: "trufflehog git file://. --since-commit HEAD~10", desc: "Scan git history for accidentally committed API keys and credentials" }
          ],
          labs: [
            {
              title: "Lab 7.1: Exploit & Patch a Vulnerable Login (SQLi)",
              goal: "Run a vulnerable script that concatenates input into `SELECT * FROM users WHERE user = '...' AND pass = '...'`, bypass login using `' OR '1'='1`, then rewrite it using parameterized prepared statements.",
              task: "Observe how parameterized queries treat input strictly as literals rather than executable SQL syntax."
            }
          ],
          pitfalls: [
            "Hardcoding API keys or secrets in source code or client-side bundles.",
            "Relying solely on client-side form validation without repeating validation on the server.",
            "Using unsalted MD5 or SHA256 for password hashing instead of bcrypt, Argon2, or PBKDF2."
          ],
          checkpoint: [
            "I know why string concatenation in SQL queries leads to SQL injection.",
            "I can explain XSS and how Content-Security-Policy (CSP) mitigates it.",
            "I understand the difference between authentication and authorization (RBAC/ABAC).",
            "I know how to hash passwords safely with Argon2 or bcrypt."
          ]
        }
      ]
    },
    {
      id: "phase-5",
      name: "Phase 5: Containers, CI/CD & Delivery Pipelines",
      duration: "Weeks 8 - 10",
      description: "Packaging applications reliably with Docker, automating tests and deployments with CI/CD, and building high-confidence test suites.",
      modules: [
        {
          id: "docker",
          title: "Docker & Containerization",
          category: "Requested Core",
          badge: "Fundamental",
          icon: "🐳",
          summary: "Linux cgroups & namespaces, Dockerfile best practices, multi-stage builds, volumes, bridge networks, and Docker Compose.",
          whyItMatters: "'It works on my machine' is solved by containers. Containers package your application with its exact OS runtime, dependencies, and configuration, ensuring identical execution from local dev to cloud production.",
          mentalModel: "A container is NOT a lightweight virtual machine. There is no hypervisor or guest OS kernel. A container is a standard Linux process isolated by the host kernel using Namespaces (what it can see) and cgroups (what resources it can use). Images are immutable stacks of read-only layers.",
          keyConcepts: [
            {
              name: "Container vs Virtual Machine",
              desc: "VMs run a full guest OS on top of a hypervisor. Containers share the host OS kernel, making them start in milliseconds with minimal memory overhead."
            },
            {
              name: "Layer Caching & Multi-Stage Builds",
              desc: "Docker caches layers based on instruction order. Multi-stage builds separate the build environment (compilers, heavy tools) from the production image (tiny runtime distroless/alpine image)."
            },
            {
              name: "Volumes & Persistent Storage",
              desc: "Containers are ephemeral: data inside disappears on exit. Named volumes and bind mounts (`-v $(pwd):/app`) persist data outside the container lifecycle."
            },
            {
              name: "Docker Networking",
              desc: "Default bridge network, custom user-defined bridge networks (providing automatic DNS service discovery between containers), host networking, and port publishing (`-p host:container`)."
            },
            {
              name: "Docker Compose",
              desc: "Orchestrating multi-container local environments (e.g., App + Postgres + Redis) with single commands: `docker compose up -d`."
            }
          ],
          commands: [
            { cmd: "docker build -t my-app:latest .", desc: "Build an image from Dockerfile in current directory" },
            { cmd: "docker run -d -p 8080:80 --name web nginx:alpine", desc: "Run a detached Nginx container mapping port 8080 to 80" },
            { cmd: "docker exec -it <container_id> sh", desc: "Open an interactive shell inside a running container" },
            { cmd: "docker compose logs -f app", desc: "Follow live logs from the 'app' service in compose" },
            { cmd: "docker system prune -a --volumes", desc: "Clean up unused images, containers, and volumes to free disk space" }
          ],
          labs: [
            {
              title: "Lab 8.1: Multi-Stage Production Dockerfile",
              goal: "Write an optimized multi-stage Dockerfile for a Node.js or Go application that leverages Docker layer caching for `package.json` / `go.mod` and produces a slim final image under 100MB.",
              task: "Compare image size and build times before and after reordering `COPY` instructions and implementing multi-stage build."
            },
            {
              title: "Lab 8.2: Full-Stack Dev Environment with Docker Compose",
              goal: "Create a `docker-compose.yml` linking a web application, a PostgreSQL database with a persistent volume, and a Redis cache on an internal network with healthchecks.",
              task: "Demonstrate that the web app resolves Postgres by service name `db` via internal DNS, and database state persists across `docker compose down` and `docker compose up`."
            }
          ],
          pitfalls: [
            "Running containers as the `root` user in production images (major container breakout security risk).",
            "Copying the whole project before `npm install` or `pip install`, which busts Docker's layer cache on every minor code edit.",
            "Storing state/database files directly in the container filesystem instead of a mounted volume."
          ],
          checkpoint: [
            "I know the technical difference between a process container and a virtual machine.",
            "I can write a multi-stage Dockerfile to minimize production image size.",
            "I understand how Docker layer caching works and how to structure instructions.",
            "I can assemble a multi-container stack with Docker Compose and named volumes."
          ]
        },
        {
          id: "cicd",
          title: "CI/CD & Automated Delivery",
          category: "Requested Core",
          badge: "Fundamental",
          icon: "🚀",
          summary: "GitHub Actions workflows, automated linting & unit tests, build artifacts, container registry publishing, secrets management, and blue-green deployments.",
          whyItMatters: "High-performing engineering teams ship small, verified changes multiple times a day. CI/CD transforms code integration from a stressful manual chore into an automated, predictable, and tested pipeline.",
          mentalModel: "Continuous Integration (CI) guarantees that code on the main branch is always tested, formatted, and buildable. Continuous Delivery/Deployment (CD) packages that tested code and pushes it automatically to staging or production environments.",
          keyConcepts: [
            {
              name: "CI/CD Core Concepts",
              desc: "Triggers (push, pull_request, schedule), Jobs (run on runners in parallel or sequential DAG), Steps (individual actions or run scripts), and Artifacts."
            },
            {
              name: "The CI Quality Gates",
              desc: "1. Code formatting & lint (Prettier, ESLint, Ruff). 2. Type checking (tsc, mypy). 3. Unit & Integration test execution. 4. Security vulnerability scan."
            },
            {
              name: "GitHub Actions Workflow Syntax",
              desc: "YAML syntax, `on: [push, pull_request]`, matrix builds for multiple OS/language versions, caching dependencies (`actions/cache`)."
            },
            {
              name: "Secrets Management & OIDC",
              desc: "Storing API keys in repository secrets, passing secrets securely as env vars, using OpenID Connect (OIDC) to authenticate with AWS/GCP without long-lived static keys."
            },
            {
              name: "Deployment Strategies",
              desc: "Rolling deployments, Blue-Green deployments (zero downtime switch), Canary releases (routing 5% traffic first), and Rollback mechanisms."
            }
          ],
          commands: [
            { cmd: "act pull_request", desc: "Run GitHub Actions workflows locally using Docker via 'act' CLI tool" },
            { cmd: "gh run list && gh run view --log", desc: "Inspect GitHub Actions pipeline runs and failure logs from the terminal" }
          ],
          labs: [
            {
              title: "Lab 9.1: Complete GitHub Actions CI Pipeline",
              goal: "Create a `.github/workflows/ci.yml` that runs on every pull request to `main`. It must checkout code, cache dependencies, run linter, typecheck, run automated tests with coverage report, and block PR merge if any step fails.",
              task: "Open a PR with an intentional test failure, observe the check fail and prevent merging, then push a fix to watch the CI green check unlock the PR."
            },
            {
              title: "Lab 9.2: Automated Docker Build & Push on Release Tag",
              goal: "Configure a CD workflow that automatically builds a multi-platform Docker container and publishes it to GitHub Packages (ghcr.io) whenever a git tag like `v1.0.0` is pushed."
            }
          ],
          pitfalls: [
            "Letting CI build times explode to 20+ minutes because caching (`node_modules`, pip, gradle) is missing.",
            "Putting sensitive deployment tokens in repository code instead of masked encrypted environment secrets.",
            "Not having an automated, tested rollback procedure when a deployment fails in production."
          ],
          checkpoint: [
            "I can write a GitHub Actions workflow from scratch in YAML.",
            "I understand the difference between Continuous Integration and Continuous Deployment.",
            "I know how to use dependency caching to speed up CI runs.",
            "I know how to configure branch protection rules to require passing CI before merging."
          ]
        },
        {
          id: "testing",
          title: "Testing & Code Quality",
          category: "Missing Core",
          badge: "Crucial",
          icon: "🧪",
          summary: "The Testing Pyramid (Unit, Integration, E2E), Test-Driven Mindset, Mocking vs Stubbing, and Regression Prevention.",
          whyItMatters: "Code without tests is legacy code the moment it is written. Tests provide the safety harness that allows developers to refactor with confidence, ship quickly, and prevent regression bugs.",
          mentalModel: "The Test Pyramid: Thousands of fast, isolated Unit Tests at the base; hundreds of Integration Tests in the middle verifying component interactions (e.g., API to real DB); dozens of End-to-End (E2E) browser tests at the apex verifying critical user journeys.",
          keyConcepts: [
            {
              name: "The Test Pyramid Breakdown",
              desc: "Unit Tests: function-level logic, runs in milliseconds. Integration Tests: tests API routes with test DB/services. E2E Tests (Playwright/Cypress): simulates full browser user clicks."
            },
            {
              name: "Test Doubles: Mocks, Stubs & Spies",
              desc: "Dummy (placeholder), Stub (pre-programmed response), Mock (verifies expected calls/parameters), Spy (records calls), and Fake (lightweight working implementation like in-memory DB)."
            },
            {
              name: "Test-Driven Development (TDD) Rhythm",
              desc: "Red (write failing test) -> Green (write minimal code to pass) -> Refactor (clean up code while tests remain green)."
            },
            {
              name: "Testing with Ephemeral Databases",
              desc: "Using Docker / Testcontainers to spin up fresh, isolated PostgreSQL or Redis instances for integration test suites rather than relying on mocks."
            }
          ],
          commands: [
            { cmd: "npm test -- --coverage --watch", desc: "Run test suite with code coverage and file watch mode" },
            { cmd: "npx playwright test --ui", desc: "Launch Playwright E2E interactive testing UI" }
          ],
          labs: [
            {
              title: "Lab 10.1: Write Integration Tests with Real Database",
              goal: "Write integration tests for a REST endpoint using Supertest/Pytest and a test database. Verify creation, idempotency, foreign key constraint handling, and clean database rollback after each test.",
              task: "Ensure each test is isolated so tests can run in parallel without race conditions."
            }
          ],
          pitfalls: [
            "Testing implementation details (internal private methods) instead of testing observable behavior (inputs and outputs).",
            "Mocking everything so aggressively that the tests pass while the real system fails in production.",
            "Writing flaky tests that depend on sleep timers or network availability."
          ],
          checkpoint: [
            "I can categorize tests into Unit, Integration, and E2E.",
            "I know when to use a real database in tests versus when to use a mock/stub.",
            "I know how to write deterministic, non-flaky automated tests.",
            "I understand how code coverage tools work and their limitations."
          ]
        }
      ]
    },
    {
      id: "phase-6",
      name: "Phase 6: Scalability, Systems & Modern AI Engineering",
      duration: "Weeks 11 - 12",
      description: "Scaling web architectures, caching, message queues, and leveraging modern AI workflows for maximum engineering leverage.",
      modules: [
        {
          id: "system-design",
          title: "System Design, Caching & Scalability",
          category: "Missing Core",
          badge: "Crucial",
          icon: "📈",
          summary: "Horizontal vs Vertical scaling, Load Balancers, Redis caching strategies, Message Queues (RabbitMQ/Kafka), and Idempotency.",
          whyItMatters: "Writing code that works for 10 users is easy; building a system that serves 100,000 users with low latency and zero data loss requires distributed systems thinking.",
          mentalModel: "Stateless applications scale horizontally behind load balancers. State is pushed to distributed databases and caches. Expensive or long-running work is decoupled asynchronously using background message queues.",
          keyConcepts: [
            {
              name: "Statelessness & Horizontal Scaling",
              desc: "Vertical scaling (bigger machine - limits exist). Horizontal scaling (more small machines). Applications must not store user session state in local memory."
            },
            {
              name: "Load Balancing & Algorithms",
              desc: "Round Robin, Least Connections, IP Hash. Layer 4 (TCP) vs Layer 7 (HTTP) routing, SSL termination, and health check probes."
            },
            {
              name: "Caching Strategies with Redis",
              desc: "Cache-Aside, Write-Through, Write-Back. Cache Invalidation ('the hardest problem'), TTLs, Cache Stampede / Thundering Herd mitigation."
            },
            {
              name: "Asynchronous Workflows & Message Queues",
              desc: "Decoupling slow tasks (sending emails, video encoding, webhook retries) using message brokers (RabbitMQ, Redis Streams, SQS, Kafka)."
            },
            {
              name: "Idempotency in Distributed Systems",
              desc: "Ensuring an operation produces the same result if executed multiple times (e.g., payment charges). Handled via unique Idempotency Keys."
            }
          ],
          commands: [
            { cmd: "redis-cli monitor", desc: "Stream all commands executed by the Redis server in real time" },
            { cmd: "redis-cli info memory", desc: "Inspect Redis memory consumption, fragmentation ratio, and key count" }
          ],
          labs: [
            {
              title: "Lab 11.1: Cache-Aside Pattern with Redis",
              goal: "Build an API endpoint that queries Redis first. On cache miss, fetch data from PostgreSQL, store the result in Redis with an expiration TTL, and serve subsequent requests in under 2ms.",
              task: "Implement cache eviction when the underlying database row is updated to maintain data consistency."
            },
            {
              title: "Lab 11.2: Background Job Processing with Queues",
              goal: "Set up a producer that pushes tasks onto a queue, and a worker process that consumes tasks with retries and dead-letter queue (DLQ) for failed jobs."
            }
          ],
          pitfalls: [
            "Using caching as a band-aid for broken, unindexed database queries.",
            "Not setting TTLs (Time-To-Live) on cache keys, leading to memory exhaustion.",
            "Doing long-running blocking tasks (e.g., PDF generation, external API calls) inside the synchronous HTTP request/response cycle."
          ],
          checkpoint: [
            "I know the difference between vertical and horizontal scaling.",
            "I can implement the Cache-Aside pattern with Redis including TTL and invalidation.",
            "I understand why background message queues are needed for asynchronous tasks.",
            "I know what idempotency is and how to design idempotent API endpoints."
          ]
        },
        {
          id: "ai-tools",
          title: "AI Tools & Workflows for Modern Engineers",
          category: "Requested Core",
          badge: "Modern Edge",
          icon: "🤖",
          summary: "Copilot, Cursor, OpenCode, Claude Code, prompt engineering for code, context management, test generation, and AI-assisted debugging.",
          whyItMatters: "AI is not replacing software engineers; engineers who effectively leverage AI tools are replacing those who don't. Mastering prompt precision, context boundaries, and verification habits boosts engineering productivity 3x-5x.",
          mentalModel: "Treat AI tools as an exceptionally knowledgeable, ultra-fast junior pair programmer with zero attention to security unless guided. You are the architect, reviewer, and decision maker. The quality of AI output directly correlates with the quality of the context and constraints provided.",
          keyConcepts: [
            {
              name: "The Modern AI Tool Landscape",
              desc: "Autocomplete & inline suggestions (GitHub Copilot), AI-native IDEs (Cursor), CLI & autonomous coding agents (OpenCode, Claude Code), and LLM API integrations."
            },
            {
              name: "Context Engineering & Prompt Architecture",
              desc: "Providing precise context: file references, schema definitions, error stack traces, and constraints ('Do not use external libraries', 'Must handle edge case X')."
            },
            {
              name: "AI-Assisted Testing & Refactoring",
              desc: "Prompting LLMs to generate boundary test cases, edge cases (empty arrays, overflow, nulls), and refactoring legacy code into clean architecture patterns."
            },
            {
              name: "Hallucination Defense & Verification",
              desc: "Never run AI-generated code blindly. Verifying non-existent library methods, insecure configurations, and subtle logic bugs. Always run tests and compilers."
            },
            {
              name: "Building with LLMs: APIs, Function Calling & Prompts",
              desc: "Structured outputs (JSON schema), tool/function calling, system prompts vs user prompts, token limits, and embedding/vector retrieval (RAG) basics."
            }
          ],
          commands: [
            { cmd: "opencode --help", desc: "Explore OpenCode CLI coding agent features and workflows" },
            { cmd: "gh copilot explain 'find . -name \"*.log\" -mtime +7 -delete'", desc: "Use CLI AI assistant to explain complex shell commands" }
          ],
          labs: [
            {
              title: "Lab 12.1: AI-Driven Test Generation & Edge-Case Discovery",
              goal: "Take a non-trivial algorithmic or business function (e.g., pricing discount calculator), use an AI coding tool with a structured prompt to generate a full unit test suite covering boundary conditions, and verify code coverage.",
              task: "Prompt structure: provide the function code, specify test framework, demand tests for nulls, negative numbers, boundary overflows, and floating point precision."
            },
            {
              title: "Lab 12.2: Debugging with Stack Traces & Context Curation",
              goal: "Take a real cryptic error stack trace and failed test output, craft a structured prompt with the relevant function, caller, and runtime environment, and evaluate how context quality changes the accuracy of the proposed fix."
            }
          ],
          pitfalls: [
            "Accepting AI suggestions without reading and understanding every line of code.",
            "Pasting proprietary company secrets, credentials, or sensitive customer PII into public AI chat interfaces.",
            "Asking AI vague questions ('why is my code broken?') without providing stack traces, expected vs actual output, and environment context."
          ],
          checkpoint: [
            "I know how to craft structured prompts with clear constraints for coding tasks.",
            "I use AI to accelerate writing unit tests, documentation, and boilerplate code.",
            "I rigorously verify AI code for security vulnerabilities, edge cases, and hallucinations.",
            "I understand the basics of LLM APIs, structured JSON outputs, and tool calling."
          ]
        }
      ]
    }
  ],

  // 12-Week Mentorship Learning Plan
  learningPlan: [
    {
      week: "Week 1",
      phase: "Phase 1",
      title: "Linux CLI, Processes & Real-Time Log Streaming",
      focus: "Background jobs (`&`), process IDs, stdout/stderr redirection to log files, real-time log following (`tail -f | grep`), and graceful termination (`kill -15`).",
      deliverable: "Run a background HTTP server, inspect with `lsof` and `ps`, stream filtered logs as requests hit, and cleanly terminate.",
      mentor1on1: "Walk through Unix stream redirection (`> 2>&1`), process signals, and troubleshooting port collisions."
    },
    {
      week: "Week 2",
      phase: "Phase 1",
      title: "Git DAG Internals, Interactive Rebase & Conflict Resolution",
      focus: "Git object graph, interactive rebase (`git rebase -i`), resolving merge conflicts, and commit recovery with `git reflog`.",
      deliverable: "Simulate a messy multi-branch conflict, resolve it cleanly, and squash 5 messy commits into 1 atomic conventional PR.",
      mentor1on1: "Live PR review and code rebasing simulation together."
    },
    {
      week: "Week 3",
      phase: "Phase 2",
      title: "PKI, Asymmetric Cryptography & SSH Key Practice",
      focus: "Asymmetric cryptography, Ed25519 key generation, strict permissions (600/700), `ssh-agent`, `~/.ssh/config`, GitHub SSH auth, and SSH bastion tunnels.",
      deliverable: "Generate an Ed25519 keypair, configure `~/.ssh/config` with host aliases, authenticate to GitHub, and set up a local port tunnel (`ssh -L`).",
      mentor1on1: "Security audit of mentee's SSH keys, permissions, agent setup, and review of PKI Certificate Authorities."
    },
    {
      week: "Week 4",
      phase: "Phase 3",
      title: "Computer Networking, DNS, TCP & HTTP Deep Dive",
      focus: "TCP 3-way handshake, DNS record resolution, HTTP/1.1 vs HTTP/2/3, TLS handshake, headers, and cURL.",
      deliverable: "Build an HTTP/1.1 server from raw TCP sockets in Node or Python and inspect with `curl -v`.",
      mentor1on1: "Q&A on what happens under the hood when typing 'https://google.com' in a browser."
    },
    {
      week: "Week 5",
      phase: "Phase 3",
      title: "Web Architecture, Browsers & Authentication",
      focus: "Critical rendering path (DOM/CSSOM), SSR vs CSR vs SSG, Stateful Sessions vs JWTs, and secure cookie flags.",
      deliverable: "Build a full authentication flow with HttpOnly cookies, refresh token rotation, and protected routes.",
      mentor1on1: "Security audit of the authentication flow: analyzing vulnerabilities and storage options."
    },
    {
      week: "Week 6",
      phase: "Phase 4",
      title: "Relational Databases, Normalization & Query Optimization",
      focus: "Postgres schema design, foreign keys, B-Tree indexes, `EXPLAIN ANALYZE`, and the N+1 query problem.",
      deliverable: "Design a normalized database schema, seed with 500k records, diagnose slow queries, and add targeted indexes.",
      mentor1on1: "Live debugging session: reading `EXPLAIN ANALYZE` query plans together."
    },
    {
      week: "Week 7",
      phase: "Phase 4",
      title: "Web Security & OWASP Top 10 Hands-on",
      focus: "SQL Injection, Cross-Site Scripting (XSS), CSRF, CORS policies, rate limiting, and secrets management.",
      deliverable: "Exploit a deliberately vulnerable web app (SQLi and XSS) and implement proper defenses.",
      mentor1on1: "Review OWASP Top 10 checklist against an existing web service."
    },
    {
      week: "Week 8",
      phase: "Phase 5",
      title: "Docker Essentials & Multi-Stage Builds",
      focus: "Container mental model (namespaces/cgroups), layer caching, multi-stage builds, and non-root users.",
      deliverable: "Write an optimized multi-stage Dockerfile for an app, reducing image size by 70%+.",
      mentor1on1: "Deep dive into Docker image layers and container debugging techniques (`docker exec`, `docker inspect`)."
    },
    {
      week: "Week 9",
      phase: "Phase 5",
      title: "Multi-Container Systems with Docker Compose & Networking",
      focus: "Docker Compose, bridge networks, named volumes, service discovery, and health checks.",
      deliverable: "Configure a complete local environment with Web App, PostgreSQL, and Redis in `docker-compose.yml`.",
      mentor1on1: "Verify persistent storage across container restarts and inspect internal DNS resolution."
    },
    {
      week: "Week 10",
      phase: "Phase 5",
      title: "CI/CD Pipelines with GitHub Actions & Automated Testing",
      focus: "GitHub Actions workflow syntax, lint/typecheck/test quality gates, artifact caching, and secrets.",
      deliverable: "Set up a complete CI pipeline that tests code on every PR and blocks merging on failures.",
      mentor1on1: "Simulate a broken pipeline and review deployment pipeline safety patterns."
    },
    {
      week: "Week 11",
      phase: "Phase 6",
      title: "System Design, Caching with Redis & Asynchronous Queues",
      focus: "Horizontal scaling, load balancing, Cache-Aside pattern, cache invalidation, and background queues.",
      deliverable: "Implement Redis caching on an API and offload a heavy task (e.g. email sending) to a background worker queue.",
      mentor1on1: "Architectural whiteboard session: designing a scalable link shortener or feed service."
    },
    {
      week: "Week 12",
      phase: "Phase 6",
      title: "Modern AI Engineering Workflows & Capstone Project",
      focus: "Cursor/OpenCode/Copilot best practices, prompt engineering for code, AI test generation, hallucination defense, and final capstone.",
      deliverable: "Deploy a full-stack containerized app to production with CI/CD, Redis caching, Postgres, auth, and automated test suite.",
      mentor1on1: "Final capstone architecture review and transition into independent software engineering."
    }
  ]
};
