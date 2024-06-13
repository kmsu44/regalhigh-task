import Link from "next/link";
import ThemeSwitch from "./theme/theme-switch";
export default function Header() {
  return (
    <header className="h-16 bg-bg1">
      <nav className="h-16 flex w-full items-center justify-between px-6">
        <Link href="/" className="text-textPrimary">
          헤더
        </Link>
        <ThemeSwitch />
      </nav>
    </header>
  );
}
