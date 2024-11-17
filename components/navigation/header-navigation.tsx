"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Ну це перший жанр",
        href: "/docs/primitives/alert-dialog",
        description:
            "А це його великий опис, який має показати що за хуйню я зробив.",
    },
    {
        title: "Другий жанр",
        href: "/docs/primitives/hover-card",
        description:
            "А-ба-ба-га-ла-ма-га.",
    },
    {
        title: "Третій жанр",
        href: "/docs/primitives/progress",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget nulla id metus eleifend fermentum. Ut aliquet nec..",
    },
    {
        title: "Четвертий жанр",
        href: "/docs/primitives/scroll-area",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit purus sed euismod sollicitudin. Nunc augue tellus, venenatis.",
    },
    {
        title: "П'ятий жанр",
        href: "/docs/primitives/tabs",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum arcu a vehicula finibus. Ut bibendum maximus nisl.",
    },
    {
        title: "Шостий жанр",
        href: "/docs/primitives/tooltip",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis lacus metus, posuere elementum ante posuere vitae. Integer.",
    },
]

export function HeaderNavigation() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Головна
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Проєкти</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-4">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >

                                        <Image src="/logo.png" alt="logo" width="70" height="70"/>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Наша команда робить дубляж аніме і не тільки, тому пропонуємо Вам переглянути наші роботи нижче.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Аніме 1">
                                Короткий опис. Може рейтинг.
                            </ListItem>
                            <ListItem href="/docs/installation" title="Аніме 2">
                                Короткий опис. Може рейтинг.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Аніме 3">
                                Короткий опис. Може рейтинг.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Аніме 4">
                                Короткий опис. Може рейтинг.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Актори</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Про нас
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Контакти
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>((
    { className, title, children, ...props },
    ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
