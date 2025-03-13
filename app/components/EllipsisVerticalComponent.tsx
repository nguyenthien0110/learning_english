import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EllipsisVertical } from "lucide-react";
import DarkModeComponent from "./DarkModeComponent";
import EyeModeComponent from "./EyeModeComponent";

interface props {
  theme: boolean;
  isShow: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function EllipsisVerticalComponent(prop: props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 p-2 rounded-full transition-all duration-300 dark:bg-gray-700 hover:cursor-pointer">
      <button onClick={() => setIsOpen(!isOpen)}>
        <EllipsisVertical
          className={`w-6 h-6 hover:cursor-pointer ${
            prop.theme
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-black"
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 flex flex-col gap-1 bg-transparent"
          >
            <DarkModeComponent
              theme={prop.theme}
              setDarkMode={prop.setDarkMode}
            />
            <EyeModeComponent
              theme={prop.theme}
              setIsShow={prop.setIsShow}
              isShow={prop.isShow}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EllipsisVerticalComponent;
