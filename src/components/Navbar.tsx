"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/quiz", label: "Quiz" },
  { href: "/colleges", label: "Colleges" },
  { href: "/careers", label: "Careers" },
  { href: "/timeline", label: "Timeline" },
  { href: "/study", label: "Study" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => setMobileOpen((prev) => !prev);
  const handleClose = () => setMobileOpen(false);

  const handleSignOut = async () => {
    handleClose();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2" onClick={handleClose}>
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EduGuide</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  type="button"
                  title="Sign out"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={handleToggle}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Toggle navigation"
              title="Toggle navigation"
              type="button"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={handleClose}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={handleClose}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={handleClose}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
                  type="button"
                  title="Sign out"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={handleClose}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
