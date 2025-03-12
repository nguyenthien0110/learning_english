# Learning English - Next.js App

## Overview

Learning English is a web application designed to help users improve their English vocabulary by testing their knowledge of words and their meanings. The app provides an interactive experience where users can input words, get feedback, and track their progress.

## Live Demo

[Learning English](https://nguyenthien0110.github.io/learning_english/)

## Features

- Dark mode toggle
- Interactive vocabulary testing
- Audio pronunciation using SpeechSynthesis API
- Local storage support for progress tracking
- Sidebar for selecting vocabulary files

## Technologies Used

- Next.js (React Framework)
- TypeScript
- Tailwind CSS
- Lucide-react icons
- SpeechSynthesis API

## Installation

To run the project locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/nguyenthien0110/learning_english.git

# Navigate to the project folder
cd learning_english

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Select a vocabulary file from the sidebar.
2. A random word's meaning and pronunciation will be displayed.
3. Type the correct word in the input field and press Enter.
4. If correct, a new word will be displayed; if incorrect, try again.
5. Click the speaker icon to hear the word pronunciation.
6. Toggle between light and dark mode using the button at the top right.

## Folder Structure

```
learning_english/
├── components/
│   ├── Sidebar.tsx
├── data/
│   ├── (Vocabulary files)
├── pages/
│   ├── index.tsx (Main application)
├── public/
├── styles/
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
```

## Deployment

This application is deployed using GitHub Pages. To redeploy:

```sh
git add .
git commit -m "Update project"
git push origin main
```

## Contributing

Feel free to submit issues and pull requests to improve the app!

## License

MIT License
