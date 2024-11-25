'use client'

import { LogOut } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { logout } from "@/lib/auth/session";
import {redirect} from "next/navigation";

const LogOutButton = () => {
    const handleLogOut = async () => {
        await logout();
        redirect("/login");
    }

    return (
        <DropdownMenuItem onClick={handleLogOut}>
            <LogOut />
            Вийти з облікового запису
        </DropdownMenuItem>
    )
}

export default LogOutButton