import React from 'react';
import { Home, CheckSquare, ShoppingBag, User } from 'lucide-react';
import { Tab } from './types';

interface NavBarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, setTab }) => {
  const getIconClass = (tab: Tab) => 
    `flex items-center justify-center w-full h-full transition-all duration-300 ${
      currentTab === tab 
        ? 'text-brand-primary scale-110' 
        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
    }`;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-brand-border dark:border-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)] pt-2">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        <button onClick={() => setTab(Tab.HOME)} className={getIconClass(Tab.HOME)} aria-label="Akış">
          <Home size={28} strokeWidth={currentTab === Tab.HOME ? 2.5 : 2} />
        </button>
        <button onClick={() => setTab(Tab.TASKS)} className={getIconClass(Tab.TASKS)} aria-label="Görevler">
          <CheckSquare size={28} strokeWidth={currentTab === Tab.TASKS ? 2.5 : 2} />
        </button>
        <button onClick={() => setTab(Tab.STORE)} className={getIconClass(Tab.STORE)} aria-label="Mağaza">
          <ShoppingBag size={28} strokeWidth={currentTab === Tab.STORE ? 2.5 : 2} />
        </button>
        <button onClick={() => setTab(Tab.PROFILE)} className={getIconClass(Tab.PROFILE)} aria-label="Profil">
          <User size={28} strokeWidth={currentTab === Tab.PROFILE ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;