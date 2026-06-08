"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/utils";

import { HANDLE_CURSORS, type HandlePosition } from "@/constants";

export function ImageNodeView({
  node,
  selected,
  updateAttributes,
  editor,
}: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<HandlePosition | null>(null);

  // Track if this is a touch device for larger hit targets
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const startResize = useCallback(
    (e: React.PointerEvent, handle: HandlePosition) => {
      if (!editor.isEditable) return;
      e.preventDefault();
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const startWidth =
        imgRef.current?.offsetWidth ?? (node.attrs.width as number) ?? 400;
      const isLeft = handle.includes("left");

      // Determine max width from the editor container to prevent overflow
      const editorEl = wrapperRef.current?.closest(".tiptap") as HTMLElement | null;
      const maxWidth = editorEl ? editorEl.clientWidth : window.innerWidth;

      setIsResizing(true);
      setActiveHandle(handle);
      document.body.style.cursor = HANDLE_CURSORS[handle];
      document.body.style.userSelect = "none";

      const onPointerMove = (pe: PointerEvent) => {
        const delta = isLeft ? startX - pe.clientX : pe.clientX - startX;
        // Clamp between 80px min and the editor container width
        const newWidth = Math.min(maxWidth, Math.max(80, Math.round(startWidth + delta)));
        updateAttributes({ width: newWidth });
      };

      const onPointerUp = () => {
        setIsResizing(false);
        setActiveHandle(null);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        target.removeEventListener("pointermove", onPointerMove);
        target.removeEventListener("pointerup", onPointerUp);
        target.removeEventListener("pointercancel", onPointerUp);
      };

      target.addEventListener("pointermove", onPointerMove);
      target.addEventListener("pointerup", onPointerUp);
      target.addEventListener("pointercancel", onPointerUp);
    },
    [editor.isEditable, node.attrs.width, updateAttributes],
  );

  const src = node.attrs.src as string;
  const alt = node.attrs.alt as string | null;
  const title = node.attrs.title as string | null;
  const width = node.attrs.width as number | null;

  const isSelected = selected;
  const handles: HandlePosition[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "middle-left",
    "middle-right",
  ];

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={cn(
        "tiptap-image-wrapper relative my-4",
        isSelected && "is-selected",
      )}
      style={{ maxWidth: "100%" }}
    >
      <div
        className={cn(
          "relative rounded-md transition-all duration-150",
          isSelected && "ring-2 ring-accent-500 ring-offset-1",
          isResizing && "select-none",
        )}
        style={{
          width: width ? `${width}px` : undefined,
          maxWidth: "100%",
        }}
      >
        {/* The image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src ? (
          <img
            ref={imgRef}
            src={src}
            alt={alt ?? ""}
            title={title ?? undefined}
            draggable={false}
            className="block w-full h-auto rounded-md"
          />
        ) : (
          <div className="w-full h-32 bg-grey-100 animate-pulse rounded-md flex items-center justify-center text-grey-400 text-sm">
            Loading image...
          </div>
        )}

        {/* Resize handles — visible when selected and editable */}
        {isSelected && editor.isEditable && (
          <>
            {handles.map((pos) => {
              const isTopRow = pos.startsWith("top");
              const isBottomRow = pos.startsWith("bottom");
              const isMiddleRow = pos.startsWith("middle");
              const isLeft = pos.endsWith("left");
              const isRight = pos.endsWith("right");
              const isActive = activeHandle === pos;

              return (
                <div
                  key={pos}
                  onPointerDown={(e) => startResize(e, pos)}
                  className={cn(
                    "absolute z-10 image-resize-handle",
                    // Visible dot
                    "after:absolute after:w-3 after:h-3 after:rounded-sm",
                    "after:border-2 after:border-white after:bg-accent-500 after:shadow-md",
                    "after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
                    // Scale up the visible dot on active resize
                    isActive
                      ? "after:scale-125 after:bg-accent-400"
                      : "after:scale-100",
                    "after:transition-transform after:duration-100",
                    // Hit area size: bigger on touch for easier grabbing
                    isTouch ? "w-10 h-10" : "w-5 h-5",
                    // Vertical position (centered on edge)
                    isTopRow && "-top-2.5 -translate-y-1/2",
                    isBottomRow && "-bottom-2.5 translate-y-1/2",
                    isMiddleRow && "top-1/2 -translate-y-1/2",
                    // Horizontal position (centered on edge)
                    isLeft && "-left-2.5 -translate-x-1/2",
                    isRight && "-right-2.5 translate-x-1/2",
                  )}
                  style={{
                    cursor: HANDLE_CURSORS[pos],
                    touchAction: "none", // Prevents scroll while dragging
                  }}
                />
              );
            })}

            {/* Subtle edge guides during resize for side handles */}
            {isResizing && activeHandle && (activeHandle.includes("left") || activeHandle.includes("right")) && (
              <div
                className={cn(
                  "absolute top-0 bottom-0 w-px bg-accent-500/40 pointer-events-none z-[5]",
                  activeHandle.includes("left") ? "left-0" : "right-0",
                )}
              />
            )}
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
