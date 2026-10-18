import { createFileRoute } from "@tanstack/react-router";
import { OrganizationWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/organization/requests")({
  head: () => ({ meta: pageMeta("My requests | MediCycle", "Track pending, approved, and fulfilled medicine requests from your MediCycle organization workspace.") }),
  component: () => <OrganizationWorkspace view="requests" />,
});