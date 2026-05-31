export default function SectionLabel({ text }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-2 h-2 rounded-full bg-[#2F78F5]" />
      <span className="text-xs font-display uppercase tracking-[0.2em] text-[#888]">{text}</span>
    </div>
  );
}