"use client";

import { Moon, Sun, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [vocabList, setVocabList] = useState<
    {
      word: string;
      pronunciation: string;
      meaning: string;
      correctCount: number;
    }[]
  >([]);
  console.log(vocabList);
  const [vocab, setVocab] = useState<{
    word: string;
    pronunciation: string;
    meaning: string;
  } | null>(null);
  const [input, setInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");

    const storedVocabList = localStorage.getItem("vocabList");
    if (storedVocabList) {
      const parsedList = JSON.parse(storedVocabList);
      setVocabList(parsedList);
      selectRandomWord(parsedList);
    } else {
      fetch("/data/vocabulary.txt")
        .then((response) => response.text())
        .then((text) => {
          const lines = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => {
              const match = line.match(/^(.*?) \((.*?)\): (.*)$/);
              return match
                ? {
                    word: match[1].trim(),
                    pronunciation: match[2].trim(),
                    meaning: match[3].trim(),
                    correctCount: 0,
                  }
                : null;
            })
            .filter(Boolean) as {
            word: string;
            pronunciation: string;
            meaning: string;
            correctCount: number;
          }[];

          if (lines.length > 0) {
            setVocabList(lines);
            localStorage.setItem("vocabList", JSON.stringify(lines));
            selectRandomWord(lines);
          }
        });
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const selectRandomWord = (list: typeof vocabList) => {
    let availableWords = list.filter((item) => item.correctCount < 2);

    if (availableWords.length === 0) {
      list.forEach((item) => (item.correctCount = 0));
      availableWords = [...list];
    }

    const randomWord =
      availableWords[Math.floor(Math.random() * availableWords.length)] || null;
    setVocab(randomWord);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && vocab) {
      event.preventDefault();
      const userInput = input.toLowerCase().trim();
      setInput("");

      if (userInput === vocab.word.toLowerCase()) {
        setIsIncorrect(false);
        setVocabList((prev) => {
          const updatedList = prev.map((item) =>
            item.word === vocab.word
              ? { ...item, correctCount: item.correctCount + 1 }
              : item
          );
          localStorage.setItem("vocabList", JSON.stringify(updatedList));
          selectRandomWord(updatedList);
          return updatedList;
        });
      } else {
        setIsIncorrect(true);
        setVocabList((prev) => {
          const updatedList = prev.map((item) =>
            item.word === vocab.word ? { ...item, correctCount: 0 } : item
          );
          localStorage.setItem("vocabList", JSON.stringify(updatedList));
          return updatedList;
        });
      }
    }
  };

  const playAudio = () => {
    if (vocab) {
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 bg-gray-300 dark:bg-gray-700 hover:scale-110"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-900" />
        )}
      </button>
      {vocab ? (
        <div className="flex items-center gap-3 pb-6">
          <h1 className="text-3xl sm:text-5xl font-bold text-center">
            {vocab.meaning} ({vocab.pronunciation})
          </h1>
          <button
            onClick={playAudio}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-center">
          Loading...
        </h1>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type the English word..."
        onKeyDown={handleKeyDown}
        className={`w-full max-w-lg p-4 text-xl sm:text-2xl border-2 rounded-lg shadow-md focus:outline-none focus:ring-2 transition-all duration-300 ${
          isIncorrect
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-300"
        }`}
      />
    </div>
  );
}
