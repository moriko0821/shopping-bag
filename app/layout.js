import { Open_Sans, Raleway } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BasketProvider } from "./context/BasketContext";

const open_Sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shopping Bag - Next.js EC Demo",
  description:
    "An e-commerce demo built with Next.js 16, React 19, and Stripe. Features secure checkout with server-side price validation and webhook signature verification.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${open_Sans.variable} ${raleway.variable}`}>
      <body>
        <BasketProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}
