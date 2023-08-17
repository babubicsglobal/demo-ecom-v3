import Image from "next/image";
import Login from "./../pages/account/login";

export default function Home() {
  return (
    <main className="home">
      <div>
        {" "}
        <Login></Login>
      </div>
    </main>
  );
}
