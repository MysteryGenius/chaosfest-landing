import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f7e7cb] py-6 px-22 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 flex-wrap">
      <div className="flex gap-4 items-center flex-wrap">
        <span className="text-sm text-muted">Powered by</span>
        <Link href="https://percent-twenty.com" target="_blank" rel="noopener noreferrer">
          <Image
            src="/logos/percent-twenty.png"
            alt="%20"
            width={80}
            height={40}
            priority
            className="h-4 w-auto"
          />
        </Link>
        <span className="text-sm text-muted">x</span>
        <Image
          src="/logos/CSGM.png"
          alt="Chaotic Stupid GM"
          width={64}
          height={64}
          className="h-10 w-auto"
        />
      </div>
    </footer>
  );
}
