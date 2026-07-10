import { Link } from "react-router";
import { useBlogs } from "../lib/hooks/useBlogs";
import BlogCard from "./BlogCard";
import Loader from "./Loader";
import ErrorNotice from "./ErrorNotice";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function BlogPreview() {
  const { data, isLoading, isError, error } = useBlogs();
  const blogs = (data?.data || []).slice(0, 3);

  return (
    <section id="blog" className="py-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <div className="flex items-end justify-between">
            <SectionHeading index="06" subtitle="writing" title="From the blog" />
            <Link to="/blog" className="font-mono text-sm text-copper-soft hover:underline mb-12 hidden sm:block">
              view all →
            </Link>
          </div>
        </RevealOnScroll>

        {isLoading && <Loader label="fetching posts" />}
        {isError && <ErrorNotice message={error?.message} />}
        {!isLoading && !isError && blogs.length === 0 && (
          <p className="font-mono text-sm text-ink-muted">No posts published yet.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <RevealOnScroll key={blog._id} delay={i * 0.08}>
              <BlogCard blog={blog} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
