"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function SonnerSite({text = "", title= "", description= "", label= ""}) {
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast(`${title}`, {
                    description: `${description}\n${ new Date().toLocaleDateString('uk-UA') } `,
                    action: {
                        label: `${label}`,
                        onClick: () => {},
                    },
                })
            }
        >
            {text}
        </Button>
    )
}
