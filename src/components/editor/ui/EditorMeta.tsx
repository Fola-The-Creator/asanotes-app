import { Calendar, Tag as TagIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface EditorMetaProps {
  createdAt: Date | string;
  updatedAt: Date | string;
  tags: { id: string; name: string }[];
}

export function EditorMeta({ createdAt, updatedAt, tags }: EditorMetaProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-grey-200 text-xs text-grey-500 overflow-x-auto shrink-0">
      <div className="flex items-center gap-1.5 shrink-0">
        <Calendar className="w-3.5 h-3.5" />
        <span>
          Created {format(new Date(createdAt), "MMM d, yyyy")}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span>
          Updated{" "}
          {formatDistanceToNow(new Date(updatedAt), {
            addSuffix: true,
          })}
        </span>
      </div>

      {tags.length > 0 && (
        <div className="hidden lg:flex items-center gap-1.5">
          <TagIcon className="w-3.5 h-3.5" />
          <div className="flex items-center gap-1">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-1.5 py-0.5 rounded-full bg-grey-200 text-grey-600"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
