import React from "react";
import MainNavbar from "./MainNavbar";
import Footer from "../home/Footer";

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDF4E6] text-slate-800 font-body selection:bg-[#D4AF37]/30 selection:text-[#1A237E]">
      {/* Navigation */}
      <MainNavbar />

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageLayout;
