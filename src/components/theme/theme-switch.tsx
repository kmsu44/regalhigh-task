"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // SSR CSR mismatch 오류를 피하기 위해 mounted 상태를 추가합니다.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button onClick={toggleTheme} size="icon" variant="outline">
      {theme === "light" ? (
        <Moon className="h-[24px] w-[24px]" />
      ) : (
        <Sun className="h-[24px] w-[24px]" />
      )}
    </Button>
  );
}
