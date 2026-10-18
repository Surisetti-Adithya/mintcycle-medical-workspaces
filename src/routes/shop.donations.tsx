import { createFileRoute } from "@tanstack/react-router";
import { ShopWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/shop/donations")({
  head: () => ({ meta: pageMeta("Add a donation | MediCycle", "Enter medicine details to add a fictional donation to the MediCycle demo inventory.") }),
  component: () => <ShopWorkspace view="donations" />,
});