export type User = {
    userId: number;
    roleId: number | null;
    nickname: string;
    image: string | null;
    name: string;
    email: string;
    autoSkip: boolean;
    password: string;
};