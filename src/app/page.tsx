"use client";
import { authClient, useSession } from '@/server/auth/client';

export default function Home() {
    const { data, error} = useSession();
  const handleAuthRedirection = async () => {
    const { data, error } = await authClient.signIn.oauth2({
      providerId: "authx",
      scopes: ["openid", "profile", "email"],
    });
    console.log('data:', data);
    console.log('error:', error);
  };
    return (
        <>
            <button onClick={handleAuthRedirection} className='bg-white text-black p-2'>Login app2</button>
            <h1>Welcome to App 2, {data?.user?.name}</h1>
        </>
    );
}
