import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import Loader from "../Loader";
import ErrorNotice from "../ErrorNotice";

export default function ResourceList({
  title,
  isLoading,
  isError,
  error,
  items,
  onAdd,
  onEdit,
  onDelete,
  renderItem,
  emptyLabel = "Nothing here yet.",
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-md bg-copper px-4 py-2 font-mono text-xs text-bg font-medium hover:bg-copper-soft transition-colors"
          >
            <HiOutlinePlus /> add
          </button>
        )}
      </div>

      {isLoading && <Loader label="loading" />}
      {isError && <ErrorNotice message={error?.message} />}
      {!isLoading && !isError && items?.length === 0 && (
        <p className="font-mono text-sm text-ink-muted">{emptyLabel}</p>
      )}

      <div className="space-y-3">
        {items?.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-4 rounded-lg border border-line bg-surface p-4"
          >
            <div className="min-w-0 flex-1">{renderItem(item)}</div>
            <div className="flex items-center gap-2 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-md p-2 text-ink-muted hover:text-signal-soft hover:bg-surface-raised transition-colors"
                  aria-label="Edit"
                >
                  <HiOutlinePencil />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item)}
                  className="rounded-md p-2 text-ink-muted hover:text-danger hover:bg-surface-raised transition-colors"
                  aria-label="Delete"
                >
                  <HiOutlineTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
