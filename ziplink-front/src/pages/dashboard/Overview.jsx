import { useNavigate } from "react-router-dom";
import { Link2, MousePointerClick, Users, TrendingUp, Plus, ArrowRight, Activity, Zap } from "lucide-react";
import StatsCard from "../../components/ui/StatsCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

import dashboardService from "../../services/dashboard.service";
import urlService from "../../services/url.service"
import CreateUrlModal from "../../components/url/CreateUrlModal";

import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard, SkeletonRow } from "../../components/ui/Skeleton";
import { formatRelativeTime } from "../../utils/formatters";
import { useEffect, useState } from "react";
import notify from "../../utils/toast";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

function getHealthIndicator(url) {
  if (url.expiresAt && new Date(url.expiresAt) < Date.now()) {
    return { color: "bg-red-400", label: "Expired" };
  }
  if (!url.active) {
    return { color: "bg-red-400", label: "Inactive" };
  }
  if ((url.clickCount ?? 0) > 0) {
    return { color: "bg-emerald-400", label: "Healthy" };
  }
  return { color: "bg-amber-400", label: "No clicks yet" };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Overview() {
  const [createOpen, setCreateOpen]= useState(false)
  const [analytics, setAnalytics]= useState(null)
  const [recentUrls,setRecentUrls]=useState([])
  const [topUrls, setTopUrls] = useState([])
  const [expiringSoon, setExpiringSoon]= useState([])
  const [loading, setLoading]= useState(true)
  const [error,setError]=useState(null)

  const navigate=useNavigate();
  const { user } = useAuth();

  const hasUrls = recentUrls.length > 0;

  const fetchDashboard = async () => {
    try{
      setLoading(true);
      setError(null);
      const dashboard=await dashboardService.getDashboardData();
      setAnalytics(dashboard.analytics);
      setRecentUrls(dashboard.recentUrls);
      setTopUrls(dashboard.topUrls);
      setExpiringSoon(dashboard.expiringSoon);
    }catch(err){
      console.error(err);
      setError(err);
    } finally{
      setLoading(false);
    }
  };

  if(error){
    return(
      <EmptyState
      icon={Link2}
      title="Unable to load dashboard"
      description="Something went wrong while loading your dashboard"
      actionLabel="Retry"
      onAction={fetchDashboard}
      />
    )
  }

  const handleCreateUrl=async(data)=>{
    try{
      await urlService.createUrl(data);
      setCreateOpen(false)
      fetchDashboard();
    }catch(err){
      console.error(err);
      notify.error(err.response?.data?.message ?? "Failed to create link.");
      throw err;
    }
  }

  useEffect(()=>{
    fetchDashboard();
  },[])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-heading">
            {getGreeting()}, {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-body">
            {hasUrls
              ? `You have ${analytics?.activeUrls ?? 0} active links generating ${(analytics?.totalClicks ?? 0).toLocaleString()} clicks.`
              : "A snapshot of how your links are performing."}
          </p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>
          Create link
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          Array.from({length: 5}).map((_,index)=>(
            <SkeletonCard key={index}/>
          ))
        ):(
          <>
            <StatsCard 
            label="Total URLs"
            value={analytics?.totalUrls ?? 0}
            icon={Link2}
            />

            <StatsCard
            label="Active URLs"
            value={analytics?.activeUrls ?? 0}
            icon={Zap}
            />

            <StatsCard
            label="Inactive URLs"
            value={analytics?.inactiveUrls ?? 0}
            icon={Users}
            />

            <StatsCard
            label="Expired URLs"
            value={analytics?.expiredUrls ?? 0}
            icon={Activity}
            />

            <StatsCard
            label="Total Clicks"
            value={analytics?.totalClicks ?? 0}
            icon={MousePointerClick}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold text-heading">Recent URLs</h2>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={()=> navigate(ROUTES.URLS)}>
              View all
            </Button>
          </div>
          <div className="p-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : hasUrls ? (
              recentUrls.map((url) => {
                const health = getHealthIndicator(url);
                return (
                <div
                  key={url.id}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors cursor-pointer hover:bg-background/50"
                  onClick={() => navigate(ROUTES.URL_DETAIL.replace(":id", url.id))}
                >
                  <div className="flex items-center gap-3">
                    {/* Health dot */}
                    <span className="relative flex h-2.5 w-2.5 shrink-0" title={health.label}>
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${health.color} opacity-40`} />
                      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${health.color}`} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-heading">{url.shortUrl}</p>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-body">{url.originalUrl}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-body">{url.clickCount?.toLocaleString() ?? 0} clicks</span>
                    
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
                </div>
              )})
            ) : (
              <EmptyState
                icon={Link2}
                title="No links yet"
                description="Create your first short link to start tracking clicks."
                actionLabel="Create link"
                onAction={() => setCreateOpen(true)}
              />
            )}
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold text-heading">Top performing</h2>
          </div>
          <div className="space-y-4 p-6">
            {topUrls.length === 0 && !loading ? (
              <p className="text-sm text-body py-4 text-center">No data yet.</p>
            ) : (
              topUrls.map((url, index) => (
              <div key={url.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-accent">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-heading">{url.shortUrl}</p>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-border">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${
                        ((url.clickCount ?? 0) / 
                          (topUrls[0]?.clickCount || 1)) * 100}%`, }}
                    />
                  </div>
                </div>

                <span className="shrink-0 text-xs text-body">{url.clickCount}</span>
              </div>
            )))}
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-heading">
            Expiring Soon
          </h2>
        </div>

        {loading ? (
          <div className="p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : expiringSoon.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No expiring links"
            description="You don't have any links expiring soon."
          />
        ) : (
          <div className="divide-y divide-border">
            {expiringSoon.map((url) => (
              <div
                key={url.id}
                className="flex items-center justify-between px-6 py-3.5 cursor-pointer hover:bg-background/50 transition-colors"
                onClick={() => navigate(ROUTES.URL_DETAIL.replace(":id", url.id))}
              >
                <div>
                  <p className="font-medium text-heading">
                    {url.shortUrl}
                  </p>

                  <p className="text-xs text-body">
                    {url.originalUrl}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-amber-600">
                    {url.expiresAt
                      ? formatRelativeTime(url.expiresAt)
                      : "Never"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <CreateUrlModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateUrl}
      />
    </div>
  );
}
