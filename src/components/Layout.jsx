import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

export default function Layout({ children, title }) {
  return (
    <div className="flex h-screen bg-[#F8F7F4]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[#E8E4DE] flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-[#1C1917]">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 pl-9 pr-4 bg-[#F8F7F4] border border-[#E8E4DE] rounded-lg text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              />
            </div>

            <button className="relative p-2 hover:bg-[#F8F7F4] rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-[#1C1917]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#F59E0B] rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
