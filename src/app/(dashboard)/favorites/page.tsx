"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function FavoritesPage() {
  const { setViewType } = useAppStore();

  useEffect(() => {
    setViewType("favorites");
  }, [setViewType]);

  return null;
}
