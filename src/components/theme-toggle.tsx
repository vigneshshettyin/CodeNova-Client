import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-state";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative w-[50px] h-[26px] rounded-full bg-white dark:bg-black border border-gray-400 dark:border-gray-600 flex items-center transition-all"
    >
      {/* Sun - Visible in Light Mode */}
      <Sun className="absolute left-1 h-[1rem] w-[1rem] text-yellow-500 transition-all duration-300 dark:opacity-0 dark:translate-x-5" />

      {/* Moon - Visible in Dark Mode */}
      <Moon className="absolute right-1 h-[1rem] w-[1rem] text-white opacity-0 translate-x-5 transition-all duration-300 dark:opacity-100 dark:translate-x-0" />
    </Button>
  );
}
