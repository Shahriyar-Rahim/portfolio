import { Link } from "react-router";
import { formatDate, truncate } from "../lib/helper/format";

export default function BlogCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog._id}`}
      className="trace-border group rounded-lg border border-line bg-surface overflow-hidden flex flex-col h-full"
    >
      <div className="h-44 overflow-hidden border-b border-line">
        <img
          src={blog.img}
          alt={blog.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3 font-mono text-xs text-ink-muted">
          <span className="text-copper">{blog.category}</span>
          <span>·</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
        <h3 className="font-display text-lg text-ink font-medium mb-2 group-hover:text-copper-soft transition-colors">
          {blog.title}
        </h3>
        <p className="text-ink-dim text-sm leading-relaxed">
          {truncate(blog.shortDescription, 120)}
        </p>
      </div>
    </Link>
  );
}
