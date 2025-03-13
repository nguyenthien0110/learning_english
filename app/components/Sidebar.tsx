import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

interface MenuItem {
  name: string;
  children?: { title: string; name: string }[];
}

interface props {
  theme: boolean;
  selectedFile: string | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<string | null>>;
}

const DEFAULT_FILE = "vocabulary.txt"; // 🛠️ File mặc định

export default function Sidebar(props: props) {
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetch("./data/files.json")
      .then((res) => res.json())
      .then((data) => setMenu(data.menu))
      .catch((err) => console.error("Failed to load file list:", err));

    const currentFile = localStorage.getItem("selectedFile");
    if (currentFile) {
      props.setSelectedFile(currentFile);
    } else {
      localStorage.setItem("selectedFile", DEFAULT_FILE);
      props.setSelectedFile(DEFAULT_FILE);
    }
  }, []);

  const handleSelectFile = (fileName: string) => {
    props.setSelectedFile(fileName);
    localStorage.setItem("selectedFile", fileName);
    localStorage.removeItem("vocabList");
    setIsOpen(false);
  };

  return (
    <div className="fixed left-0 top-0 h-full z-50 p-2">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 m-2 rounded-full shadow-md transition-all duration-300 z-50 relative hover:scale-110 hover:cursor-pointer ${
          props.theme ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
        }`}
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-80 shadow-2xl rounded-r-2xl transition-transform duration-300 z-50 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          props.theme ? "bg-gray-900 text-white" : "bg-white text-black"
        } p-5`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-600 text-white hover:bg-gray-500 transition-all"
        >
          <ChevronLeft size={24} />
        </button>

        <nav className="mt-10">
          {menu.map((item) => (
            <div key={item.name} className="mb-3">
              <div
                className={`flex justify-between items-center text-lg font-semibold cursor-pointer ${
                  props.theme ? "text-gray-200" : "text-gray-500"
                }`}
                onClick={() =>
                  setExpanded({
                    ...expanded,
                    [item.name]: !expanded[item.name],
                  })
                }
              >
                {item.name}
                <ChevronRight
                  size={18}
                  className={`transition-transform ${
                    expanded[item.name]
                      ? "rotate-90 text-blue-500"
                      : "text-gray-500"
                  }`}
                />
              </div>

              {expanded[item.name] && item.children && (
                <ul className="ml-4 mt-2 space-y-2">
                  {item.children.map(({ title, name }) => (
                    <li
                      key={name}
                      onClick={() => handleSelectFile(name)}
                      className={`p-2 rounded-lg cursor-pointer transition-all ${
                        props.selectedFile === name
                          ? "bg-blue-500 text-white"
                          : "hover:bg-blue-100 text-gray-400"
                      }`}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
