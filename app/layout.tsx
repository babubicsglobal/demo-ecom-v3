import "./globals.css";
import { Inter } from "next/font/google";
import Header from "../components/header/index";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });
import { ReactNode } from "react";
import Providers from "./../Providers";
interface IProps {
  children: ReactNode;
}
export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
