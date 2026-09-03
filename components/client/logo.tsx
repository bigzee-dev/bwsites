import { COMPANY_NAME } from "@/lib/constants";
import Image from "next/image";

export default function Logo() {
  return (
    <div className={`flex gap-x-3 items-center`} aria-label={COMPANY_NAME}>
      <Image
        src="/logo/onlinespot-yellow.png"
        alt={COMPANY_NAME}
        width={200}
        height={180}
        priority
        className="block h-14 w-auto"
      />
      <span className="font-heading font-semibold text-2xl text-white">
        {COMPANY_NAME}
      </span>
    </div>
  );
}
