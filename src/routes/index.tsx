import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/medicycle/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediCycle | Give medicines a second chance" },
      { name: "description", content: "A better way for pharmacies and community organizations to share surplus medicines." },
      { property: "og:title", content: "MediCycle | Give medicines a second chance" },
      { property: "og:description", content: "Connect pharmacy donations with organizations that need them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});