import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const PROGRAM_STATUSES = ["RUNNING", "PLANNED", "FINISHED", "STOPPED"] as const;

export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

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
  bannerImg: string | null;
  startDate: string;
  expirationDate: string | null;
  status: ProgramStatus | string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  startDate: string;
  expiredDate: string | null;
  status: ProgramStatus | string;
  tiers: ProgramTier[];
  campaigns: ProgramCampaign[];
}

export interface RunningCampaignEntry {
  program: Program;
  campaign: ProgramCampaign;
}

export async function fetchPublicPrograms(): Promise<Program[]> {
  const { data } = await api.get<Program[]>("/api/v1/public/programs");
  return data;
}

export function getRunningCampaignEntries(programs: Program[]): RunningCampaignEntry[] {
  return programs
    .flatMap((program) =>
      (program.campaigns ?? [])
        .filter((campaign) => isRunningCampaign(campaign.status))
        .map((campaign) => ({ campaign, program })),
    )
    .sort(
      (a, b) =>
        new Date(b.campaign.startDate).getTime() -
        new Date(a.campaign.startDate).getTime(),
    );
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

export function formatCampaignPeriod(startDate: string, expirationDate: string | null): string {
  const start = formatCampaignDate(startDate);
  if (!expirationDate) return `Từ ${start}`;
  return `${start} - ${formatCampaignDate(expirationDate)}`;
}

export function isRunningCampaign(status: string): boolean {
  return status === "RUNNING";
}

export function getCampaignStatusLabel(status: string): string {
  switch (status) {
    case "RUNNING":
      return "Đang diễn ra";
    case "PLANNED":
      return "Sắp diễn ra";
    case "FINISHED":
      return "Đã kết thúc";
    case "STOPPED":
      return "Đã dừng";
    default:
      return status;
  }
}
