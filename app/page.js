import Image from "next/image";

import HomePage from "./Home/page";
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
