import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, genericOAuth } from 'better-auth/plugins';
import { sendEmail } from '@/lib/email';
import {
    createVerificationEmail,
    createResetPasswordEmail,
} from '@/lib/email-templates';
import { db } from '@/server/db';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

export const auth = betterAuth({
    baseURL: 'https://app2.ash404.me',
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
    }),
    plugins: [
        nextCookies(),
        admin({
            defaultRole: 'user',
            impersonationSessionDuration: 60 * 60 * 24,
        }),
        genericOAuth({
            config: [
                {
                    providerId: 'authx',
                    clientId: 'client_tondkofz1caercix6g0pq',
                    // clientId: 'client_tondkofz1caercix6g0pq',
                    clientSecret: 'secret_b3kasapg1nr0gz5lzgjctit',
                    // clientSecret: 'secret_b3kasapg1nr0gz5lzgjctit',
                    scopes: ['openid', 'profile', 'email'],
                    discoveryUrl:
                        'https://authx.ash404.me/api/auth/.well-known/openid-configuration',
                        // 'https://authx.xcelerator.co.in/api/auth/.well-known/openid-configuration',
                    redirectURI:
                        'https://app2.ash404.me/api/auth/oauth2/callback/authx',
                        // 'https://app2.ash404.me/api/auth/oauth2/callback/authx',
                },
            ],
        }),
    ],
    trustedOrigins: ['http://localhost:3003', 'https://app2.ash404.me'],
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const { subject, html } = createVerificationEmail(url);
            await sendEmail({ to: user.email, subject, html });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600,
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp: true,
        requireEmailVerification: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
        sendResetPassword: async ({ user, url }) => {
            const { subject, html } = createResetPasswordEmail(url);
            await sendEmail({ to: user.email, subject, html });
        },
        resetPasswordTokenExpiresIn: 3600,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }
    }
});

export async function getUserSession(headers?: Headers) {
    return auth.api.getSession({
        headers: headers ?? new Headers(),
    });
}
