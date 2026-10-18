import { createFileRoute } from "@tanstack/react-router";
import { ShopWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: pageMeta("Shop overview | MediCycle", "Review medicine donations, inventory, and organization requests in the MediCycle medical shop workspace.") }),
  component: () => <ShopWorkspace view="dashboard" />,
});