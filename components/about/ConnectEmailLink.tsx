"use client";

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MouseEvent } from "react";

const EMAIL = "chaicoffeelit@gmail.com";
const MAILTO = `mailto:${EMAIL}`;
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

export function ConnectEmailLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    event.preventDefault();
    window.open(GMAIL_COMPOSE, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={MAILTO}
      onClick={handleClick}
      className="inline-flex items-center gap-2 hover:opacity-70"
    >
      <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
      Email
    </a>
  );
}
