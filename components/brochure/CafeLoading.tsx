import paperTexture from "@/assets/paper.webp";
import { PAPER_STYLE, PAPER_TEXTURE } from "./constants";
import styles from "./CafeLoading.module.css";

export function CafeLoading() {
  return (
    <div
      className={styles.screen}
      style={PAPER_STYLE}
      role="status"
      aria-live="polite"
    >
      <div
        className={styles.paper}
        aria-hidden="true"
        style={{
          backgroundImage: `url(${paperTexture.src})`,
          backgroundSize: `${paperTexture.width}px ${paperTexture.height}px`,
          opacity: PAPER_TEXTURE.opacity,
          mixBlendMode: PAPER_TEXTURE.blendMode,
        }}
      />
      <div className={styles.content}>
        <svg className={styles.drawing} viewBox="0 0 260 230" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <g className={styles.steam}>
              <path d="M105 74C91 60 116 51 105 35" />
              <path d="M130 65C116 51 142 42 130 23" />
              <path d="M154 74C141 61 164 53 154 39" />
            </g>
            <ellipse cx="128" cy="192" rx="88" ry="15" />
            <path d="M59 191C85 202 168 205 197 191" opacity=".35" />
            <path d="M184 113C224 101 224 155 184 157" />
            <path d="M188 123C209 118 209 144 187 146" />
            <path d="M67 108C67 153 78 184 128 184C175 184 188 153 188 108" fill="var(--cup-paper)" />
            <ellipse cx="127.5" cy="108" rx="60.5" ry="19" fill="var(--cup-paper)" />
            <ellipse cx="127.5" cy="111" rx="51" ry="12" fill="#b58a59" fillOpacity=".2" strokeWidth="1.5" />
            <g className={styles.ripple} strokeWidth="1.2" opacity=".5">
              <path d="M96 111C104 102 149 102 158 111" />
              <path d="M105 117C119 122 143 119 150 114" />
            </g>
            <g className={styles.spoon}>
              <path d="M128 112L147 56C150 48 157 51 154 59L135 115" fill="var(--cup-paper)" />
              <path d="M128 112Q124 122 131 123Q139 123 135 115" fill="var(--cup-paper)" />
            </g>
            {/* The front rim conceals the spoon as it dips into the tea. */}
            <path d="M67 108C67 119 94 127 128 127C161 127 188 119 188 108L184 143C176 170 159 184 128 184C94 184 76 168 71 143Z" fill="var(--cup-paper)" stroke="none" />
            <path d="M67 108C67 119 94 127 128 127C161 127 188 119 188 108" />
            <path d="M67 108C67 153 78 184 128 184C175 184 188 153 188 108" />
            <path d="M81 140C84 156 90 164 101 169" opacity=".35" />
          </g>
        </svg>
        <span className={styles.srOnly}>Loading Chai Coffee Lit. Please wait.</span>
      </div>
    </div>
  );
}
