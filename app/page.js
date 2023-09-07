"use client"; // This is a client component
import Image from "next/image";
import Login from "./login/page";

export default function Home() {
    return (
      <main className="home">
        <div>
          <Login></Login>
        </div>
      </main>
    );
}
