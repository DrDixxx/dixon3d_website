import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Dixon 3D",
  description: "Precision additive manufacturing for real-world parts.",
  icons: {
    icon: "/assets/img/D3D_Logo.png",
    shortcut: "/assets/img/D3D_Logo.png",
    apple: "/assets/img/D3D_Logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased site-bg text-[var(--ink)]">
        <Nav />
        <main className="min-h-[calc(100vh-200px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
