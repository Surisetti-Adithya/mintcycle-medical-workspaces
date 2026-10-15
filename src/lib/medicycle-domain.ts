export type MedicineStatus = "Available" | "Reserved" | "Expired" | "Rejected";
export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Fulfilled";

export type Medicine = {
  id: string;
  name: string;
  strength: string;
  form: string;
  quantity: number;
  batch: string;
  expiry: string;
  donationDate: string;
  notes: string;
  status: MedicineStatus;
};

export type DonationRequest = {
  id: string;
  organization: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  date: string;
  reason: string;
  status: RequestStatus;
};

export function availableQuantity(medicines: Medicine[], medicineId: string): number {
  const medicine = medicines.find((item) => item.id === medicineId);
  return medicine?.status === "Available" ? medicine.quantity : 0;
}

export function addDonation(medicines: Medicine[], medicine: Medicine): Medicine[] {
  return [medicine, ...medicines];
}

export function submitRequest(
  requests: DonationRequest[],
  medicines: Medicine[],
  request: DonationRequest,
): { ok: true; requests: DonationRequest[] } | { ok: false; message: string } {
  const quantity = availableQuantity(medicines, request.medicineId);
  if (!Number.isInteger(request.quantity) || request.quantity < 1) {
    return { ok: false, message: "Enter a quantity of at least one." };
  }
  if (request.quantity > quantity) {
    return { ok: false, message: `Only ${quantity} units are currently available.` };
  }
  return { ok: true, requests: [request, ...requests] };
}

export function decideRequest(
  requests: DonationRequest[],
  medicines: Medicine[],
  requestId: string,
  decision: "Approved" | "Rejected",
): { ok: true; requests: DonationRequest[]; medicines: Medicine[] } | { ok: false; message: string } {
  const request = requests.find((item) => item.id === requestId);
  if (!request || request.status !== "Pending") {
    return { ok: false, message: "This request is no longer pending." };
  }
  if (decision === "Rejected") {
    return {
      ok: true,
      requests: requests.map((item) => item.id === requestId ? { ...item, status: decision } : item),
      medicines,
    };
  }
  const remaining = availableQuantity(medicines, request.medicineId);
  if (request.quantity > remaining) {
    return { ok: false, message: `Only ${remaining} units remain; this request cannot be approved.` };
  }
  return {
    ok: true,
    requests: requests.map((item) => item.id === requestId ? { ...item, status: decision } : item),
    medicines: medicines.map((medicine) => medicine.id === request.medicineId
      ? { ...medicine, quantity: medicine.quantity - request.quantity, status: medicine.quantity === request.quantity ? "Reserved" : medicine.status }
      : medicine),
  };
}