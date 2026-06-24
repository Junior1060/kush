import Link from "next/link";
import { BackIcon } from "./icons";

// Header for secondary screens reached from Profile (back chevron + title).
export function SubPageHeader({
  title,
  back = "/profile",
}: {
  title: string;
  back?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-none items-center gap-2 px-[18px] pb-3 pt-1">
      <Link
        href={back}
        aria-label="Back"
        className="-ml-2 flex h-[38px] w-[38px] items-center justify-center"
      >
        <BackIcon size={22} />
      </Link>
      <h1 className="m-0 font-display text-[22px] font-bold tracking-[-0.4px] text-ink">
        {title}
      </h1>
    </div>
  );
}
