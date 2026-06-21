"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  VEHICLES,
  SEARCH_VEHICLES,
  INSURANCE_OPTIONS,
  ADDITIONAL_OPTIONS,
  type Vehicle,
} from "@/lib/mock-data";

const RENTAL_DAYS = 2;

type BookingState = {
  vehicle: Vehicle;
  setVehicleId: (id: string) => void;
  pickup: { store: string; date: string; time: string };
  dropoff: { store: string; date: string; time: string };
  insuranceId: string | null;
  setInsuranceId: (id: string | null) => void;
  options: string[];
  toggleOption: (id: string) => void;
  remarks: string;
  setRemarks: (v: string) => void;
  // computed
  rentalDays: number;
  base: number;
  insuranceCost: number;
  optionsCost: number;
  subtotal: number;
  tax: number;
  total: number;
  reservationNo: string;
};

const Ctx = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [vehicleId, setVehicleId] = useState("alphard");
  const [insuranceId, setInsuranceId] = useState<string | null>("cdw");
  const [options, setOptions] = useState<string[]>(["childSeat"]);
  const [remarks, setRemarks] = useState("");

  const vehicle =
    VEHICLES.find((v) => v.id === vehicleId) ??
    SEARCH_VEHICLES.find((v) => v.id === vehicleId) ??
    VEHICLES[0];

  const toggleOption = (id: string) =>
    setOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );

  const value = useMemo<BookingState>(() => {
    const base = vehicle.basePrice2Days;
    const insuranceCost =
      (INSURANCE_OPTIONS.find((o) => o.id === insuranceId)?.price ?? 0) *
      RENTAL_DAYS;
    const optionsCost = options.reduce((sum, id) => {
      const opt = ADDITIONAL_OPTIONS.find((o) => o.id === id);
      return sum + (opt ? opt.price * RENTAL_DAYS : 0);
    }, 0);
    const subtotal = base + insuranceCost + optionsCost;
    const tax = Math.round(subtotal * 0.1);
    return {
      vehicle,
      setVehicleId,
      pickup: { store: "成田空港店", date: "2024/06/15", time: "10:00" },
      dropoff: { store: "成田空港店", date: "2024/06/17", time: "18:00" },
      insuranceId,
      setInsuranceId,
      options,
      toggleOption,
      remarks,
      setRemarks,
      rentalDays: RENTAL_DAYS,
      base,
      insuranceCost,
      optionsCost,
      subtotal,
      tax,
      total: subtotal + tax,
      reservationNo: "RES-2024-0058",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle, insuranceId, options, remarks]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): BookingState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
