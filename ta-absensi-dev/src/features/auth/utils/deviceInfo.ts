export function getDeviceInfo(): string {
  const ua = navigator.userAgent;

  const browser = ua.includes("Edg/")
    ? "Edge"
    : ua.includes("OPR/")
      ? "Opera"
      : ua.includes("Chrome/")
        ? "Chrome"
        : ua.includes("Firefox/")
          ? "Firefox"
          : ua.includes("Safari/")
            ? "Safari"
            : "Unknown";

  const os = ua.includes("Windows NT 10")
    ? "Windows 11"
    : ua.includes("Windows")
      ? "Windows"
      : ua.includes("Android")
        ? "Android"
        : /iPhone|iPad|iPod/.test(ua)
          ? "iOS"
          : ua.includes("Mac OS")
            ? "macOS"
            : ua.includes("Linux")
              ? "Linux"
              : "Unknown";

  return `Web · ${browser} · ${os}`.slice(0, 255);
}
