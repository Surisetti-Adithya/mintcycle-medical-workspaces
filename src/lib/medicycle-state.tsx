import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { addDonation, decideRequest, submitRequest, type DonationRequest, type Medicine } from "@/lib/medicycle-domain";

export type MediCycleRole = "shop" | "organization";

const demoMedicines: Medicine[] = [
  { id: "med-1", name: "Paracetamol", strength: "500 mg", form: "Tablets", quantity: 120, batch: "MC-48291", expiry: "2027-05-31", donationDate: "2026-10-09", notes: "", status: "Available" },
  { id: "med-2", name: "Amoxicillin", strength: "250 mg", form: "Capsules", quantity: 48, batch: "MC-10472", expiry: "2026-11-18", donationDate: "2026-10-08", notes: "", status: "Available" },
  { id: "med-3", name: "Cetirizine", strength: "10 mg", form: "Tablets", quantity: 90, batch: "MC-62531", expiry: "2027-03-15", donationDate: "2026-10-04", notes: "", status: "Available" },
  { id: "med-4", name: "Saline solution", strength: "0.9% · 500 ml", form: "Bottles", quantity: 24, batch: "MC-77390", expiry: "2027-01-22", donationDate: "2026-10-02", notes: "", status: "Available" },
  { id: "med-5", name: "Ibuprofen", strength: "200 mg", form: "Tablets", quantity: 36, batch: "MC-31845", expiry: "2027-07-09", donationDate: "2026-09-27", notes: "", status: "Available" },
  { id: "med-6", name: "Vitamin C", strength: "500 mg", form: "Tablets", quantity: 0, batch: "MC-22481", expiry: "2027-02-26", donationDate: "2026-09-15", notes: "", status: "Reserved" },
  { id: "med-7", name: "Antiseptic cream", strength: "1% · 30 g", form: "Tubes", quantity: 8, batch: "MC-90146", expiry: "2026-10-08", donationDate: "2026-08-30", notes: "", status: "Expired" },
];

const demoRequests: DonationRequest[] = [
  { id: "REQ-2048", organization: "Hopewell Community Care", medicineId: "med-1", medicineName: "Paracetamol", quantity: 30, date: "2026-10-14", reason: "Community wellness clinic", status: "Pending" },
  { id: "REQ-2047", organization: "Northside Family Center", medicineId: "med-2", medicineName: "Amoxicillin", quantity: 16, date: "2026-10-13", reason: "Family support program", status: "Pending" },
  { id: "REQ-2042", organization: "Hopewell Community Care", medicineId: "med-3", medicineName: "Cetirizine", quantity: 20, date: "2026-10-11", reason: "Seasonal care clinic", status: "Approved" },
  { id: "REQ-2036", organization: "Greenway Outreach", medicineId: "med-4", medicineName: "Saline solution", quantity: 8, date: "2026-10-08", reason: "Mobile care days", status: "Fulfilled" },
];

type MediCycleContextValue = {
  role: MediCycleRole;
  accountName: string;
  isSignedIn: boolean;
  medicines: Medicine[];
  requests: DonationRequest[];
  signIn: (role: MediCycleRole, accountName?: string) => void;
  signOut: () => void;
  donate: (medicine: Medicine) => void;
  requestMedicine: (medicineId: string, quantity: number, reason: string) => { ok: boolean; message: string };
  updateRequest: (requestId: string, decision: "Approved" | "Rejected") => { ok: boolean; message: string };
  fulfillRequest: (requestId: string) => void;
};

const MediCycleContext = createContext<MediCycleContextValue | null>(null);

export function MediCycleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<MediCycleRole>("shop");
  const [accountName, setAccountName] = useState("Hopewell Community Care");
  const [isSignedIn, setSignedIn] = useState(false);
  const [medicines, setMedicines] = useState(demoMedicines);
  const [requests, setRequests] = useState(demoRequests);

  const signIn = useCallback((selectedRole: MediCycleRole, selectedAccountName?: string) => {
    setRole(selectedRole);
    setAccountName(selectedAccountName?.trim() || (selectedRole === "shop" ? "Greenway Pharmacy" : "Hopewell Community Care"));
    setSignedIn(true);
  }, []);
  const signOut = useCallback(() => setSignedIn(false), []);
  const donate = useCallback((medicine: Medicine) => setMedicines((current) => addDonation(current, medicine)), []);
  const requestMedicine = useCallback((medicineId: string, quantity: number, reason: string) => {
    const medicine = medicines.find((item) => item.id === medicineId);
    if (!medicine) return { ok: false, message: "Choose an available medicine." };
    const result = submitRequest(requests, medicines, {
      id: `REQ-${Math.floor(2050 + Math.random() * 7000)}`,
      organization: accountName,
      medicineId,
      medicineName: medicine.name,
      quantity,
      date: new Date().toISOString().slice(0, 10),
      reason,
      status: "Pending",
    });
    if (!result.ok) return { ok: false, message: result.message };
    setRequests(result.requests);
    return { ok: true, message: "Your request is now pending review." };
  }, [accountName, medicines, requests]);
  const updateRequest = useCallback((requestId: string, decision: "Approved" | "Rejected") => {
    const result = decideRequest(requests, medicines, requestId, decision);
    if (!result.ok) return { ok: false, message: result.message };
    setRequests(result.requests);
    setMedicines(result.medicines);
    return { ok: true, message: `Request ${decision.toLowerCase()}.` };
  }, [medicines, requests]);
  const fulfillRequest = useCallback((requestId: string) => {
    setRequests((current) => current.map((item) => item.id === requestId && item.status === "Approved" ? { ...item, status: "Fulfilled" } : item));
  }, []);

  const value = useMemo(() => ({ role, accountName, isSignedIn, medicines, requests, signIn, signOut, donate, requestMedicine, updateRequest, fulfillRequest }), [role, accountName, isSignedIn, medicines, requests, signIn, signOut, donate, requestMedicine, updateRequest, fulfillRequest]);
  return <MediCycleContext.Provider value={value}>{children}</MediCycleContext.Provider>;
}

export function useMediCycle() {
  const value = useContext(MediCycleContext);
  if (!value) throw new Error("useMediCycle must be used within MediCycleProvider");
  return value;
}