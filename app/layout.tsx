import "./globals.css";
import { Inter } from "next/font/google";
import Header from "../components/header/index";
import { SessionProvider } from "next-auth/react";

import { ReactNode } from "react";
import Providers from "./../Providers";

const inter = Inter({ subsets: ["latin"] });
interface IProps {
  children: ReactNode;
}

export const metadata = {
  title: "Bics Store",
  description: "Bics Store Ecommerce Application",
};
export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en">
      <body className="inter.className">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
