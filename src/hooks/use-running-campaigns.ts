"use client";

import { useEffect, useState } from "react";
import {
  fetchPublicPrograms,
  getRunningCampaignEntries,
  type RunningCampaignEntry,
} from "@/lib/api/programs";

export function useRunningCampaigns() {
  const [campaigns, setCampaigns] = useState<RunningCampaignEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPrograms() {
      try {
        setLoading(true);
        setError(null);
        const programs = await fetchPublicPrograms();
        if (!cancelled) {
          setCampaigns(getRunningCampaignEntries(programs));
        }
      } catch {
        if (!cancelled) {
          setError("Không thể tải danh sách chiến dịch. Vui lòng thử lại sau.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPrograms();

    return () => {
      cancelled = true;
    };
  }, []);

  return { campaigns, loading, error };
}
