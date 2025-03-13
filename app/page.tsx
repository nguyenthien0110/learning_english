"use client";

import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import HoverMessage from "./components/HoverMessage";
import EllipsisVerticalComponent from "./components/EllipsisVerticalComponent";

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
  const [selectedFile, setSelectedFile] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("selectedFile") : null
  );
  const [isShow, setIsShow] = useState(false);

  const fetchVocabList = (fileName: string) => {
    fetch(`./data/${fileName}`)
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
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");

    const storedVocabList = localStorage.getItem("vocabList");
    if (storedVocabList) {
      try {
        const parsedList = JSON.parse(storedVocabList);
        if (Array.isArray(parsedList) && parsedList.length > 0) {
          setVocabList(parsedList);
          selectRandomWord(parsedList);
          return;
        }
      } catch (error) {
        console.error("Error parsing vocabList from localStorage", error);
      }
    }

    if (selectedFile) {
      fetchVocabList(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newSelectedFile = localStorage.getItem("selectedFile");
      if (newSelectedFile !== selectedFile) {
        setSelectedFile(newSelectedFile);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedFile]);

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
      <Sidebar
        theme={darkMode}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <EllipsisVerticalComponent
        theme={darkMode}
        isShow={isShow}
        setDarkMode={setDarkMode}
        setIsShow={setIsShow}
      />
      {vocab ? (
        <div className="flex items-center gap-3 pb-6">
          {isShow ? (
            <>
              <h1 className="text-3xl sm:text-5xl font-bold text-center">
                {vocab.meaning}
                {`(${vocab.pronunciation || "No data"})`}
              </h1>
            </>
          ) : (
            <>
              <HoverMessage
                text={vocab.meaning}
                hoverText={vocab.pronunciation || "No data"}
                theme={darkMode}
              />
            </>
          )}
          <button
            onClick={playAudio}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 hover:cursor-pointer"
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
