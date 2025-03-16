'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { Home, LayoutDashboard, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './ModeToggle';
import Image from 'next/image';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="px-4 w-full md:px-8 py-3 shadow-2xl bg-background border border-border">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Name */}
        <Link href="/" className="text-2xl md:text-3xl text-primary font-bold flex items-center gap-2">
          <Image src="/image.png" alt="Logo" width={40} height={40} className="rounded-md" />
          Stealthify
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button onClick={toggleMenu} variant="ghost">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Desktop and Mobile Links */}
        <div
          className={`flex-col md:flex md:flex-row items-center gap-4 md:gap-5 ${
            menuOpen ? 'flex' : 'hidden md:flex'
          } mt-4 md:mt-0 text-center`}
        >
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">Welcome, {user.username || user.email}</span>
              
              {pathname !== '/dashboard' ? (
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full md:w-auto bg-primary text-primary-foreground">
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full md:w-auto bg-primary text-primary-foreground">
                    <Home className="h-6 w-6" />
                  </Button>
                </Link>
              )}

              <Button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="w-full md:w-auto bg-primary text-primary-foreground"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
