import { NextResponse, type NextRequest} from "next/server";
import { getSession} from "@/lib/auth/session";
import { User } from "@/components/types/user";


export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.includes("/admin")) {
        const parsed = await getSession();
        const user = parsed?.user as User;
        if (user != undefined && user.roleId  === 3) return;
        else return NextResponse.rewrite(new URL("/watch/n", request.url));
    }

}