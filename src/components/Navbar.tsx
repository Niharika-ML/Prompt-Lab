import React, { useState, useRef, useEffect } from 'react';
import { PageView, Language, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../data/translations';
import {
  Sparkles,
  Flame,
  Trophy,
  Globe,
  Menu,
  X,
  BookOpen,
  Target,
  LayoutDashboard,
  Terminal,
  Check,
  Bookmark,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Info,
  Sun,
  Moon,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  totalXP: number;
  streak: number;
  beginnerMode: boolean;
  onToggleBeginnerMode: (val: boolean) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  levelTitle: string;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  totalXP,
  streak,
  beginnerMode,
  onToggleBeginnerMode,
  language,
  onSelectLanguage,
  levelTitle,
  darkMode = true,
  onToggleDarkMode,
}) => {
  const { user, isGuest, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (streakRef.current && !streakRef.current.contains(e.target as Node)) {
        setStreakModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = getTranslation(language);

  const navLinks: Array<{ id: PageView; label: string; icon: any }> = [
    { id: 'landing', label: t.home, icon: LayoutDashboard },
    { id: 'practice', label: t.practice, icon: Terminal },
    { id: 'learn', label: t.learn, icon: BookOpen },
    { id: 'challenges', label: t.challenges, icon: Target },
    { id: 'about', label: t.about, icon: Info },
    { id: 'my-prompts', label: t.myPrompts, icon: Bookmark },
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const languages: Array<{ code: Language; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  // Weekly streak days (Requirement 26)
  const weekDays = [
    { day: 'Mon', done: true },
    { day: 'Tue', done: true },
    { day: 'Wed', done: true },
    { day: 'Thu', done: true },
    { day: 'Fri', done: true },
    { day: 'Sat', done: true },
    { day: 'Sun', done: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-white tracking-tight leading-none group-hover:text-blue-300 transition-colors">
              PromptLab
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mt-0.5">
              AI Playground
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {navLinks.map(({ id, label, icon: Icon }) => {
            const active = currentPage === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Daily Streak Pill & Popover (Requirement 26) */}
          <div ref={streakRef} className="relative">
            <button
              onClick={() => setStreakModalOpen(!streakModalOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
              title={`${streak} day practice streak! Click for weekly progress`}
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{streak}d</span>
            </button>

            {streakModalOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-4 shadow-2xl z-50 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">Daily Streak</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                    {streak} Day Streak
                  </span>
                </div>

                <div className="text-[11px] text-slate-300">
                  Practice daily to maintain your momentum and unlock streak achievements!
                </div>

                {/* Weekly tracker: Mon ✓ Tue ✓ Wed ✓ Thu ✓ Fri ✓ Sat ✓ Sun ○ */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Weekly Activity
                  </span>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {weekDays.map((w, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                          w.done
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="text-[9px] uppercase">{w.day}</span>
                        <span>{w.done ? '✓' : '○'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Best Streak: <strong>14 days</strong></span>
                  <button
                    onClick={() => {
                      setStreakModalOpen(false);
                      handleNavClick('practice');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-bold"
                  >
                    Practice Today →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* XP & Level Pill (if authenticated) */}
          {!isGuest && (
            <div
              onClick={() => handleNavClick('progress')}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              title={`Total XP: ${totalXP} | Level: ${levelTitle}`}
            >
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-none">{totalXP} XP</span>
                <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[80px]">
                  {levelTitle}
                </span>
              </div>
            </div>
          )}

          {/* Language Selector (Requirement 33) */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase">{language}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onSelectLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>{l.native}</span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (Requirement 34) */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          )}

          {/* Auth State Control */}
          {isGuest ? (
            <div className="flex items-center gap-2 ml-1">
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
              >
                {t.login}
              </button>

              <button
                onClick={() => handleNavClick('signup')}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 transition-all cursor-pointer"
              >
                {t.signUp}
              </button>

              <button
                onClick={() => handleNavClick('practice')}
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.startPracticing}</span>
              </button>
            </div>
          ) : (
            /* Profile Dropdown for Logged-In User */
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-6 h-6 rounded-lg object-cover border border-blue-500/40"
                />
                <span className="text-xs font-semibold text-slate-200 hidden md:inline truncate max-w-[90px]">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-50 space-y-0.5">
                  <div className="p-2.5 border-b border-slate-800 mb-1">
                    <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
                  </div>

                  <button
                    onClick={() => {
                      handleNavClick('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.profile}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('my-prompts');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.myPrompts}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('progress');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-purple-400" />
                    <span>Progress & Badges</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.settings}</span>
                  </button>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        try {
                          localStorage.removeItem('promptlab_welcome_done');
                        } catch (e) {}
                        setProfileDropdownOpen(false);
                        handleNavClick('landing');
                      }}
                      className="w-full px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.logOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{streak}d</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ id, label, icon: Icon }) => {
              const active = currentPage === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                    active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            {!isGuest ? (
              <>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-900 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>{t.profile} ({user.name})</span>
                </button>

                <button
                  onClick={() => handleNavClick('my-prompts')}
                  className="px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-900 flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-indigo-400" />
                  <span>{t.myPrompts}</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNavClick('landing');
                  }}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-900 text-rose-400 text-xs font-semibold"
                >
                  {t.logOut}
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold"
                >
                  {t.signUp}
                </button>
                <button
                  onClick={() => handleNavClick('practice')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
                >
                  {t.startPracticing}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Language:</span>
              <div className="flex gap-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onSelectLanguage(l.code)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      language === l.code ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
