import { COMPANY_NAME } from "@/lib/constants";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label={COMPANY_NAME}
    >
      <h1 className="text-white/90  text-2xl font-heding font-semibold">
        BWONLINE
      </h1>
      {/* Light-mode logo (dark ink) */}
      {/* <Image
        src="/logo/enelogolight-png.png"
        alt={COMPANY_NAME}
        width={200}
        height={110}
        priority
        className="block h-24 w-auto dark:hidden"
      /> */}
      {/* Dark-mode logo (light ink) */}
      {/* <Image
        src="/logo/enelogodark.svg"
        alt={COMPANY_NAME}
        width={200}
        height={110}
        priority
        className="hidden h-24 w-auto dark:block"
      /> */}
    </span>
  );
}
