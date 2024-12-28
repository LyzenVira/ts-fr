import "./globals.css";
import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";

import { CartProvider } from "@/hooks/useCart";
import Header from "@/components/HeaderComponent";
import Footer from "@/components/FooterComponent";
import { AlertProvider } from "@/hooks/alertContext";
import CartComponent from "@/components/cart-component/CartComponent";

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
          <MantineProvider>
            <AlertProvider>
              <Header />
              <CartComponent />
              <main>{children}</main>
              <Footer />
            </AlertProvider>
          </MantineProvider>
        </CartProvider>
      </body>
    </html>
  );
}
