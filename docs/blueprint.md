# **App Name**: Neon Chat AI

## Core Features:

- Chat UI: Full-screen chat UI with current user messages right-aligned (neon green), other users left-aligned (neon pink), and AI bot messages center-aligned (neon blue).
- Authentication: Google Sign-in/Logout buttons with neon glow effect.
- Message Input: Message input box with glowing border and Send button.
- Theme Toggle: Theme toggle button (Dark/Light) with localStorage persistence. Dark theme: black background, strong neon glow. Light theme: white background, pastel neon glow.
- Message Animations: Smooth animations for new messages.
- AI Message Generation: AI Bot: Upon detecting '/ai' at the beginning of any message, use a tool powered by Firebase AI to generate a response. Save the AI response in Firestore as a new message with uid = 'ai-bot'.

## Style Guidelines:

- Primary color: Neon Green (#39FF14) for the current user's messages.
- Background color: Black (#000000) for the dark theme, White (#FFFFFF) for the light theme. Consider shades of gray instead for white in the light theme. Use a very dark gray (20, 20, 20) instead of black, for the dark theme, in order to ease eyestrain
- Accent color: Neon Pink (#EE0) for other users' messages, and Neon Blue (#00FFFF) for AI Bot messages. When light theme is active, the primary, accent, and other colors will have desaturated, pastel versions.
- Font: 'Inter', a grotesque-style sans-serif font for a clean and modern look for both headlines and body.
- Simple, glowing icons for the send button and theme toggle.
- Full-screen layout with a header, message list, and input box at the bottom. Messages are contained within chat bubbles that render on the appropriate side of the chat window.
- Fade-in animation for new messages to create a smooth user experience.