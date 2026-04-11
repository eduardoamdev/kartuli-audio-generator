import type { DataTextInfo } from "@/types/data";
import { NON_CLICKABLE_BUTTON_SURFACES } from "@/utils/constants";

type NonClickableButtonProps = {
  entry: DataTextInfo;
  index: number;
};

export default function NonClickableButton({
  entry,
  index,
}: NonClickableButtonProps) {
  return (
    <article
      className={[
        "min-h-[168px] rounded-[1.4rem] border border-[rgba(255,196,232,0.2)] p-5 shadow-[0_24px_62px_-26px_rgba(36,4,28,0.94)] backdrop-blur-[18px]",
        NON_CLICKABLE_BUTTON_SURFACES[
          index % NON_CLICKABLE_BUTTON_SURFACES.length
        ],
      ].join(" ")}
    >
      <div className="space-y-3 text-left">
        <p className="text-2xl font-bold leading-tight text-[#fff0fb]">
          {entry.ka}
        </p>
        <p className="text-base font-medium text-[rgba(255,232,245,0.9)]">
          {entry.la}
        </p>
        <p className="text-sm leading-relaxed text-[rgba(255,211,239,0.9)]">
          {entry.en}
        </p>
      </div>
    </article>
  );
}
