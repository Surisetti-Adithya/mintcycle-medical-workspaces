import { describe, expect, it } from "vitest";
import { decideRequest, type DonationRequest, type Medicine } from "@/lib/medicycle-domain";

const medicine: Medicine = {
  id: "med-1", name: "Paracetamol", strength: "500 mg", form: "Tablets", quantity: 10,
  batch: "MC-1", expiry: "2027-01-01", donationDate: "2026-10-01", notes: "", status: "Available",
};
const request: DonationRequest = {
  id: "REQ-1", organization: "Demo organization", medicineId: "med-1", medicineName: "Paracetamol",
  quantity: 11, date: "2026-10-15", reason: "Community clinic", status: "Pending",
};

describe("MediCycle request decisions", () => {
  it("does not approve a request for more than the available stock", () => {
    const result = decideRequest([request], [medicine], "REQ-1", "Approved");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Only 10 units remain");
  });

  it("deducts the requested amount when approving within available stock", () => {
    const validRequest = { ...request, quantity: 4 };
    const result = decideRequest([validRequest], [medicine], "REQ-1", "Approved");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.medicines[0]?.quantity).toBe(6);
  });
});