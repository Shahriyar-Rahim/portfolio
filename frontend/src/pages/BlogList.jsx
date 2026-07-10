import { useState } from "react";
import { useBlogs } from "../lib/hooks/useBlogs";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import ErrorNotice from "../components/ErrorNotice";
import RevealOnScroll from "../components/RevealOnScroll";

export default function BlogList() {
  const { data, isLoading, isError, error } = useBlogs();
  const blogs = data?.data || [];
  const [category, setCategory] = useState("all");

  const categories = ["all", ...new Set(blogs.map((b) => b.category))];
  const filtered = category === "all" ? blogs : blogs.filter((b) => b.category === category);

  return (
    <div className="pt-32 pb-24 mx-auto max-w-6xl px-6">
      <RevealOnScroll>
        <p className="font-mono text-sm text-copper mb-3">$ ls ./blog</p>
        <h1 className="font-display text-4xl font-semibold text-ink mb-8">Writing</h1>
      </RevealOnScroll>

      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-mono text-xs rounded-full border px-4 py-1.5 transition-colors ${
                category === cat
                  ? "border-copper text-copper-soft bg-copper/10"
                  : "border-line text-ink-muted hover:border-copper-soft"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading && <Loader label="fetching posts" />}
      {isError && <ErrorNotice message={error?.message} />}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="font-mono text-sm text-ink-muted">No posts found.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((blog, i) => (
          <RevealOnScroll key={blog._id} delay={i * 0.06}>
            <BlogCard blog={blog} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
