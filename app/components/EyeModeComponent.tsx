import { Eye, EyeOff } from "lucide-react";

interface props {
  theme: boolean;
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function EyeModeComponent(prop: props) {
  return (
    <>
      <button
        onClick={() => prop.setIsShow(!prop.isShow)}
        className="p-2 my-2 rounded-full transition-all duration-300 bg-gray-300 dark:bg-gray-700 hover:scale-110 hover:cursor-pointer"
      >
        {prop.isShow ? (
          <Eye
            className={`w-6 h-6 ${
              prop.theme ? "text-yellow-500" : "text-gray-900"
            }`}
          />
        ) : (
          <EyeOff
            className={`w-6 h-6 ${
              prop.theme ? "text-yellow-500" : "text-gray-900"
            }`}
          />
        )}
      </button>
    </>
  );
}

export default EyeModeComponent;
