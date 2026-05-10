import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='border-b border-border bg-background sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-lg'>I</span>
          </div>
          <span className='font-semibold text-lg'>The Scholar</span>
        </div>

        <div className='flex items-center gap-3'>
          <Link href="/auth/login">
            <Button variant='outline' size='sm'>
              Sign in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size='sm'>Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
