import { useState } from "react";
import { useForm } from "react-hook-form";
import { formatDate } from "../../lib/helper/format";
import { useDeleteMessage, useInboxList, useUpdateInboxStatus } from "../../lib/hooks/useInbox";
import { inboxApi } from "../../lib/api/inbox.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Modal from "../../components/admin/Modal";
import FieldInput from "../../components/admin/FieldInput";
import Loader from "../../components/Loader";
import ErrorNotice from "../../components/ErrorNotice";

const STATUS_STYLES = {
  unread: "text-copper-soft bg-copper/10",
  read: "text-signal-soft bg-signal/10",
  replied: "text-ok bg-ok/10",
};

export default function Inbox() {
  const { data, isLoading, isError, error } = useInboxList();
  const messages = data?.data || [];
  const updateStatus = useUpdateInboxStatus();
  const deleteMessage = useDeleteMessage();
  const [active, setActive] = useState(null);

  const queryClient = useQueryClient();
  const replyMutation = useMutation({
    mutationFn: ({ id, payload }) => inboxApi.reply(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "list"] });
      toast.success("Reply sent.");
      setActive(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, reset } = useForm();

  const openMessage = (msg) => {
    setActive(msg);
    reset({ replyMessage: msg.reply || "" });
    if (msg.status === "unread") {
      updateStatus.mutate({ id: msg._id, payload: { status: "read" } });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Inbox</h1>

      {isLoading && <Loader label="loading messages" />}
      {isError && <ErrorNotice message={error?.message} />}
      {!isLoading && !isError && messages.length === 0 && (
        <p className="font-mono text-sm text-ink-muted">No messages yet.</p>
      )}

      <div className="space-y-3">
        {messages.map((msg) => (
          <button
            key={msg._id}
            onClick={() => openMessage(msg)}
            className="w-full text-left flex items-start justify-between gap-4 rounded-lg border border-line bg-surface p-4 hover:border-copper-soft transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-sm text-ink">{msg.name}</span>
                <span className="font-mono text-xs text-ink-muted truncate">{msg.email}</span>
              </div>
              <p className="font-mono text-xs text-copper-soft mb-1">{msg.subject}</p>
              <p className="text-ink-dim text-sm truncate">{msg.message}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`font-mono text-[10px] uppercase rounded-full px-2 py-0.5 ${STATUS_STYLES[msg.status]}`}>
                {msg.status}
              </span>
              <span className="font-mono text-xs text-ink-muted">{formatDate(msg.createdAt)}</span>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.subject}>
        {active && (
          <div className="space-y-4">
            <div className="font-mono text-xs text-ink-muted">
              from <span className="text-ink">{active.name}</span> · {active.email}
            </div>
            <p className="text-ink-dim text-sm leading-relaxed border-l-2 border-line pl-4">{active.message}</p>

            <form
              onSubmit={handleSubmit((values) =>
                replyMutation.mutate({ id: active._id, payload: values }),
              )}
              className="space-y-3 border-t border-line pt-4"
            >
              <FieldInput label="reply" name="replyMessage" textarea register={register} required />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={replyMutation.isPending}
                  className="rounded-md bg-copper px-4 py-2 font-mono text-xs text-bg font-medium hover:bg-copper-soft transition-colors disabled:opacity-50"
                >
                  {replyMutation.isPending ? "sending…" : "send reply"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this message?")) {
                      deleteMessage.mutate(active._id);
                      setActive(null);
                    }
                  }}
                  className="rounded-md border border-line px-4 py-2 font-mono text-xs text-danger hover:border-danger transition-colors"
                >
                  delete
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
