import MainHeaderBar from "@/components/navigation/main-header-bar";
import FooterBar from "@/components/main/footer-bar";

export default function MainLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex flex-col min-h-[120vh]">
            <MainHeaderBar/>
            <div className="flex-1 min-h-screen">{children}</div>
            <div id="contacts" />
            <FooterBar />
        </div>
    );
}