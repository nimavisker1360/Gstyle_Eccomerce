import React from "react";

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { MobileNavigation } from "@/components/shared/mobile-navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 flex flex-col p-3 sm:p-4 pb-24 md:pb-4 safe-area-inset-bottom">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
}
