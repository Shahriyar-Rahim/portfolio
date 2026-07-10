import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import { HiArrowLeft } from "react-icons/hi";
import { useBlog } from "../lib/hooks/useBlogs";
import { useAddComment, useComments } from "../lib/hooks/useComments";
import { formatDate } from "../lib/helper/format";
import Loader from "../components/Loader";
import ErrorNotice from "../components/ErrorNotice";
import RevealOnScroll from "../components/RevealOnScroll";

export default function BlogDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useBlog(id);
  const blog = data?.data;

  const { data: commentsData, isLoading: commentsLoading } = useComments(id);
  const comments = commentsData?.data || [];
  const addComment = useAddComment(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => addComment.mutate(values, { onSuccess: () => reset() });

  if (isLoading) return <div className="pt-32"><Loader label="fetching post" /></div>;
  if (isError) return <div className="pt-32 max-w-3xl mx-auto px-6"><ErrorNotice message={error?.message} /></div>;
  if (!blog) return null;

  return (
    <article className="pt-32 pb-24 mx-auto max-w-3xl px-6">
      <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-sm text-ink-muted hover:text-copper-soft transition-colors mb-8">
        <HiArrowLeft /> back to blog
      </Link>

      <RevealOnScroll>
        <div className="flex items-center gap-3 font-mono text-xs text-ink-muted mb-4">
          <span className="text-copper">{blog.category}</span>
          <span>·</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-8">{blog.title}</h1>
        {blog.img && <img src={blog.img} alt={blog.title} className="w-full rounded-lg border border-line mb-8 object-cover max-h-96" />}
        <div className="text-ink-dim leading-relaxed whitespace-pre-line">{blog.description}</div>
      </RevealOnScroll>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="font-display text-xl text-ink font-medium mb-6">
          Comments {comments.length > 0 && <span className="text-ink-muted font-mono text-sm">({comments.length})</span>}
        </h2>

        {commentsLoading && <Loader label="fetching comments" />}

        <div className="space-y-5 mb-10">
          {comments.map((c) => (
            <div key={c._id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm text-copper-soft">{c.name}</span>
                <span className="font-mono text-xs text-ink-muted">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-ink-dim text-sm">{c.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-line bg-surface p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <input
                {...register("name", { required: true })}
                placeholder="Your name"
                className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none"
              />
              {errors.name && <p className="text-danger text-xs font-mono mt-1">Name is required</p>}
            </div>
            <div>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="you@example.com"
                className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none"
              />
              {errors.email && <p className="text-danger text-xs font-mono mt-1">Valid email is required</p>}
            </div>
          </div>
          <textarea
            rows={3}
            {...register("comment", { required: true })}
            placeholder="Add a comment…"
            className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-copper outline-none resize-none"
          />
          {errors.comment && <p className="text-danger text-xs font-mono -mt-2">Comment is required</p>}
          <button
            type="submit"
            disabled={addComment.isPending}
            className="rounded-md bg-copper px-5 py-2.5 font-mono text-sm text-bg font-medium hover:bg-copper-soft transition-colors disabled:opacity-50"
          >
            {addComment.isPending ? "posting…" : "post comment"}
          </button>
        </form>
      </section>
    </article>
  );
}
