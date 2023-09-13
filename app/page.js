"use client"; // This is a client component
import Image from "next/image";
import Login from "./login/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { data } = useSession();

  if (data) router.push("/home");

  return (
    <main className="home">
      <div>
        <Login />
      </div>
    </main>
  );
}
