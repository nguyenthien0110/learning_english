import { Moon, Sun } from "lucide-react";

interface props {
  theme: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function DarkModeComponent(prop: props) {
  return (
    <>
      <button
        onClick={() => prop.setDarkMode(!prop.theme)}
        className="p-2 my-2 rounded-full transition-all duration-300 bg-gray-300 dark:bg-gray-700 hover:scale-110 hover:cursor-pointer"
      >
        {prop.theme ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-900" />
        )}
      </button>
    </>
  );
}

export default DarkModeComponent;
