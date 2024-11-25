import React from "react";

export default function SpecialLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    return <>{children}</>  // повертаємо тільки children без загального оформлення
}