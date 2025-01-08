import "./globals.css";

import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { CartProvider } from "@/hooks/useCart";
import { AlertProvider } from "@/hooks/alertContext";

import Header from "@/components/HeaderComponent";
import Footer from "@/components/FooterComponent";
import CartComponent from "@/components/cart-component/CartComponent";

//!
const CLIENT_ID =
  "675935173379-cnbppgkhcc0ohnbivo5vm6lpp33fc93t.apps.googleusercontent.com";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <GoogleOAuthProvider clientId={CLIENT_ID}>
            <MantineProvider>
              <AlertProvider>
                <Header />
                <CartComponent />
                <main>{children}</main>
                <Footer />
              </AlertProvider>
            </MantineProvider>
          </GoogleOAuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
