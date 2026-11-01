import { Outlet } from 'react-router-dom';
import ShellSidebar from '@/components/shell/ShellSidebar';
import ShellTopbar from '@/components/shell/ShellTopbar';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ShellSidebar />
      <div className="lg:pl-[252px]">
        <ShellTopbar />
        <main className="mx-auto w-full max-w-6xl px-5 pb-28 pt-1 sm:px-8 lg:pb-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}