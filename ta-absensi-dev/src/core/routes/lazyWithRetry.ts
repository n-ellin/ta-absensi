import { lazy } from "react";

const lazyWithRetry = (importFn: () => Promise<any>) =>
  lazy(() =>
    importFn().catch((err: Error) => {
      const isChunkError =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("Loading chunk") ||
        err?.message?.includes("dynamically imported module");

      if (isChunkError && !sessionStorage.getItem("chunk_reloaded")) {
        sessionStorage.setItem("chunk_reloaded", "1");
        window.location.reload();
      }

      throw err;
    }),
  );

export default lazyWithRetry;
