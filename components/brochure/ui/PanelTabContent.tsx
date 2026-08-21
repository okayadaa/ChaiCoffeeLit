import { PanelBackButton } from "./PanelBackButton";

export function PanelTabContent({
  title,
  body,
  onBack,
}: {
  title: string;
  body: string;
  onBack: () => void;
}) {
  return (
    <div className="relative z-10 p-12">
      <PanelBackButton onBack={onBack} />
      <h3 className="mb-6 text-4xl text-[#333333]">{title}</h3>
      <p className="text-lg leading-relaxed text-[#333333]">{body}</p>
    </div>
  );
}
