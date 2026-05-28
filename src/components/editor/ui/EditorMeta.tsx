import { formatDistanceToNow, format } from "date-fns";

interface EditorMetaProps {
  createdAt: Date | string;
  updatedAt: Date | string;
  tags: { id: string; name: string }[];
}

export function EditorMeta({ createdAt, updatedAt, tags }: EditorMetaProps) {
  return (
    <div className="flex items-center gap-2 px-6 pb-3 shrink-0 overflow-x-auto scrollbar-none">
      <span className="text-[11px] text-grey-500 tabular-nums shrink-0">
        {format(new Date(createdAt), "MMM d, yyyy")}
      </span>

      <span className="text-grey-300 text-[10px] shrink-0">·</span>

      <span className="text-[11px] text-grey-500 shrink-0">
        Edited {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
      </span>

      {tags.length > 0 && (
        <>
          <span className="text-grey-300 text-[10px] shrink-0">·</span>
          <div className="flex items-center gap-1 overflow-hidden">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag.id} className="tag-pill shrink-0">
                #{tag.name}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[11px] text-grey-500 shrink-0">
                +{tags.length - 2}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
