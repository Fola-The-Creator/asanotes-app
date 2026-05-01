"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function ArchivePage() {
  const { setViewType } = useAppStore();

  useEffect(() => {
    setViewType("archive");
  }, [setViewType]);

  return null;
}
