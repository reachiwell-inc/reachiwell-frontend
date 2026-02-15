"use client";

import React from "react";

export type HealthCareFacility = {
  _id?: string;
  id?: string;
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  type?: string;
  status?: string;
};

function normalizePhone(phone?: string) {
  if (!phone) return "";
  // keep + and digits
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return "";
  return `${hasPlus ? "+" : ""}${digits}`;
}

export default function HealthCareFacilitiesMessage({
  message,
  facilities,
  onArrangeRide,
}: {
  message: string;
  facilities: HealthCareFacility[];
  onArrangeRide?: (healthCareFacilityId: string) => void;
}) {
  return (
    <div className="max-w-[345px]">
      <p className="text-[#0B2220] text-base font-normal leading-normal whitespace-pre-wrap break-words mb-4">
        {message}
      </p>

      <div className="flex flex-col gap-4">
        {facilities.map((f, idx) => {
          const title = f.name || "Healthcare facility";
          const addressLine = [f.address, f.city].filter(Boolean).join(", ");
          const tel = normalizePhone(f.phone);
          const facilityId = (f._id || f.id || "").trim();

          return (
            <div
              key={f._id || f.id || `${title}-${idx}`}
              className="bg-white border border-[#E0EEEC] rounded-2xl px-4 py-3"
            >
              <div className="space-y-1.5">
                <div className="text-[#0B2220] text-base font-medium leading-normal">{title}</div>

                {addressLine && (
                  <div className="flex gap-2 text-[#4F4F4F] text-sm leading-normal">
                    <span className="shrink-0">📍</span>
                    <span className="break-words">{addressLine}</span>
                  </div>
                )}

                {f.type && (
                  <div className="flex gap-2 text-[#4F4F4F] text-sm leading-normal">
                    <span className="shrink-0">🏥</span>
                    <span className="break-words">{f.type}</span>
                  </div>
                )}

                {f.phone && (
                  <div className="flex gap-2 text-[#4F4F4F] text-sm leading-normal">
                    <span className="shrink-0">📞</span>
                    <span className="break-words">{f.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => facilityId && onArrangeRide?.(facilityId)}
                  disabled={!facilityId || !onArrangeRide}
                  className={
                    facilityId && onArrangeRide
                      ? "flex-1 inline-flex items-center justify-center h-10 rounded-full bg-[#E0EEEC] text-[#2D8E86] text-sm font-medium hover:bg-[#D0DEDC] transition-colors"
                      : "flex-1 inline-flex items-center justify-center h-10 rounded-full bg-[#F3FAF9] text-[#9CA3AF] text-sm font-medium cursor-not-allowed"
                  }
                >
                  Arrange a ride
                </button>

                {tel ? (
                  <a
                    href={`tel:${tel}`}
                    className="flex-1 inline-flex items-center justify-center h-10 rounded-full bg-[#F3FAF9] text-[#2D8E86] text-sm font-medium hover:bg-[#E0EEEC] transition-colors"
                  >
                    Call Now
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 inline-flex items-center justify-center h-10 rounded-full bg-[#F3FAF9] text-[#9CA3AF] text-sm font-medium cursor-not-allowed"
                  >
                    Call Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

