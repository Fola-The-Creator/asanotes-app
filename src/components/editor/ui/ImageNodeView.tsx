"use client";

import { useRef, useCallback, useState } from "react";
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
  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback(
    (e: React.MouseEvent, handle: HandlePosition) => {
      if (!editor.isEditable) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth =
        imgRef.current?.offsetWidth ?? (node.attrs.width as number) ?? 400;
      const isLeft = handle.includes("left");

      setIsResizing(true);
      document.body.style.cursor = HANDLE_CURSORS[handle];
      document.body.style.userSelect = "none";

      const onMouseMove = (me: MouseEvent) => {
        const delta = isLeft ? startX - me.clientX : me.clientX - startX;
        const newWidth = Math.max(80, Math.round(startWidth + delta));
        updateAttributes({ width: newWidth });
      };

      const onMouseUp = () => {
        setIsResizing(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
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
      className={cn(
        "tiptap-image-wrapper relative inline-block my-4",
        isSelected && "is-selected",
      )}
    >
      <div
        className={cn(
          "relative rounded-md transition-all duration-150",
          isSelected && "ring-2 ring-accent-500 ring-offset-1",
          isResizing && "select-none",
        )}
        style={{ width: width ? `${width}px` : undefined, maxWidth: "100%" }}
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

        {/* Resize handles — only visible when selected and editable */}
        {isSelected && editor.isEditable && (
          <>
            {handles.map((pos) => {
              const isTopRow = pos.startsWith("top");
              const isBottomRow = pos.startsWith("bottom");
              const isMiddleRow = pos.startsWith("middle");
              const isLeft = pos.endsWith("left");
              const isRight = pos.endsWith("right");

              return (
                <div
                  key={pos}
                  onMouseDown={(e) => startResize(e, pos)}
                  className={cn(
                    "absolute w-3 h-3 rounded-sm border-2 border-white bg-accent-500 shadow-md z-10",
                    "transition-opacity opacity-100",
                    // Vertical position
                    isTopRow && "-top-1.5",
                    isBottomRow && "-bottom-1.5",
                    isMiddleRow && "top-1/2 -translate-y-1/2",
                    // Horizontal position
                    isLeft && "-left-1.5",
                    isRight && "-right-1.5",
                  )}
                  style={{ cursor: HANDLE_CURSORS[pos] }}
                />
              );
            })}
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
