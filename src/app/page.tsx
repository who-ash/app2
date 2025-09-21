'use client';
import React from 'react';
import { authClient, useSession } from '@/server/auth/client';

export default function Home() {
    const { data } = useSession();
    const handleAuthRedirection = async () => {
        await authClient.signIn.oauth2({
            providerId: 'authx',
            scopes: ['openid', 'profile', 'email'],
        });
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.href = '/';
    }
    return (
        <>
            <button
                onClick={handleAuthRedirection}
                className="bg-white p-2 text-black"
            >
                Login app2
            </button>
            <button
                onClick={handleSignOut}
                className="bg-red-500 text-white p-2 ml-4"
            >
                Sign Out
            </button>
            <h1>Welcome to App 2, {data?.user?.name}</h1>
        </>
    );
}
