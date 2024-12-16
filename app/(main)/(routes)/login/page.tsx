"use client"



import {z} from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserByField } from "@/lib/db/userDB";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { login } from "@/lib/auth/session";

const formSchemaLogin = z.object({
    username: z.string().min(2, {
        message: "Логін має бути не менше 2 символів.",
    }).max(50, {
        message: "Логін має бути не більше 50 символів.",
    }),

    password: z.string().min(8, {
        message: "Пароль повинен містити не менше 8 символів",
    }).max(50, {
        message: "Пароль повинен містити не більше 50 символів",
    }),

});
const formSchemaEmail = z.object({
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

});



const LoginPage = () => {

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
    const formLogin = useForm<z.infer<typeof formSchemaLogin>>({
        resolver: zodResolver(formSchemaLogin),
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const formEmail = useForm<z.infer<typeof formSchemaEmail>>({
        resolver: zodResolver(formSchemaEmail),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    // 2. Define a submit handler.
    async function onSubmit(
        values: z.infer<typeof formSchemaLogin | typeof formSchemaEmail>,
        type: "login" | "email"
    ) {
        // Перевірка, чи це об'єкт з `username` або `email`
        const isLogin = type === "login";

        // Витягаємо відповідно або username, або email
        const identifier = isLogin ? (values as { username: string }).username : (values as { email: string }).email;
        const password = values.password;

        // Шукаємо користувача
        const user = await getUserByField(
            isLogin ? "name" : "email",
            identifier,
            password
        );

        if (user === null) {
            showToast(`Схоже, пароль неправильний!`, `Відновити пароль?`,
                "Відновити", true, "/recover");
        } else if (user === undefined) {
            showToast(`Користувача з ${isLogin ? "таким логіном" : "такою поштою"} не існує!`,
                `Перейти на сторінку реєстрації?`, "Перейти", true, "/register");
        }
        else {
            await login(user);
            showToast("Ви успішно увійшли!", `Вітаємо, ${user.nickname}!`,
                "Гаразд", false, "/");
            window.location.href = '/';
        }


    }

    async function handleLogin(values: z.infer<typeof formSchemaLogin>) {
        await onSubmit(values, "login");
    }

    async function handleEmailCheck(values: z.infer<typeof formSchemaEmail>) {
        await onSubmit(values, "email");
    }

    return (
        <div className="mx-auto max-w-screen-xl flex flex-row justify-center py-20">
            <Card className="w-2/5">
                <CardContent className="p-8">
                    <div className="font-extrabold text-4xl mb-10 text-center">Вхід</div>
                    <Tabs defaultValue="login">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Логін</TabsTrigger>
                            <TabsTrigger value="email">Пошта</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <Form {...formLogin}>
                                <form onSubmit={formLogin.handleSubmit(handleLogin)} className="space-y-4">
                                    <FormField
                                        control={formLogin.control}
                                        name="username"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Логін</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} required/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formLogin.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="" {...field} required/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col gap-3">
                                        <Button type="submit" size="lg" className="w-full font-semibold">Увійти</Button>
                                        <Link href="/register" className="w-full">
                                            <Button className="font-semibold w-full" size="lg" variant="secondary">
                                                Реєстрація
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="email">
                            <Form {...formEmail}>
                                <form onSubmit={formEmail.handleSubmit(handleEmailCheck)} className="space-y-4">
                                    <FormField
                                        control={formEmail.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пошта</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} required/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formEmail.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="" {...field} required/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col gap-3">
                                        <Button type="submit" size="lg" className="w-full font-semibold">Увійти</Button>
                                        <Link href="/register" className="w-full">
                                            <Button className="font-semibold w-full" size="lg" variant="secondary">
                                                Реєстрація
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>

                    </Tabs>




                </CardContent>
            </Card>
        </div>
    );

};

export default LoginPage;