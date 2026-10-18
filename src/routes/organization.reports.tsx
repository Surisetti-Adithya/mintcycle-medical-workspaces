import { createFileRoute } from "@tanstack/react-router";
import { OrganizationWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/organization/reports")({
  head: () => ({ meta: pageMeta("Impact reports | MediCycle", "Review a sample summary of organization medicine requests and fulfilled donations in MediCycle.") }),
  component: () => <OrganizationWorkspace view="reports" />,
});