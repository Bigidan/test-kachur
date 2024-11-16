
import MainHeaderBar from "@/components/navigation/main-header-bar";

export default function AuthLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div>
            <MainHeaderBar/>
            {children}
        </div>
    );
}