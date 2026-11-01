import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Camera, LogOut } from "lucide-react";
import Brand from "@/components/common/Brand";
import ThemeToggle from "@/components/common/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/AuthContext";

export default function ShellTopbar() {
  const { user, logout } = useAuth();
  const [textScale, setTextScale] = useState(() => {
    useEffect(() => {
      document.documentElement.style.setProperty("--text-scale", textScale);
      localStorage.setItem("larpedin-text-scale", String(textScale));
    }, [textScale]);
    const saved = Number(localStorage.getItem("larpedin-text-scale"));
    return [0.9, 1, 1.1, 1.2].includes(saved) ? saved : 1;
  });
  const name = user?.full_name || user?.email || "Your account";
  const initials = name.trim().slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="lg:hidden">
          <Brand tone="light" />
        </Link>
        <p className="hidden text-[10px] uppercase tracking-[0.28em] text-muted-foreground lg:block">
          Portrait · calendar · content
        </p>

        <div className="flex items-center gap-1.5">
          <Link
            to="/studio"
            className="mr-1 hidden items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:flex"
          >
            <Camera className="h-3.5 w-3.5" strokeWidth={1.75} /> New portrait
          </Link>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-1 transition-colors hover:border-foreground/30 sm:pr-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold">
                  {initials}
                </span>
                <span className="hidden max-w-[130px] truncate text-[11px] font-medium sm:block">
                  {name}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <span className="block truncate text-[12px] font-medium">
                  {name}
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-normal text-muted-foreground">
                  {user?.email || ""}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[12px]"
                onSelect={() => logout()}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} /> Sign
                out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
