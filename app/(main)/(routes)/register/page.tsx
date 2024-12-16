"use client"

import React from 'react';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod"
import {getUserByEmail, getUserByLogin, userRegister} from "@/lib/db/userDB";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Логін має бути не менше 2 символів.",
    }).max(50, {
        message: "Логін має бути не більше 50 символів.",
    }),
    nickname: z.string().min(2, {
        message: "Ім'я користувача має бути не менше 2 символів.",
    }).max(50, {
        message: "Ім'я користувача має бути не більше 50 символів.",
    }),

    email: z.string().email({
        message: "Введіть справжню пошту."
    }).min(2, {
        message: "Ім'я користувача має бути не менше 2 символів.",
    }).max(50, {
        message: "Ім'я користувача має бути не більше 50 символів.",
    }),

    password: z.string().min(8, {
        message: "Пароль повинен містити не менше 8 символів",
    }).max(50, {
        message: "Пароль повинен містити не більше 50 символів",
    }),
    password_repeat: z.string(),

}).refine((data) => data.password === data.password_repeat, {
    message: "Паролі не співпадають",
    path: ["password_repeat"],
})

const RegisterPage = () => {
    const router = useRouter();

    function showToast(toast_title: string, toast_description: string, toast_label: string, is_toast_link: boolean, toast_link: string) {
        toast(toast_title, {
            description: toast_description,
            action: {
                label: toast_label,
                onClick: () => is_toast_link ? router.push(toast_link) : console.clear(),
            },
        });
    }


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            nickname: "",
            email: "",
            password: "",
            password_repeat: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const is_login_exist = await getUserByLogin(values.username);
        const is_email_exist = await getUserByEmail(values.email);
        if (Array.isArray(is_login_exist) && Array.isArray(is_email_exist)){
            if (is_login_exist.length !== 0) {

                showToast("Користувача з таким логіном уже існує!", `Перейти на сторінку входу?`,
                    "Перейти", true, '/login');
                return;
            } else if (is_email_exist.length !== 0) {
                showToast("Користувач з такою поштою уже зареєстрований!", `Перейти на сторінку входу?`,
                    "Перейти", true, '/login');
                return;
            }
            else {
                await userRegister(values);
                showToast("Ви успішно зареєструвалися!", `${ new Date().toLocaleDateString('uk-UA') }`,
                    "Гаразд", false, '/');
                window.location.href = '/';
            }
        }
    }

    return (
        <div className="mx-auto max-w-screen-xl flex flex-row justify-center py-20">
            <Card className="w-2/5">
                <CardContent className="p-8">
                    <div className="font-extrabold text-4xl mb-10 text-center">Реєстрація</div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Логін</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Логін для входу" {...field} required/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nickname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Псевдонім</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Публічне ім'я" {...field} required/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Пошта</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Пошта для входу" {...field} required/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Пароль</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Пароль для входу" {...field} required/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password_repeat"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="password" placeholder="Повторення паролю" {...field} required/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                            <div className="flex flex-col gap-3">
                                <Button type="submit" size="lg" className="w-full font-semibold">Реєстрація</Button>
                                <Link href="/login" className="w-full">
                                    <Button className="font-semibold w-full" size="lg" variant="secondary">
                                        Увійти
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </Form>

                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterPage;