import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownToLine, ArrowRight, Boxes, ChartNoAxesColumn, Check, ClipboardList, HandHeart,
  LayoutDashboard, LogOut, PackagePlus, Pill, Search, ShieldCheck, Stethoscope, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMediCycle, type MediCycleRole } from "@/lib/medicycle-state";
import type { Medicine, RequestStatus } from "@/lib/medicycle-domain";

type ShopView = "dashboard" | "inventory" | "donations" | "requests";
type OrganizationView = "dashboard" | "medicines" | "requests" | "reports";
type WorkspaceView = ShopView | OrganizationView;
type WorkspaceLink = { to: string; label: string; icon: typeof LayoutDashboard; view: WorkspaceView };

const shopLinks: WorkspaceLink[] = [
  { to: "/shop", label: "Overview", icon: LayoutDashboard, view: "dashboard" },
  { to: "/shop/inventory", label: "Inventory", icon: Boxes, view: "inventory" },
  { to: "/shop/donations", label: "Add donation", icon: PackagePlus, view: "donations" },
  { to: "/shop/requests", label: "Requests", icon: ClipboardList, view: "requests" },
];
const organizationLinks: WorkspaceLink[] = [
  { to: "/organization", label: "Overview", icon: LayoutDashboard, view: "dashboard" },
  { to: "/organization/medicines", label: "Browse medicines", icon: Search, view: "medicines" },
  { to: "/organization/requests", label: "My requests", icon: ClipboardList, view: "requests" },
  { to: "/organization/reports", label: "Reports", icon: ChartNoAxesColumn, view: "reports" },
];

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

function medicineStatusClass(status: Medicine["status"]) {
  if (status === "Available") return "status-pill status-available";
  if (status === "Expired" || status === "Rejected") return "status-pill status-negative";
  return "status-pill status-neutral";
}

function requestStatusClass(status: RequestStatus) {
  if (status === "Approved" || status === "Fulfilled") return "status-pill status-available";
  if (status === "Rejected") return "status-pill status-negative";
  return "status-pill status-pending";
}

function Status({ label, className }: { label: string; className: string }) {
  return <span className={className}>{label}</span>;
}

function Metric({ label, value, caption, icon: Icon }: { label: string; value: string | number; caption: string; icon: typeof Boxes }) {
  return (
    <article className="dashboard-card flex min-h-[128px] items-start justify-between gap-4 p-5">
      <div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-3 font-display text-3xl font-semibold text-forest">{value}</p><p className="mt-1 text-xs text-muted-foreground">{caption}</p></div>
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-mint text-forest"><Icon size={19} /></span>
    </article>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 font-display text-3xl font-semibold text-forest">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>
      {action}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="border-y border-dashed border-border py-10 text-center text-sm text-muted-foreground">{message}</div>;
}

function MedicineTable({ medicines }: { medicines: Medicine[] }) {
  if (!medicines.length) return <EmptyState message="No medicines match those filters." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse text-left">
        <thead><tr className="border-b border-border"><th className="table-head py-3 pr-4">Medicine</th><th className="table-head px-3 py-3">Quantity</th><th className="table-head px-3 py-3">Batch</th><th className="table-head px-3 py-3">Expiry</th><th className="table-head px-3 py-3">Status</th></tr></thead>
        <tbody>{medicines.map((medicine) => <tr key={medicine.id} className="border-b border-border/70 last:border-0">
          <td className="py-4 pr-4"><p className="font-semibold text-foreground">{medicine.name}</p><p className="mt-1 text-xs text-muted-foreground">{medicine.strength} · {medicine.form}</p></td>
          <td className="px-3 py-4 text-sm text-foreground">{medicine.quantity} units</td><td className="px-3 py-4 text-sm text-muted-foreground">{medicine.batch}</td><td className="px-3 py-4 text-sm text-muted-foreground">{formatDate(medicine.expiry)}</td><td className="px-3 py-4"><Status label={medicine.status} className={medicineStatusClass(medicine.status)} /></td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

function RequestTable({ rows, actions }: { rows: ReturnType<typeof useMediCycle>["requests"]; actions?: (id: string, status: RequestStatus) => ReactNode }) {
  if (!rows.length) return <EmptyState message="No requests to show yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead><tr className="border-b border-border"><th className="table-head py-3 pr-4">Request</th><th className="table-head px-3 py-3">Organization</th><th className="table-head px-3 py-3">Quantity</th><th className="table-head px-3 py-3">Submitted</th><th className="table-head px-3 py-3">Status</th><th className="table-head px-3 py-3">Action</th></tr></thead>
        <tbody>{rows.map((request) => <tr key={request.id} className="border-b border-border/70 last:border-0">
          <td className="py-4 pr-4"><p className="font-semibold text-foreground">{request.medicineName}</p><p className="mt-1 text-xs text-muted-foreground">{request.id} · {request.reason}</p></td><td className="px-3 py-4 text-sm text-foreground">{request.organization}</td><td className="px-3 py-4 text-sm text-foreground">{request.quantity}</td><td className="px-3 py-4 text-sm text-muted-foreground">{formatDate(request.date)}</td><td className="px-3 py-4"><Status label={request.status} className={requestStatusClass(request.status)} /></td><td className="px-3 py-4">{actions?.(request.id, request.status)}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

function ShopDashboard() {
  const { medicines, requests } = useMediCycle();
  const activeInventory = medicines.filter((item) => item.status === "Available");
  const pending = requests.filter((item) => item.status === "Pending");
  return <>
    <PageHeading eyebrow="Medical shop" title="Your overview" description="A clear view of your shared inventory and the requests waiting for a decision." action={<Link to="/shop/donations"><Button><PackagePlus size={16} /> Add a donation</Button></Link>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Available medicines" value={activeInventory.length} caption={`${activeInventory.reduce((sum, item) => sum + item.quantity, 0)} units listed`} icon={Pill} />
      <Metric label="Pending requests" value={pending.length} caption="Need your review" icon={ClipboardList} />
      <Metric label="Approved requests" value={requests.filter((item) => item.status === "Approved").length} caption="Ready for hand-off" icon={Check} />
      <Metric label="Donations listed" value={medicines.length} caption="Across all statuses" icon={HandHeart} />
    </div>
    <section className="mt-9">
      <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-semibold text-forest">Requests to review</h2><Link to="/shop/requests" className="text-sm font-semibold text-forest hover:text-teal">All requests <ArrowRight className="ml-1 inline" size={14} /></Link></div>
      <div className="dashboard-card px-5"><RequestTable rows={pending.slice(0, 4)} /></div>
    </section>
    <section className="mt-9">
      <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-semibold text-forest">Recent inventory</h2><Link to="/shop/inventory" className="text-sm font-semibold text-forest hover:text-teal">View inventory <ArrowRight className="ml-1 inline" size={14} /></Link></div>
      <div className="dashboard-card px-5"><MedicineTable medicines={medicines.slice(0, 4)} /></div>
    </section>
  </>;
}

function InventoryPage() {
  const { medicines } = useMediCycle();
  const [search, setSearch] = useState("");
  const filtered = medicines.filter((item) => `${item.name} ${item.strength} ${item.batch}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <PageHeading eyebrow="Medical shop" title="Medicine inventory" description="Review donated medicines, quantities, expiry dates, and availability." action={<Link to="/shop/donations"><Button><PackagePlus size={16} /> Add donation</Button></Link>} />
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">{filtered.length} listings</p><div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input aria-label="Search inventory" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search medicine or batch" /></div></div>
    <div className="dashboard-card px-5"><MedicineTable medicines={filtered} /></div>
  </>;
}

function DonationPage() {
  const { donate } = useMediCycle();
  const [message, setMessage] = useState("");
  function submitDonation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const medicine: Medicine = {
      id: `med-${Date.now()}`,
      name: String(data.get("medicineName") ?? "").trim(),
      strength: String(data.get("strength") ?? "").trim(),
      form: String(data.get("form") ?? "").trim(),
      quantity: Number(data.get("quantity")),
      batch: String(data.get("batch") ?? "").trim(),
      expiry: String(data.get("expiry") ?? ""),
      donationDate: new Date().toISOString().slice(0, 10),
      notes: String(data.get("notes") ?? "").trim(),
      status: "Available",
    };
    donate(medicine);
    setMessage(`${medicine.name} has been added to your inventory.`);
    event.currentTarget.reset();
  }
  return <>
    <PageHeading eyebrow="Medical shop" title="Add a donation" description="List eligible surplus stock for community organizations to request." />
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <form onSubmit={submitDonation} className="max-w-2xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><label className="field-label" htmlFor="medicineName">Medicine name</label><Input id="medicineName" name="medicineName" required placeholder="e.g. Paracetamol" /></div>
          <div><label className="field-label" htmlFor="strength">Strength</label><Input id="strength" name="strength" required placeholder="e.g. 500 mg" /></div>
          <div><label className="field-label" htmlFor="form">Form</label><Input id="form" name="form" required placeholder="Tablets, capsules, bottles…" /></div>
          <div><label className="field-label" htmlFor="quantity">Quantity (units)</label><Input id="quantity" name="quantity" type="number" min="1" step="1" required placeholder="0" /></div>
          <div><label className="field-label" htmlFor="batch">Batch number</label><Input id="batch" name="batch" required placeholder="e.g. MC-48291" /></div>
          <div><label className="field-label" htmlFor="expiry">Expiry date</label><Input id="expiry" name="expiry" type="date" required /></div>
          <div className="sm:col-span-2"><label className="field-label" htmlFor="notes">Notes <span className="font-normal text-muted-foreground">(optional)</span></label><Textarea id="notes" name="notes" rows={3} placeholder="Add any relevant handling or packaging notes" /></div>
        </div>
        {message && <p role="status" className="text-sm font-medium text-positive">{message}</p>}
        <Button type="submit" className="h-11"><PackagePlus size={16} /> Add to inventory</Button>
      </form>
      <aside className="h-fit border-l border-border pl-5 lg:pl-6"><span className="grid size-10 place-items-center rounded-md bg-mint text-forest"><ShieldCheck size={19} /></span><h2 className="mt-4 font-display text-lg font-semibold text-forest">Before you list</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Only list medicine that meets your organization’s existing donation and handling requirements. This prototype does not verify medicine eligibility.</p></aside>
    </div>
  </>;
}

function ShopRequestsPage() {
  const { requests, updateRequest, fulfillRequest } = useMediCycle();
  const [message, setMessage] = useState("");
  return <>
    <PageHeading eyebrow="Medical shop" title="Donation requests" description="Review requests from community organizations and update their status." />
    {message && <p role="status" className="mb-4 text-sm font-medium text-positive">{message}</p>}
    <div className="dashboard-card px-5"><RequestTable rows={requests} actions={(id, status) => status === "Pending" ? <div className="flex gap-1"><Button size="icon" variant="ghost" aria-label="Approve request" title="Approve request" onClick={() => { const result = updateRequest(id, "Approved"); setMessage(result.message); }}><Check size={16} /></Button><Button size="icon" variant="ghost" aria-label="Reject request" title="Reject request" onClick={() => { const result = updateRequest(id, "Rejected"); setMessage(result.message); }}><X size={16} /></Button></div> : status === "Approved" ? <Button size="sm" variant="outline" onClick={() => { fulfillRequest(id); setMessage("Request marked as fulfilled."); }}>Mark fulfilled</Button> : <span className="text-xs text-muted-foreground">—</span>} /></div>
  </>;
}

function OrganizationDashboard() {
  const { accountName, medicines, requests } = useMediCycle();
  const myRequests = requests.filter((item) => item.organization === accountName);
  const available = medicines.filter((item) => item.status === "Available");
  return <>
    <PageHeading eyebrow="Community organization" title="Your overview" description="Explore available donations and follow your organization’s requests." action={<Link to="/organization/medicines"><Button><Search size={16} /> Browse medicines</Button></Link>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Available listings" value={available.length} caption="Ready to request" icon={Pill} /><Metric label="Pending requests" value={myRequests.filter((item) => item.status === "Pending").length} caption="Awaiting a response" icon={ClipboardList} /><Metric label="Approved" value={myRequests.filter((item) => item.status === "Approved").length} caption="Ready for coordination" icon={Check} /><Metric label="Fulfilled" value={myRequests.filter((item) => item.status === "Fulfilled").length} caption="Completed requests" icon={HandHeart} /></div>
    <section className="mt-9"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-semibold text-forest">Your recent requests</h2><Link to="/organization/requests" className="text-sm font-semibold text-forest hover:text-teal">View all <ArrowRight className="ml-1 inline" size={14} /></Link></div><div className="dashboard-card px-5"><RequestTable rows={myRequests.slice(0, 4)} /></div></section>
    <section className="mt-9"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-semibold text-forest">Recently listed</h2><Link to="/organization/medicines" className="text-sm font-semibold text-forest hover:text-teal">Browse all <ArrowRight className="ml-1 inline" size={14} /></Link></div><div className="dashboard-card px-5"><MedicineTable medicines={available.slice(0, 4)} /></div></section>
  </>;
}

function MedicinesPage() {
  const { medicines, requestMedicine } = useMediCycle();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const available = useMemo(() => medicines.filter((item) => item.status === "Available" && item.quantity > 0 && `${item.name} ${item.strength} ${item.form}`.toLowerCase().includes(search.toLowerCase())), [medicines, search]);
  const selectedMedicine = medicines.find((item) => item.id === selected && item.status === "Available");
  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMedicine) return;
    const result = requestMedicine(selectedMedicine.id, Number(quantity), reason.trim());
    setMessage(result.message);
    if (result.ok) { setSelected(""); setQuantity("1"); setReason(""); }
  }
  return <>
    <PageHeading eyebrow="Community organization" title="Browse medicines" description="Find available donations from participating medical shops." />
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">{available.length} available listings</p><div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input aria-label="Search medicines" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search by medicine or form" /></div></div>
    {available.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{available.map((medicine) => <article key={medicine.id} className="dashboard-card flex min-h-[204px] flex-col p-5"><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-md bg-mint text-forest"><Pill size={18} /></span><Status label={`${medicine.quantity} available`} className="status-pill status-available" /></div><div className="mt-4"><h2 className="font-display text-lg font-semibold text-forest">{medicine.name}</h2><p className="mt-1 text-sm text-muted-foreground">{medicine.strength} · {medicine.form}</p><p className="mt-3 text-xs text-muted-foreground">Expires {formatDate(medicine.expiry)}</p></div><Button className="mt-auto w-fit" size="sm" variant={selected === medicine.id ? "secondary" : "outline"} onClick={() => { setSelected(medicine.id); setMessage(""); }}>{selected === medicine.id ? "Selected" : "Request medicine"}</Button></article>)}</div> : <EmptyState message="No available medicines match that search." />}
    {selectedMedicine && <section className="mt-8 max-w-2xl border-t border-border pt-6"><h2 className="font-display text-xl font-semibold text-forest">Request {selectedMedicine.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selectedMedicine.quantity} units available · {selectedMedicine.strength}</p><form onSubmit={submitRequest} className="mt-5 grid gap-4 sm:grid-cols-[160px_1fr]"><div><label className="field-label" htmlFor="requestQuantity">Quantity</label><Input id="requestQuantity" type="number" min="1" max={selectedMedicine.quantity} step="1" required value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div><div><label className="field-label" htmlFor="requestReason">Reason for request</label><Input id="requestReason" required value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Community clinic, outreach program…" /></div><Button type="submit" className="w-fit sm:col-span-2">Submit request <ArrowRight size={15} /></Button></form></section>}
    {message && <p role="status" className="mt-4 text-sm font-medium text-positive">{message}</p>}
  </>;
}

function OrganizationRequestsPage() {
  const { accountName, requests } = useMediCycle();
  const myRequests = requests.filter((item) => item.organization === accountName);
  return <><PageHeading eyebrow="Community organization" title="My requests" description="Keep track of the medicine donations requested by your organization." action={<Link to="/organization/medicines"><Button variant="outline"><Search size={16} /> Find medicines</Button></Link>} /><div className="dashboard-card px-5"><RequestTable rows={myRequests} /></div></>;
}

function ReportsPage() {
  const { accountName, medicines, requests } = useMediCycle();
  const mine = requests.filter((item) => item.organization === accountName);
  const fulfilled = mine.filter((item) => item.status === "Fulfilled");
  const requestedUnits = mine.reduce((sum, item) => sum + item.quantity, 0);
  const fulfilledUnits = fulfilled.reduce((sum, item) => sum + item.quantity, 0);
  const availableListings = medicines.filter((item) => item.status === "Available").length;
  const rows = [
    ["Requests submitted", String(mine.length)],
    ["Units requested", String(requestedUnits)],
    ["Requests fulfilled", String(fulfilled.length)],
    ["Units fulfilled", String(fulfilledUnits)],
  ];
  return <>
    <PageHeading eyebrow="Community organization" title="Impact report" description="A summary of your organization’s requests and the community medicines currently listed." />
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Requests fulfilled" value={fulfilled.length} caption="Completed hand-offs" icon={Check} /><Metric label="Units fulfilled" value={fulfilledUnits} caption="Across completed requests" icon={HandHeart} /><Metric label="Available listings" value={availableListings} caption="Current demo inventory" icon={Pill} /></div>
    <section className="mt-9"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-semibold text-forest">Request summary</h2><span className="text-xs text-muted-foreground">All time · sample data</span></div><div className="dashboard-card divide-y divide-border px-5">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-4"><span className="text-sm text-muted-foreground">{label}</span><strong className="font-display text-lg font-semibold text-forest">{value}</strong></div>)}</div></section>
  </>;
}

function SignInNotice({ role }: { role: MediCycleRole }) {
  const { signIn } = useMediCycle();
  return <div className="mx-auto max-w-lg py-16 text-center"><span className="mx-auto grid size-12 place-items-center rounded-md bg-mint text-forest"><Stethoscope size={22} /></span><h1 className="mt-5 font-display text-2xl font-semibold text-forest">Open your demo workspace</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Continue to the {role === "shop" ? "medical shop" : "organization"} workspace. This prototype does not verify an account.</p><Link to="/login" className="mt-5 inline-block"><Button>Continue to sign in <ArrowRight size={15} /></Button></Link><Button variant="link" onClick={() => signIn(role)} className="mx-auto mt-2">Enter demo workspace without signing in</Button></div>;
}

function Workspace({ role, view }: { role: MediCycleRole; view: WorkspaceView }) {
  const { accountName, isSignedIn, role: activeRole, signOut } = useMediCycle();
  const navigate = useNavigate();
  const links = role === "shop" ? shopLinks : organizationLinks;
  const pageTitle = links.find((item) => item.view === view)?.label ?? "Overview";
  function exitWorkspace() {
    signOut();
    void navigate({ to: "/" });
  }
  if (!isSignedIn || activeRole !== role) return <main className="min-h-screen bg-background"><SignInNotice role={role} /></main>;

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[244px_minmax(0,1fr)]">
      <aside className="bg-sidebar-background px-4 py-4 text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-4 lg:py-6">
        <div className="mb-5 flex items-center justify-between px-1 lg:mb-10"><Link to="/" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-md bg-sidebar-active text-sidebar-foreground"><Pill size={18} /></span><span className="font-display text-lg font-bold text-sidebar-foreground">MediCycle</span></Link><span className="hidden rounded-sm border border-sidebar-foreground/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sidebar-foreground/75 lg:inline">Demo</span></div>
        <p className="mb-2 hidden px-3 text-[10px] font-semibold uppercase tracking-wide text-sidebar-foreground/60 lg:block">Workspace</p>
        <nav aria-label="Workspace navigation" className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {links.map(({ to, label, icon: Icon, view: linkView }) => <Link key={to} to={to} aria-current={linkView === view ? "page" : undefined} className={`workspace-link shrink-0 ${linkView === view ? "workspace-link-active" : "workspace-link-idle"}`}><Icon size={17} /><span>{label}</span></Link>)}
        </nav>
        <div className="mt-auto hidden border-t border-sidebar-foreground/15 pt-4 lg:block"><p className="px-3 text-xs text-sidebar-foreground/65">{role === "shop" ? "Medical shop" : "Community organization"}</p><p className="mt-1 truncate px-3 text-sm font-semibold text-sidebar-foreground">{accountName}</p><Button variant="ghost" onClick={exitWorkspace} className="mt-3 h-9 w-full justify-start text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"><LogOut size={15} /> Sign out</Button></div>
      </aside>
      <main className="min-w-0">
        <header className="flex min-h-[64px] items-center justify-between border-b border-border px-5 sm:px-8"><p className="text-sm font-medium text-muted-foreground">{pageTitle}</p><div className="flex items-center gap-3"><span className="hidden max-w-52 truncate text-sm font-medium text-foreground sm:inline">{accountName}</span><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Sign out" title="Sign out" onClick={exitWorkspace}><LogOut size={17} /></Button><span className="grid size-8 place-items-center rounded-full bg-mint text-xs font-bold text-forest">{accountName.slice(0, 1).toUpperCase()}</span></div></header>
        <div className="mx-auto max-w-[1360px] px-5 py-7 sm:px-8 sm:py-9">
          {role === "shop" ? view === "dashboard" ? <ShopDashboard /> : view === "inventory" ? <InventoryPage /> : view === "donations" ? <DonationPage /> : <ShopRequestsPage /> : view === "dashboard" ? <OrganizationDashboard /> : view === "medicines" ? <MedicinesPage /> : view === "requests" ? <OrganizationRequestsPage /> : <ReportsPage />}
        </div>
        <footer className="border-t border-border px-5 py-4 text-xs text-muted-foreground sm:px-8">Prototype workspace · fictional sample data · verify medicines through your existing processes</footer>
      </main>
    </div>
  );
}

export function ShopWorkspace({ view }: { view: ShopView }) { return <Workspace role="shop" view={view} />; }
export function OrganizationWorkspace({ view }: { view: OrganizationView }) { return <Workspace role="organization" view={view} />; }
