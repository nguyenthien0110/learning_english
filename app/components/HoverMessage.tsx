import { motion } from "framer-motion";
import { useState } from "react";

type HoverMessageProps = {
  text: string;
  hoverText?: string;
  theme: boolean;
};

const HoverMessage = ({ text, hoverText = "", theme }: HoverMessageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h1 className="text-3xl sm:text-5xl font-bold text-center">{text}</h1>
      {isHovered && hoverText && (
        <motion.div
          initial={{ opacity: 0, x: 10, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 10, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute w-[10ch] max-w-md break-words whitespace-normal text-ellipsis left-full top-[-40px] text-xl py-2 px-4 rounded shadow-lg ${
            theme ? "bg-gray-100 text-black" : "bg-gray-900 text-white"
          }`}
        >
          {hoverText}
        </motion.div>
      )}
    </div>
  );
};

export default HoverMessage;
