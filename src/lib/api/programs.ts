import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export interface ProgramTier {
  id: string;
  name: string;
  description: string;
  mainColor: string;
  tierIndex: number;
  minPoint: number;
  maxPoint: number | null;
}

export interface ProgramCampaign {
  id: string;
  name: string;
  bannerImg: string;
  startDate: string;
  expirationDate: string | null;
  status: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  startDate: string;
  expiredDate: string | null;
  status: string;
  tiers: ProgramTier[];
  campaigns: ProgramCampaign[];
}

export async function fetchPublicPrograms(): Promise<Program[]> {
  const { data } = await api.get<Program[]>("/api/v1/public/programs");
  return data;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatCampaignDate(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function getCampaignStatusLabel(status: string): string {
  switch (status) {
    case "RUNNING":
      return "Đang diễn ra";
    case "UPCOMING":
      return "Sắp diễn ra";
    case "ENDED":
      return "Đã kết thúc";
    default:
      return status;
  }
}
