interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * A reusable multiline text area component with label.
 *
 * @param {TextAreaProps} props - Properties including label and value handlers.
 * @returns {JSX.Element} The rendered textarea with label.
 */
export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: TextAreaProps) {
  return (
    <div className="space-y-3">
      <label className="block pl-1 text-base font-semibold text-[#fce7f3]">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[160px] w-full resize-none rounded-2xl border border-[rgba(255,220,240,0.16)] bg-[rgba(63,12,52,0.88)] p-6 text-[#ffe0f0] transition-all placeholder:text-[#c78cb4] focus:border-[rgba(255,79,162,0.58)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,79,162,0.22)]"
        placeholder={placeholder}
      />
    </div>
  );
}
