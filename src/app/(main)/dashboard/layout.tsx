import ModalProvider from "@/components/provider/modal-provider";
import Sidebar from "@/components/shared/sidebar";
import TopNavDashboard from "@/components/shared/top-nav-dashboard";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <div className="min-h-svh flex flex-grow flex-1">
        <Sidebar />
        <div className="pt-[var(--header-height)] md:pt-0 flex flex-col flex-grow ">
          <TopNavDashboard />
          {children}
        </div>
      </div>
    </ModalProvider>
  );
}
