"use client"; // This is a client component
import Image from "next/image";
import Login from "./login/page";
import { useEffect, useState } from "react";
import GlobalConfig from "./GlobalConfig/config";

export default function Home() {
  function setBigComCredentials(data) {
    process.env.BIG_COM_CLIENT_ID = data.fields.clientId;
    process.env.BIG_COM_STOREHASH = data.fields.storeHash;
    process.env.BIG_COM_ACCESS_TOKEN = data.fields.accessToken;
    GlobalConfig.clientId = data.fields.clientId;
    GlobalConfig.storeHash = data.fields.storeHash;
    GlobalConfig.accessToken = data.fields.accessToken;
    // setData(data);
  }

  return (
    <main className="home">
      <div>
        <Login></Login>
      </div>
    </main>
  );
}
