# ♟️ ChessMind

**ChessMind** is a high-performance, full-stack chess application. It features a custom-built Java 21 chess engine equipped with an Alpha-Beta pruning AI, seamlessly integrated with a premium, beautifully crafted React frontend.

![ChessMind Landing](https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

- **Custom Java Chess Engine:** Strict enforcement of standard chess rules, including En Passant, Castling, Checkmate detection, and Threefold Repetition Stalemate.
- **Alpha-Beta Pruning AI:** Challenge the built-in computer opponent. The AI's search depth is fully configurable (Depth 1 to 5) in real-time via the UI slider.
- **State History Architecture:** Made a mistake? Seamlessly undo your last move. When playing against the AI, undoing steps back exactly two moves so it's instantly your turn again.
- **Premium User Interface:** A dark-mode, chess.com-inspired React interface utilizing glassmorphism and modern styling paradigms.
- **Board Themes:** Customize your experience by toggling between Classic Green, Wooden Board, Ocean Blue, and Dark Slate themes.
- **Immersive Audio:** Authentic sound effects triggered for standard moves, captures, checks, and game resolutions.
- **PGN Export:** Easily download your matches in standard Portable Game Notation (PGN) format for analysis in other engines.
- **Local Multi-Player:** Play against the AI or challenge a friend in 2-Player mode.

---

## 🛠️ Tech Stack

- **Backend:** Java 21, Spring Boot, Maven, Google Guava.
- **Frontend:** React 18, Vite, Axios, Vanilla CSS.
- **Deployment:** Multi-stage Docker build.

---

## 🚀 Running Locally

### Option 1: Using Docker (Recommended)
The easiest way to run ChessMind is via the unified Docker build. This containerizes both the Spring Boot API and the compiled React static assets into a single lightweight runtime.

1. **Build the image:**
   ```bash
   docker build -t chessmind-app .
   ```
2. **Run the container:**
   ```bash
   docker run -p 8080:8080 chessmind-app
   ```
3. Open your browser and navigate to `http://localhost:8080`.

### Option 2: Development Mode (Hot-Reloading)
If you want to modify the code and see changes in real-time, run the frontend and backend separately.

**Start the Backend (Java):**
1. Navigate to the engine directory:
   ```bash
   cd chessengine
   ```
2. Run the Spring Boot application:
   ```bash
   mvnw spring-boot:run
   ```
   *The backend API will start on `http://localhost:8080`.*

**Start the Frontend (React):**
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd chess-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:5173` with an automatic proxy to the backend.*

---

## 🧠 Engine Architecture

The core chess engine relies on immutable `Board` state representations. Every move mathematically derives a brand new `Board` using the Builder pattern, ensuring zero unintended state mutations during the AI's millions of predictive evaluations.

The AI utilizes the **Minimax algorithm with Alpha-Beta Pruning** to drastically reduce the number of branches in the search tree. Moves are proactively sorted using a custom `MoveSorter` (prioritizing captures and castling) to trigger pruning cutoffs significantly earlier.

## 🤝 Contributing

Contributions to improve the AI's evaluation heuristics or introduce new frontend features (like drag-and-drop piece movement) are always welcome. Feel free to fork the repository and open a Pull Request!
