# DreamScapes
Dream Journal and Interpretation App

DreamScapes is a React Native mobile application designed to help users document, analyze, and interpret their dreams. Built with Expo, Firebase Firestore, and a local LLM integration through Ollama, the app provides an intuitive journaling experience with AI-powered interpretations, mood tagging, dream type categorization, and personalized history tracking.

Features: Dream Logging, AI-Powered Dream Interpretation, Dream History, Clean & Modern UI, and User Accounts
Tech Stack
Frontend: React Native, TypeScript, Expo Router, and NativeWind/TailwindCSS
Backend & Storage: Firebase Firestore, Local LLM integration via Ollama, Service-based architecture (dbAuth.ts, dbDreams.ts, ollama.ts, etc.)
AI / NLP: Ollama local server, Prompt templating, and Interpretation pipeline with fallback behavior

Installation & Setup:
1. Clone the repository
2. Install dependencies
3. Configure Firebase
4. Install and run Ollama
5. Start the app (npx expo start)

This project is for academic use under CIS 454 at Syracuse University.
