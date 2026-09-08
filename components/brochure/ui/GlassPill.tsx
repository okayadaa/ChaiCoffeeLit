import type { ButtonHTMLAttributes, CSSProperties } from "react";

const pill: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 9999,
  color: "#F8FAFC",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  backgroundColor: "rgba(27, 54, 93, 0.78)",
  backgroundImage:
    "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 42%, rgba(27,54,93,0) 100%)",
  border: "1px solid rgba(255,255,255,0.5)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.45), 0 8px 20px rgba(27,54,93,0.4)",
  WebkitBackdropFilter: "blur(16px) saturate(1.8)",
  backdropFilter: "blur(16px) saturate(1.8)",
};

const pillActive: CSSProperties = {
  ...pill,
  backgroundColor: "rgba(27, 54, 93, 0.9)",
  border: "1px solid rgba(0, 123, 255, 0.75)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 14px rgba(0,123,255,0.65), 0 8px 20px rgba(27,54,93,0.4)",
};

const reset: CSSProperties = {
  WebkitAppearance: "none",
  appearance: "none",
  background: "none",
  border: 0,
  padding: 0,
  margin: 0,
  color: "inherit",
};

export function GlassPill({
  selected = false,
  compact = false,
  children,
  className = "",
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={`touch-manipulation ${className}`.trim()}
      style={{ ...reset, ...style }}
      {...props}
    >
      <span
        style={{
          ...(selected ? pillActive : pill),
          padding: compact ? "8px 16px" : "8px 20px",
        }}
      >
        {children}
      </span>
    </button>
  );
}
