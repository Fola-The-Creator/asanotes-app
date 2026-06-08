import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

/**
 * TipTap extension that adds touch support for table column resizing.
 *
 * ProseMirror's column-resize plugin only handles mouse events.
 * This extension adds native touch listeners to the editor DOM and
 * translates touch gestures into synthetic mouse events:
 *
 *   touchstart on a column border → mousedown on editorView.dom
 *   touchmove → mousemove on window
 *   touchend → mouseup on window
 *
 * The mousedown is dispatched on view.dom so ProseMirror's handleDOMEvents
 * picks it up. After that, the column-resize plugin adds its own
 * mousemove/mouseup listeners on window, so we dispatch there.
 */

const tableTouchResizeKey = new PluginKey("tableTouchResize");

function createSyntheticMouse(type: string, touch: Touch, buttons = 1) {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: touch.clientX,
    clientY: touch.clientY,
    screenX: touch.screenX,
    screenY: touch.screenY,
    button: 0,
    buttons,
  });
}

/**
 * Check if a touch point is near a column resize handle.
 * Uses document.elementFromPoint to find what's under the finger,
 * then checks for the .column-resize-handle class.
 */
function isTouchOnResizeHandle(touch: Touch): boolean {
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!el) return false;
  // The element itself could be the handle, or we could be touching the
  // ::before pseudo-element hit area (which targets the handle element).
  return (
    el.classList.contains("column-resize-handle") ||
    el.closest(".column-resize-handle") !== null
  );
}

/**
 * Check if a touch point is near a column border in a table cell.
 * This is a fallback that checks if we're within ~12px of the right edge
 * of a table cell (where resize handles appear).
 */
function isTouchNearColumnBorder(touch: Touch): boolean {
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!el) return false;

  const cell = el.closest("td, th");
  if (!cell) return false;

  const rect = cell.getBoundingClientRect();
  const distanceFromRight = Math.abs(touch.clientX - rect.right);
  const distanceFromLeft = Math.abs(touch.clientX - rect.left);

  // Within 12px of either edge of the cell
  return distanceFromRight <= 12 || distanceFromLeft <= 12;
}

export const TableTouchResize = Extension.create({
  name: "tableTouchResize",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: tableTouchResizeKey,

        view(editorView) {
          let active = false;

          const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];

            // Check if touching a resize handle or near a column border
            if (
              !isTouchOnResizeHandle(touch) &&
              !isTouchNearColumnBorder(touch)
            ) {
              return;
            }

            // We're at a column border — prevent scrolling and start resize
            e.preventDefault();
            e.stopPropagation();
            active = true;

            // Dispatch mousedown on the editor DOM so ProseMirror's
            // column-resize plugin detects it via handleDOMEvents
            editorView.dom.dispatchEvent(
              createSyntheticMouse("mousedown", touch),
            );
          };

          const onTouchMove = (e: TouchEvent) => {
            if (!active || e.touches.length !== 1) return;
            e.preventDefault();

            // Column-resize plugin adds mousemove listeners on window
            window.dispatchEvent(
              createSyntheticMouse("mousemove", e.touches[0]),
            );
          };

          const onTouchEnd = (e: TouchEvent) => {
            if (!active) return;
            e.preventDefault();
            active = false;

            const touch = e.changedTouches[0];
            if (touch) {
              // Column-resize plugin adds mouseup listener on window
              window.dispatchEvent(
                createSyntheticMouse("mouseup", touch, 0),
              );
            }
          };

          const onTouchCancel = () => {
            if (!active) return;
            active = false;
          };

          // Use { passive: false } so we can call preventDefault()
          editorView.dom.addEventListener("touchstart", onTouchStart, {
            passive: false,
          });
          editorView.dom.addEventListener("touchmove", onTouchMove, {
            passive: false,
          });
          editorView.dom.addEventListener("touchend", onTouchEnd, {
            passive: false,
          });
          editorView.dom.addEventListener("touchcancel", onTouchCancel);

          return {
            destroy() {
              editorView.dom.removeEventListener("touchstart", onTouchStart);
              editorView.dom.removeEventListener("touchmove", onTouchMove);
              editorView.dom.removeEventListener("touchend", onTouchEnd);
              editorView.dom.removeEventListener("touchcancel", onTouchCancel);
            },
          };
        },
      }),
    ];
  },
});
