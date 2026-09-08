import cafeSetting from "@/assets/cafe-setting.jpg";

export function BlurredCafeBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="cafe-photo"
        style={{ backgroundImage: `url(${cafeSetting.src})` }}
      />
      <div className="cafe-overlay" />
    </div>
  );
}
