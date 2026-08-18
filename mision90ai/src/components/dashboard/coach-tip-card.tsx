import Link from "next/link";

export default function CoachTipCard({ tip }: { tip: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-card-lg border border-[#C9DCFF] bg-primary-soft p-[18px] desktop:p-6">
      <span className="text-[11px] font-extrabold uppercase tracking-[.1em] text-primary">Coach AI</span>
      <p className="text-sm leading-[1.6] text-[#1E3E7B]">{tip}</p>
      <Link
        href="/coach"
        className="self-start rounded-[10px] bg-primary px-4 py-[11px] text-[13px] font-bold text-white hover:bg-primary-hover"
      >
        Hablar con el coach
      </Link>
    </div>
  );
}
