"use server"

import { SignJWT, jwtVerify } from 'jose';
import { User } from "@/components/types/user";
import { cookies } from "next/headers";

const MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_NAME = 'session';

type payloadProp = {
    user: User;
    expire: Date;
}
const key = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function encrypt(payload: payloadProp) {

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(payload.expire)
        .sign(key);
}

export async function decrypt(input: string) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });

    return payload;
}


export async function login(user: User) {
    const cookieStore = await cookies();

    const expire = new Date(Date.now() + MAX_AGE * 1000);
    const session = await encrypt({ user, expire })

    cookieStore.set(SESSION_NAME, session, { maxAge: MAX_AGE, httpOnly: true, secure: true });
}



async function getCookie() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_NAME)?.value;
    if (!session) return null;
    return session;
}

export async function logout(){
    const cookieStore = await cookies();
    cookieStore.set(SESSION_NAME, '', { maxAge: -1 });

}

export async function getSession() {
    const session = await getCookie()
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_NAME)?.value;
    if (!session) return null;

    const parsed = await decrypt(session);
    parsed.expire = new Date(Date.now() + MAX_AGE * 1000);
    cookieStore.set({
        name: SESSION_NAME,
        value: await encrypt({
            user: parsed.user as User,
            expire: parsed.expire as Date
        }),
        httpOnly: true,
        secure: true,
        maxAge: MAX_AGE,
    })
}