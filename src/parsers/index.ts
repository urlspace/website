import type { Parser } from "./types.ts";

type Source = {
  id: string;
  label: string;
  load: () => Promise<{ default: Parser }>;
};

const chromium = () => import("./chromium.ts");
const firefox = () => import("./firefox.ts");
const safari = () => import("./safari.ts");

export const sources: Array<Source> = [
  { id: "chrome", label: "Chrome", load: chromium },
  { id: "edge", label: "Edge", load: chromium },
  { id: "brave", label: "Brave", load: chromium },
  { id: "arc", label: "Arc", load: chromium },
  { id: "opera", label: "Opera", load: chromium },
  { id: "vivaldi", label: "Vivaldi", load: chromium },
  { id: "firefox", label: "Firefox", load: firefox },
  { id: "safari", label: "Safari (bookmarks or reading list)", load: safari },
];
