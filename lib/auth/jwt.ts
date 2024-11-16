import bcrypt from 'bcrypt';
//
// import jwt from "jsonwebtoken";
// import { NextApiResponse } from 'next';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Чим більше число, тим більше часу займе хешування
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
//
// // Функція для створення accessToken
// function generateAccessToken(userId: number) {
//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//         throw new Error("JWT_SECRET is not defined in environment variables");
//     }
//
//     return jwt.sign({ userId }, jwtSecret, { expiresIn: '12d' });
// }
//
// // Функція для створення refreshToken
// function generateRefreshToken(userId: number) {
//     const jwtRefresh = process.env.JWT_REFRESH_SECRET;
//     if (!jwtRefresh) {
//         throw new Error("JWT_SECRET is not defined in environment variables");
//     }
//     return jwt.sign({ userId }, jwtRefresh, { expiresIn: '30d' });
// }
//
// function authenticateToken(req, res, next) {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.sendStatus(401);
//
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user; // зберігаємо інформацію про користувача в req
//         next();
//     });
// }
//
//
// function setAuthCookies(accessToken: string, refreshToken: string, res: NextApiResponse) {
//     res.setHeader('Set-Cookie', [
//         `token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1036800`, // 12 днів
//         `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`, // 30 днів
//     ]);
// }
//
// async function refreshAccessToken(refreshToken: string): Promise<string | null> {
//     try {
//         const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as { userId: number };
//         return generateAccessToken(decoded.userId);
//     } catch (err) {
//         console.error("Invalid refresh token");
//         return null;
//     }
// }