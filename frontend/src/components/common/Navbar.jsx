import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  UploadCloud,
  FileDiff,
  FileText,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Dashboard', path: '/dashboard', icon: Layers },
    { label: 'Upload', path: '/upload', icon: UploadCloud },
    { label: 'Review & Diff', path: '/review', icon: FileDiff },
    { label: 'Reports', path: '/reports', icon: FileText },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Clean Brand Identity without icon logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center group no-underline">
            <span className="font-display text-2xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
              Pivot
            </span>
            <span className="text-amber-400 font-mono text-2xl font-bold leading-none">
              _
            </span>
          </Link>

          {/* Engine indicator pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              MySQL 8.0
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              PostgreSQL 16
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all no-underline flex items-center gap-1.5 ${
                  active
                    ? 'text-white bg-slate-800/80 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {item.icon && <item.icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all no-underline"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign In</span>
          </Link>

          <Button
            variant="amber"
            size="sm"
            onClick={() => navigate('/upload')}
          >
            New Migration
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="amber"
            size="sm"
            onClick={() => navigate('/upload')}
          >
            Migrate
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-[#070b14] px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium no-underline ${
                  active
                    ? 'text-white bg-slate-800 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white no-underline"
            >
              Sign In to Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
