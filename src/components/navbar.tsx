'use client';

import { CircleHelpIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <header id='nd-nav' className='sticky top-0 z-40 h-14'>
      <div className='border-b bg-background/80 backdrop-blur-lg transition-colors'>
        <nav className='mx-auto flex h-14 w-full max-w-350 items-center justify-between px-6'>
          <div className='flex items-center gap-3'>
            <Avatar render={<Link href='https://nonick.net' />}>
              <AvatarImage src='https://github.com/nonick-mc.png' alt="nonick's icon" />
            </Avatar>
            <p className='font-black font-doto text-2xl select-none'>noniskin</p>
          </div>
          <Button
            render={<Link href={'https://youtu.be/txEosQ8LXHQ'} target='_blank' />}
            variant={'outline'}
            nativeButton={false}
          >
            <CircleHelpIcon className='mt-0.5' />
            マントの導入方法
          </Button>
        </nav>
      </div>
    </header>
  );
}
