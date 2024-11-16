
import MainHeaderBar from "@/components/navigation/main-header-bar";

export default function MainLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div>
            <MainHeaderBar/>
                {children}
        </div>
    );
}