"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function TrashPage() {
  const { setViewType } = useAppStore();

  useEffect(() => {
    setViewType("trash");
  }, [setViewType]);

  return null;
}
