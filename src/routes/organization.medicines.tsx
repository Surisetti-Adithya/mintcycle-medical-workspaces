import { createFileRoute } from "@tanstack/react-router";
import { OrganizationWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/organization/medicines")({
  head: () => ({ meta: pageMeta("Browse medicines | MediCycle", "Search available medicine donations and submit a request in the MediCycle organization demo.") }),
  component: () => <OrganizationWorkspace view="medicines" />,
});