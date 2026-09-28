"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    tidioChatApi?: {
      open: () => void;
      close: () => void;
      show: () => void;
      hide: () => void;
      on: (event: string, callback: () => void) => void;
    };
    openTidioChat?: () => boolean;
  }
}

export default function TidioChat() {
  const tidioKey = process.env.NEXT_PUBLIC_TIDIO_KEY?.trim();

  useEffect(() => {
    // Configure helper on window for easy invocation anywhere
    window.openTidioChat = () => {
      if (window.tidioChatApi) {
        window.tidioChatApi.show();
        window.tidioChatApi.open();
        return true;
      }
      return false;
    };

    const handleTidioReady = () => {
      if (window.tidioChatApi) {
        // Hide default launcher bubble so custom "Talk to Expert" triggers it
        window.tidioChatApi.hide();
        window.tidioChatApi.on("close", () => {
          window.tidioChatApi?.hide();
        });
      }
    };

    if (typeof window !== "undefined") {
      if (window.tidioChatApi) {
        handleTidioReady();
      } else {
        document.addEventListener("tidioChat-ready", handleTidioReady);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        document.removeEventListener("tidioChat-ready", handleTidioReady);
      }
    };
  }, []);

  if (!tidioKey) return null;

  const scriptSrc =
    tidioKey.startsWith("http") || tidioKey.startsWith("//")
      ? tidioKey
      : `//code.tidio.co/${tidioKey.replace(/\.js$/, "")}.js`;

  return (
    <Script
      id="tidio-chat-script"
      src={scriptSrc}
      strategy="lazyOnload"
    />
  );
}
