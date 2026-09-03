import { useState, useEffect } from "react";
import { Inbox, Mail, CheckCircle, Trash2, Archive } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import ConfirmationDialog from "../../components/ui/ConfirmationDialog";
import EmptyState from "../../components/ui/EmptyState";
import { formatDate } from "../../utils/formatters";
import notify from "../../utils/toast";
import adminService from "../../services/admin.service";

const STATUS_BADGE = {
  NEW: { variant: "success", label: "New" },
  RESOLVED: { variant: "neutral", label: "Resolved" },
  ARCHIVED: { variant: "warning", label: "Archived" },
};

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMessages({ page, size: 15 });
      setMessages(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
    } catch (err) {
      console.error(err);
      notify.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateMessageStatus(id, status);
      notify.success(`Status updated to ${status.toLowerCase()}.`);
      await fetchMessages();
    } catch (err) {
      notify.error(err.response?.data?.message ?? "Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await adminService.deleteMessage(deleteDialog.id);
      notify.success("Message deleted.");
      setDeleteDialog(null);
      await fetchMessages();
    } catch (err) {
      notify.error(err.response?.data?.message ?? "Failed to delete message.");
      setDeleteDialog(null);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded bg-surface" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Messages</h1>
        <p className="mt-1 text-sm text-body">
          Contact form submissions from visitors.
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages yet"
          description="Contact form submissions will appear here."
        />
      ) : (
        <Card className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Message</TH>
                <TH>Date</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {messages.map((msg) => {
                const badge = STATUS_BADGE[msg.status] ?? STATUS_BADGE.NEW;
                return (
                  <TR key={msg.id}>
                    <TD className="font-medium whitespace-nowrap">{msg.name}</TD>
                    <TD className="text-body">{msg.email}</TD>
                    <TD className="max-w-[280px] truncate text-body text-sm">
                      {msg.message}
                    </TD>
                    <TD className="whitespace-nowrap text-body">
                      {formatDate(msg.createdAt)}
                    </TD>
                    <TD>
                      <Badge variant={badge.variant} dot>
                        {badge.label}
                      </Badge>
                    </TD>
                    <TD className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Reply via email */}
                        <a
                          href={`mailto:${msg.email}?subject=Re: Your message to ZipLink`}
                          className="rounded-lg p-1.5 text-body hover:bg-black/5 hover:text-heading"
                          title="Reply via email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>

                        {/* Toggle status */}
                        {msg.status === "NEW" ? (
                          <button
                            onClick={() => handleStatusChange(msg.id, "RESOLVED")}
                            className="rounded-lg p-1.5 text-body hover:bg-black/5 hover:text-accent"
                            title="Mark as resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        ) : msg.status === "RESOLVED" ? (
                          <button
                            onClick={() => handleStatusChange(msg.id, "NEW")}
                            className="rounded-lg p-1.5 text-body hover:bg-black/5 hover:text-accent"
                            title="Mark as new"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        ) : null}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteDialog(msg)}
                          className="rounded-lg p-1.5 text-body hover:bg-danger/10 hover:text-danger"
                          title="Delete message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </Card>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page + 1}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      )}

      <ConfirmationDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={handleDelete}
        title="Delete message"
        description="This message will be archived and permanently purged after 30 days."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
