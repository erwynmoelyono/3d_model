import { Customizer } from "@/components/Customizer";
import { Header } from "@/components/Header";
import { VR } from "@/components/VR";

import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />

      <Customizer />
    </div>
  );
}
