"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function NotePage() {
  const params = useParams<{ noteId: string }>();
  const { setSelectedNote, setMobileView } = useAppStore();

  useEffect(() => {
    if (params.noteId) {
      setSelectedNote(params.noteId);
      setMobileView("editor");
    }
  }, [params.noteId, setSelectedNote, setMobileView]);

  // All rendering is handled by the parent (dashboard) layout.
  return null;
}
