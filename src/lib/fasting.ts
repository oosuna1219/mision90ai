import type { FastingProtocol } from "@prisma/client";

export const PROTO_LABEL: Record<FastingProtocol, string> = {
  P12_12: "12:12",
  P14_10: "14:10",
  P16_8: "16:8",
  P18_6: "18:6",
};

const PROTO_HOURS: Record<FastingProtocol, number> = {
  P12_12: 12,
  P14_10: 14,
  P16_8: 16,
  P18_6: 18,
};

export function labelToProto(label: string): FastingProtocol {
  switch (label) {
    case "12:12":
      return "P12_12";
    case "14:10":
      return "P14_10";
    case "18:6":
      return "P18_6";
    default:
      return "P16_8";
  }
}

export function protoTargetHours(p: FastingProtocol): number {
  return PROTO_HOURS[p];
}
