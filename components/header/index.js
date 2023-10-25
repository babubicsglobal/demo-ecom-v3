"use client"; // This is a client component
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import AdminHeader from "../navBar/adminNavBar"
import GuestHeader from "../navBar/guestNavBar"
import UserHeader from "../navBar/userNavBar"

function Header() {
  const { data } = useSession();
  console.log("Session", data);
  const router = useRouter();



  return (
    
    data?.user ?  data?.user.role === "admin" ?  <AdminHeader /> : <UserHeader /> : <GuestHeader /> 
   
  );
}

export default Header;
