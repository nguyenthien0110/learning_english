"use client";

import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface props {
  darkMode: boolean;
}

export default function MenuIcon(props: props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sentences, setSentences] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("./data/example.txt")
      .then((response) => response.text())
      .then((text) => {
        setSentences(text.split("\n").filter((line) => line.trim().length > 0));
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
          props.darkMode
            ? "bg-gray-700 text-white"
            : "bg-gray-300 text-gray-900"
        } hover:scale-110`}
      >
        <Menu className="w-6 h-6" />
      </button>
      <div
        className={`absolute top-16 left-4 w-64 ${
          props.darkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
        } border rounded-lg shadow-lg p-4 transition-transform duration-300 ${
          isMenuOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <h2 className="text-lg font-bold mb-2">Saved Sentences</h2>
        <ul className="max-h-64 overflow-y-auto">
          {sentences.map((sentence, index) => (
            <li
              key={index}
              className={`p-2 border-b ${
                props.darkMode ? "border-gray-700" : "border-gray-300"
              }`}
            >
              {sentence}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
