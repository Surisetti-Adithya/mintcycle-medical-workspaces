import { createFileRoute } from "@tanstack/react-router";
import { ShopWorkspace } from "@/components/medicycle/workspace";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/shop/requests")({
  head: () => ({ meta: pageMeta("Donation requests | MediCycle", "Review, approve, reject, and fulfill organization requests in the MediCycle medical shop demo.") }),
  component: () => <ShopWorkspace view="requests" />,
});