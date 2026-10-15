import { useEffect, useRef, useState } from "react";

const GSI_SRC = "https://accounts.google.com/gsi/client";

let gsiPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();

  if (!gsiPromise) {
    gsiPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${GSI_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Gagal memuat skrip Google")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        gsiPromise = null;
        reject(new Error("Gagal memuat skrip Google"));
      };
      document.head.appendChild(script);
    });
  }

  return gsiPromise;
}

type CredentialHandler = (idToken: string) => void;
type ErrorHandler = (message: string) => void;

export function useGoogleAuth(
  onCredential: CredentialHandler,
  onError?: ErrorHandler,
) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const googleEnabled = Boolean(clientId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [googleFailed, setGoogleFailed] = useState(false);
  const handlerRef = useRef(onCredential);
  const errorRef = useRef(onError);

  useEffect(() => {
    handlerRef.current = onCredential;
    errorRef.current = onError;
  });

  useEffect(() => {
    if (!googleEnabled || !clientId || !containerRef.current) return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        if (!window.google?.accounts?.id) {
          setGoogleFailed(true);
          errorRef.current?.("Google tidak tersedia");
          return;
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => handlerRef.current(response.credential),
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: 300,
          locale: "id",
        });
      })
      .catch(() => {
        // Skrip gagal dimuat (offline / diblokir) — beri tahu pemanggil
        if (cancelled) return;
        setGoogleFailed(true);
        errorRef.current?.("Gagal memuat skrip Google");
      });

    return () => {
      cancelled = true;
      containerRef.current?.replaceChildren();
    };
  }, [googleEnabled, clientId]);

  return { googleEnabled, googleFailed, googleContainerRef: containerRef };
}
