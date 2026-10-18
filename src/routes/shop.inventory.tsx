import { createFileRoute } from "@tanstack/react-router";
import { ShopWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/shop/inventory")({
  head: () => ({ meta: pageMeta("Medicine inventory | MediCycle", "Review medicine donation quantities, batches, expiry dates, and availability in the MediCycle demo.") }),
  component: () => <ShopWorkspace view="inventory" />,
});