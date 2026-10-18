import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/medicycle/auth";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: pageMeta("Join MediCycle", "Create a demo workspace for a medical shop or community organization on MediCycle.") }),
  component: () => <AuthPage mode="register" />,
});