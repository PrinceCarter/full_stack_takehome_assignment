import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-24 py-4 bg-white border-b">
      <div className="flex items-center">
        <Link href="https://lume.ai" target="_blank">
          <Image src="/logo_title.png" alt="Lume AI Logo" width={100} height={50} />
        </Link>
      </div>
    </nav>
  );
}
