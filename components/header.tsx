"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LayoutDashboard, LogOut, LogIn, Menu, MoonStar, Sparkles, SunMedium, ShieldCheck, UserPlus } from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut, useSession } from '@/lib/auth-client';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Policy', href: '/policy' },
];

function getInitials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.split('@')[0] || 'User').trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const user = session?.user;
  const isLoggedIn = Boolean(user);
  const isAdmin = ((user as { role?: string } | undefined)?.role ?? '').toUpperCase() === 'ADMIN';
  const initials = getInitials(user?.name, user?.email);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <header className='sticky top-0 z-50 border-b border-white/20 bg-background/70 backdrop-blur-2xl supports-backdrop-filter:bg-background/55'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between gap-4 py-4'>
          {/* <div className='pointer-events-none absolute inset-x-8 top-0 -z-10 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent' /> */}
          {/* <div className='pointer-events-none absolute inset-x-0 -z-10 h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.42),transparent_40%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30%)] opacity-70 dark:opacity-35' /> */}

          <Link href='/' className='group flex items-center gap-3'>
            <span className='flex size-11 items-center justify-center rounded-2xl border border-white/25 bg-white/60 shadow-[0_12px_35px_rgba(15,23,42,0.12)] backdrop-blur-md transition-transform duration-200 group-hover:-translate-y-0.5 dark:bg-white/10'>
              <Sparkles className='size-5 text-primary' />
            </span>
            <span className='flex flex-col leading-tight'>
              <span className='text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground'>
                The Scholar
              </span>
              <span className='text-base font-semibold text-foreground'>
                Seek knowledge with clarity
              </span>
            </span>
          </Link>

          <nav className='hidden items-center gap-2 rounded-full border border-white/25 bg-white/55 px-2 py-2 shadow-[0_18px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl lg:flex dark:bg-slate-950/35'>
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={active ? 'secondary' : 'ghost'}
                  size='sm'
                  className={cn(
                    'rounded-full px-4 text-sm transition-all duration-200',
                    active && 'shadow-sm'
                  )}
                >
                  <Link href={item.href} aria-current={active ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              aria-label='Toggle dark mode'
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className='flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/60 shadow-[0_12px_35px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-white/10 dark:hover:bg-white/15'
            >
              {mounted && resolvedTheme === 'dark' ? (
                <SunMedium className='size-4 text-foreground' />
              ) : (
                <MoonStar className='size-4 text-foreground' />
              )}
            </button>

            {isPending ? (
              <div className='h-10 w-28 rounded-full border border-white/20 bg-white/40 backdrop-blur-md dark:bg-white/5' />
            ) : isLoggedIn && user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className='group flex items-center gap-3 rounded-full border border-white/25 bg-white/60 px-2.5 py-1.5 text-left shadow-[0_16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-white/10 dark:hover:bg-white/15'>
                    <Avatar.Root className='relative flex size-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/60 dark:ring-white/10'>
                      <Avatar.Image
                        src={user.image ?? undefined}
                        alt={user.name ?? 'User avatar'}
                        className='size-full object-cover'
                      />
                      <Avatar.Fallback className='flex size-full items-center justify-center bg-linear-to-br from-primary via-primary/80 to-amber-400 text-xs font-semibold text-primary-foreground'>
                        {initials}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <span className='hidden min-w-0 flex-col leading-tight md:flex'>
                      <span className='truncate text-sm font-semibold text-foreground'>
                        {user.name ?? user.email}
                      </span>
                      <span className='truncate text-xs text-muted-foreground'>
                        {isAdmin ? 'Administrator' : 'Member'}
                      </span>
                    </span>

                    <ChevronDown className='size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180' />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align='end'
                    sideOffset={12}
                    className='z-50 min-w-72 overflow-hidden rounded-3xl border border-white/20 bg-background/95 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
                  >
                    <div className='mb-2 rounded-2xl border border-white/20 bg-linear-to-br from-primary/10 via-white/70 to-amber-400/10 p-4 dark:via-white/5'>
                      <div className='flex items-center gap-3'>
                        <Avatar.Root className='flex size-11 items-center justify-center overflow-hidden rounded-2xl ring-2 ring-white/60 dark:ring-white/10'>
                          <Avatar.Image
                            src={user.image ?? undefined}
                            alt={user.name ?? 'User avatar'}
                            className='size-full object-cover'
                          />
                          <Avatar.Fallback className='flex size-full items-center justify-center bg-linear-to-br from-primary via-primary/80 to-amber-400 text-sm font-semibold text-primary-foreground'>
                            {initials}
                          </Avatar.Fallback>
                        </Avatar.Root>

                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-semibold text-foreground'>
                            {user.name ?? 'User'}
                          </p>
                          <p className='truncate text-xs text-muted-foreground'>
                            {user.email}
                          </p>
                          <span className='mt-2 inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-foreground dark:bg-white/10'>
                            {isAdmin ? <ShieldCheck className='size-3.5 text-primary' /> : <Menu className='size-3.5 text-primary' />}
                            {isAdmin ? 'Admin access' : 'Student access'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isAdmin ? (
                      <DropdownMenu.Item asChild>
                        <Link
                          href='/admin/dashboard'
                          className='flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm outline-none transition-colors hover:bg-primary/8 focus:bg-primary/8'
                        >
                          <LayoutDashboard className='size-4 text-primary' />
                          <span className='flex-1'>Goto dashboard</span>
                        </Link>
                      </DropdownMenu.Item>
                    ) : null}

                    <DropdownMenu.Separator className='my-2 h-px bg-border' />

                    <DropdownMenu.Item
                      className='flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm outline-none transition-colors hover:bg-destructive/8 focus:bg-destructive/8'
                      onSelect={(event) => {
                        event.preventDefault();
                        void handleSignOut();
                      }}
                    >
                      <LogOut className='size-4 text-muted-foreground' />
                      <span className='flex-1'>Sign out</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <div className='flex items-center gap-2'>
                <Button asChild variant='ghost' size='sm' className='rounded-full px-4'>
                  <Link href='/auth/login'>
                    <LogIn className='size-4' />
                    Sign in
                  </Link>
                </Button>
                <Button asChild size='sm' className='rounded-full px-4 shadow-[0_16px_40px_rgba(15,23,42,0.14)]'>
                  <Link href='/auth/signup'>
                    <UserPlus className='size-4' />
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
