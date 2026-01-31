import React from "react";
import MainNavbar from "./MainNavbar";
import Footer from "../home/Footer";

/**
 * PageLayout — Main wrapper for all public pages
 * 
 * Provides consistent navigation, footer, and page structure
 * with the new artistic dark theme
 */
const PageLayout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] selection:bg-[var(--color-accent-coral)] selection:text-[var(--color-bg-primary)]">
      {/* Navigation */}
      <MainNavbar />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
