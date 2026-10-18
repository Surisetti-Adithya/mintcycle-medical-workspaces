import { createFileRoute } from "@tanstack/react-router";
import { OrganizationWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/organization")({
  head: () => ({ meta: pageMeta("Organization overview | MediCycle", "Browse community medicine donations and follow request activity in the MediCycle organization workspace.") }),
  component: () => <OrganizationWorkspace view="dashboard" />,
});