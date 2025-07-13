import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PenBox } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import UserMenu from './user-menu';
import { checkUser } from '@/lib/checkUser';


const Header = async() => {
  await checkUser();
  return (
    <nav className="w-full py-2 px-4 flex items-center justify-between shadow-md border-b-4">
        <Link href={"/"} className="flex items-center">
            <Image src="/logo1.png" width="150" height="80" alt="MeetMate logo" className="h-16 w-auto"/>
        </Link>

        <div className="flex gap-4 items-center" >
            <Link href="/events?create=true">
                <Button className="flex items-center gap-2"><PenBox size={18}/> Create Event</Button>
            </Link>
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button className="flex items-center gap-2" variant='outline'> Login</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserMenu/>
            </SignedIn>
        </div>

    </nav>
  )
}

export default Header ;