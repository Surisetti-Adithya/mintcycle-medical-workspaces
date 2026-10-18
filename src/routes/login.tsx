import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/medicycle/auth";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: pageMeta("Sign in | MediCycle", "Choose a MediCycle demo workspace for a medical shop or community organization.") }),
  component: () => <AuthPage mode="login" />,
});