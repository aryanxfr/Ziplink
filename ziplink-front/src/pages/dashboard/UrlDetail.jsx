import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Copy, Power, PowerOff } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/Table";
import LineChart from "../../components/ui/charts/LineChart";
import { formatDate, formatRelativeTime } from "../../utils/formatters";
import notify from "../../utils/toast";
import { ROUTES } from "../../constants/routes";
import urlService from "../../services/url.service";
import analyticsService from "../../services/analytics.service";

function groupClicksByDay(clicks) {
  const counts = {};
  (clicks || []).forEach((c) => {
    const day = new Date(c.clickedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    counts[day] = (counts[day] || 0) + 1;
  });
  return Object.entries(counts)
    .slice(-14)
    .map(([label, value]) => ({ label, value }));
}

export default function UrlDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expiresAtInput, setExpiresAtInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [urlData, clickData] = await Promise.all([
          urlService.getUrlById(id),
          analyticsService.getClickHistory(id, { page: 0, size: 100 }),
        ]);
        setUrl(urlData);
        setClicks(clickData?.content ?? []);
        if (urlData.expiresAt) {
          setExpiresAtInput(new Date(urlData.expiresAt).toISOString().slice(0, 16));
        }
      } catch (err) {
        notify.error(err.response?.data?.message ?? "Failed to load URL details.");
        navigate(ROUTES.URLS, { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateExpiry = async () => {
    if (!expiresAtInput) return;
    try {
      setSaving(true);
      const updated = await urlService.updateUrl(id, {
        expiresAt: new Date(expiresAtInput).toISOString(),
      });
      setUrl(updated);
      notify.success("Expiry date updated.");
    } catch (err) {
      notify.error(err.response?.data?.message ?? "Failed to update expiry.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      setToggling(true);
      if (url.active) {
        await urlService.deactivateUrl(id);
        setUrl((prev) => ({ ...prev, active: false }));
        notify.success("Link deactivated.");
      } else {
        await urlService.activateUrl(id);
        setUrl((prev) => ({ ...prev, active: true }));
        notify.success("Link activated.");
      }
    } catch (err) {
      notify.error(err.response?.data?.message ?? "Failed to toggle link status.");
    } finally {
      setToggling(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url.shortUrl);
    notify.success("Link copied to clipboard.");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-surface" />
        <div className="h-48 animate-pulse rounded-xl bg-surface" />
        <div className="h-64 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }

  if (!url) return null;

  const chartData = groupClicksByDay(clicks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.URLS)}
          className="flex items-center gap-1.5 text-sm font-medium text-body hover:text-heading"
        >
          <ArrowLeft className="h-4 w-4" /> Back to links
        </button>
      </div>

      {/* URL Info */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-heading">{url.shortUrl}</h1>
              {(() => {
                let status = url.active ? "active" : "inactive";
                if (url.expiresAt && new Date(url.expiresAt) < Date.now()) {
                  status = "expired";
                }
                
                const badges = {
                  active: { variant: "success", label: "Active" },
                  inactive: { variant: "neutral", label: "Inactive" },
                  expired: { variant: "warning", label: "Expired" }
                };
                
                return (
                  <Badge variant={badges[status].variant} dot>
                    {badges[status].label}
                  </Badge>
                );
              })()}
            </div>
            <p className="max-w-xl truncate text-sm text-body">{url.originalUrl}</p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-body/70">
              <span>Created {formatDate(url.createdAt)}</span>
              {url.expiresAt && <span>Expires {formatDate(url.expiresAt)}</span>}
              <span>{(url.clickCount ?? 0).toLocaleString()} clicks</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              as="a"
              href={url.shortUrl || url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Click Chart */}
      {chartData.length > 0 && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-heading">Clicks over time</h2>
          <LineChart data={chartData} height={180} />
        </Card>
      )}

      {/* Edit Controls */}
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-heading">Settings</h2>
        <div className="space-y-5">
          {/* Expiry */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-heading">Expiry date</label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={expiresAtInput}
                onChange={(e) => setExpiresAtInput(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <Button onClick={handleUpdateExpiry} isLoading={saving} size="sm">
                Save
              </Button>
            </div>
          </div>

          {/* Toggle active */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-heading">Link status</p>
              <p className="text-xs text-body">Inactive links stop redirecting visitors.</p>
            </div>
            <Button
              variant={url.active ? "danger" : "primary"}
              size="sm"
              onClick={handleToggleActive}
              isLoading={toggling}
            >
              {url.active ? (
                <><PowerOff className="mr-1.5 h-4 w-4" /> Deactivate</>
              ) : (
                <><Power className="mr-1.5 h-4 w-4" /> Activate</>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Click History Table */}
      {clicks.length > 0 && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-heading">Recent clicks</h2>
          <Table>
            <THead>
              <TR>
                <TH>Time</TH>
                <TH>IP Address</TH>
                <TH>Referrer</TH>
              </TR>
            </THead>
            <TBody>
              {clicks.slice(0, 20).map((click) => (
                <TR key={click.id}>
                  <TD className="text-body">{formatRelativeTime(click.clickedAt)}</TD>
                  <TD className="font-mono text-xs text-body">{click.ipAddress ?? "—"}</TD>
                  <TD className="max-w-[200px] truncate text-body">{click.referer ?? "Direct"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
