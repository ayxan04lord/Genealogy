import Header from "../header/Header";
import Footer from "../footer/Footer";

/**
 * Standart səhifə layout-u:
 * Header + məzmun + Footer
 */
export default function PageLayout({ children, activeForestName, onOpenForests }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header activeForestName={activeForestName} onOpenForests={onOpenForests} />
      {/* fixed-top header 56px tutur — məzmun onun altından başlamalıdır */}
      <main style={{ flex: 1, paddingTop: "56px" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
