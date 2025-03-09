"use client";

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

  useEffect(() => {
    fetch("./data/vocabulary.txt")
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
          selectRandomWord(lines);
        }
      });
  }, []);

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

      setInput(""); // Xóa input ngay lập tức khi nhập

      if (userInput === vocab.word.toLowerCase()) {
        setIsIncorrect(false);
        setVocabList((prev) => {
          const updatedList = prev.map((item) =>
            item.word === vocab.word
              ? { ...item, correctCount: item.correctCount + 1 }
              : item
          );
          selectRandomWord(updatedList);
          return updatedList;
        });
      } else {
        setIsIncorrect(true);
        setVocabList((prev) => {
          return prev.map((item) =>
            item.word === vocab.word ? { ...item, correctCount: 0 } : item
          );
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {vocab ? (
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-6 text-center">
          {vocab.meaning} ({vocab.pronunciation})
        </h1>
      ) : (
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-6 text-center">
          Loading...
        </h1>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type the English word..."
        onKeyDown={handleKeyDown}
        className={`w-full max-w-lg p-4 text-xl sm:text-2xl border-2 rounded-lg shadow-md focus:outline-none focus:ring-2 ${
          isIncorrect
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
    </div>
  );
}
