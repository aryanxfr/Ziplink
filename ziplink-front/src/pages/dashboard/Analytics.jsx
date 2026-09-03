import { useState,useEffect } from "react";
import { MousePointerClick, Globe2, Smartphone } from "lucide-react";

import analyticsService from "../../services/analytics.service";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import StatsCard from "../../components/ui/StatsCard";
import LineChart from "../../components/ui/charts/LineChart";
import EmptyState from "../../components/ui/EmptyState";
import { formatRelativeTime } from "../../utils/formatters";
import dashboardService from "../../services/dashboard.service";
import BarList from "../../components/ui/charts/BarList";
import DonutChart from "../../components/ui/charts/DonutChart";
import Pagination from "../../components/ui/Pagination";

const RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "365d", label: "Last year" },
];

function groupClicksByDay(clicks, rangeDays = 7) {
  const counts = {};
  (clicks || []).forEach((c) => {
    const day = new Date(c.clickedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    counts[day] = (counts[day] || 0) + 1;
  });

  const result = [];
  const now = new Date();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    result.push({ label, value: counts[label] || 0 });
  }
  return result;
}

function rangeToDays(range) {
  const map = { "7d": 7, "30d": 30, "90d": 90, "365d": 365 };
  return map[range] ?? 7;
}


export default function Analytics() {
  const [range, setRange] = useState("7d");
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");

  const [topUrls, setTopUrls] = useState([]);
  const [topUrlsLoading, setTopUrlsLoading] = useState(false);
  
  const [urlAnalytics, setUrlAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  const [clickHistory,setClickHistory] = useState([]);
  const [clickLoading, setClickLoading] = useState(false);
  
  const [clickPage,setClickPage]= useState(0);
  const [clickTotalPages, setClickTotalPages] = useState(0);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading]= useState(true)
  const [error, setError] = useState(null);

  const [deviceBreakdown, setDeviceBreakdown] = useState([]);
  const [browserBreakdown, setBrowserBreakdown] = useState([]);
  const [referrerBreakdown, setReferrerBreakdown] = useState([]);

  const getDateRange = (range) => {
    const to=new Date();
    const from=new Date();
    if(range==="7d"){
      from.setDate(to.getDate()-7);
    } else if(range==="30d"){
      from.setDate(to.getDate()-30);
    } else if(range==="90d"){
      from.setDate(to.getDate()-90);
    } else if(range==="365d"){
      from.setDate(to.getDate()-365);
    }
    return {from:from.toISOString(), 
      to:to.toISOString()
    };
  };

  const fetchTopUrls = async () => {
    try{
      setTopUrlsLoading(true);

      const response=await analyticsService.getTopUrls({
        page:0,
        size:10,
      });
      setTopUrls(response.content ?? []);
    } catch(err){
      console.error(err);
      setTopUrls([]);
    } finally{
      setTopUrlsLoading(false);
    }
  }
      

  const fetchClickHistory = async (urlId,page=0) => {
    if(!urlId) return;

    try{
      setClickLoading(true);

      const {from,to} = getDateRange(range);

      const response = await analyticsService.getClickHistory(urlId, {
        from,
        to,
        page,
        size: 500, // Fetch more clicks so the chart has data across the range
      });
      setClickHistory(response.content ?? []);
      setClickTotalPages(response.totalPages ?? 0);
      setClickPage(response.number ?? 0);
    } catch(err){
      console.error(err);
      setClickHistory([]);
      setClickTotalPages(0);
    } finally{
      setClickLoading(false);
    }
  }

  const fetchUrls= async () => {
    try{
      const response = await dashboardService.getUrls({
        page:0,
        size:100
      });
      const list = response.content ?? [];
      setUrls(list);

    } catch(err){
      console.error(err);
    }
  };

  const handleUrlChange =  (urlId) => {
    setSelectedUrl(urlId);
    setUrlAnalytics(null);
    setClickHistory([]);
    setClickPage(0);
    setDeviceBreakdown([]);
    setBrowserBreakdown([]);
    setReferrerBreakdown([]);
  }

  const fetchUrlAnalytics = async (urlId) => {
    if(!urlId) return;

    try{
      setAnalyticsLoading(true);
      const response = await dashboardService.getUrlAnalytics(urlId);

      setUrlAnalytics(response);

    } catch(err){
      console.error(err);
      setUrlAnalytics(null);
    } finally{
      setAnalyticsLoading(false);
    }
  };

  const fetchBreakdowns = async (urlId) => {
    if (!urlId) return;
    try {
      const [devices, browsers, referrers] = await Promise.all([
        analyticsService.getDeviceBreakdown(urlId),
        analyticsService.getBrowserBreakdown(urlId),
        analyticsService.getReferrerBreakdown(urlId),
      ]);
      setDeviceBreakdown((devices || []).map((d) => ({ label: d.category, value: d.count })));
      setBrowserBreakdown((browsers || []).map((d) => ({ label: d.category, value: d.count })));
      setReferrerBreakdown((referrers || []).map((d) => ({ label: d.category, value: d.count })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try{
      setLoading(true);
      setError(null);

      const response= await analyticsService.getSummary();

      setSummary(response)
    } catch(err){
      console.error(err);
      setError(err);

    } finally {
      setLoading(false);
    }
  };


  useEffect(()=>{
    fetchSummary();
    fetchUrls();
    fetchTopUrls();
  },[]);

  useEffect(()=>{
    if(!selectedUrl) return;

    fetchUrlAnalytics(selectedUrl);
    fetchClickHistory(selectedUrl, 0);
    fetchBreakdowns(selectedUrl);
  },[selectedUrl, range]);

  if(loading){
    return(
      <div className="flex items-center justify-center py-20">
        Loading...
      </div>
    )
  }

  if(error){
    return(
      <EmptyState
        icon={MousePointerClick}
        title="Unable to load analytics"
        description="Something went wrong while fetching analytics."
        actionLabel="Retry"
        onAction={fetchSummary}
      />
    );
  }

  

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Analytics</h1>
          <p className="mt-1 text-sm text-body">Understand how people find and click your links.</p>
        </div>
        <div className="flex gap-3">
          <Select options={RANGE_OPTIONS} value={range} onChange={(value)=>{setRange(value); setClickPage(0);}} className="sm:w-48" />
          <Select options={urls.map((url) =>({
            value:url.id,
            label:url.shortUrl,
          }))}
          value={selectedUrl}
          onChange={handleUrlChange}
          className="sm:w-72"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatsCard 
          label="Total clicks" 
          value={summary?.totalClicks ?? 0} 
          icon={MousePointerClick} 
         />
        <StatsCard 
          label="Total URLs" 
          value={summary?.totalUrls ?? 0} 
          icon={Globe2} 
        />
        <StatsCard
          label="Active URLs" 
          value={summary?.activeUrls ?? 0} 
          icon={Smartphone}
        />
      </div>
      {summary?.totalClicks === 0 ? (
          <EmptyState
            icon={MousePointerClick}
            title="No analytics yet"
            description="Once your links start receiving clicks, insights will appear here."
          />
        ) : (
          <>
            {selectedUrl && (
              <Card>
                <h2 className="mb-4 text-sm font-semibold text-heading">Clicks over time</h2>
                {clickLoading ? (
                  <div className="flex items-center justify-center py-12 text-body">Loading chart...</div>
                ) : (
                  <LineChart data={groupClicksByDay(clickHistory, rangeToDays(range))} height={180} />
                )}
              </Card>
            )}
          </>
        )}

      {!selectedUrl?(
        <EmptyState 
        icon={MousePointerClick}
        title="Select a URL"
        description="Choose one of your URLs to view detailed analytics."
        />
      ):(
      <>
      <Card>
        <h2 className="text-base font-semibold text-heading">
            Selected URL Details
        </h2>
        
        {analyticsLoading ? (
            <div className="py-8 text-center text-body">
                Loading URL analytics...
            </div>
        ) : !urlAnalytics ? (
            <div className="py-8 text-center text-body">
                Select a URL to view Analytics.
            </div>
        ):(
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs uppercase tracking-wide text-body">
                        Short URL
                    </p>

                    <p className="mt-1 text-sm font-medium text-heading break-all">
                        {urlAnalytics.shortUrl}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-body">
                        Original URL
                    </p>

                    <p className="mt-1 text-sm font-medium text-heading break-all">
                        {urlAnalytics.originalUrl}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-body">
                        Total Clicks
                    </p>

                    <p className="mt-1 text-lg font-semibold text-heading">
                        {urlAnalytics.clickCount}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-body">
                        Unique Visitors
                    </p>

                    <p className="mt-1 text-lg font-semibold text-heading">
                        {urlAnalytics.uniqueVisitors}
                    </p>
                </div>
            </div>
        )}
      </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-base font-semibold text-heading">
              Top URLs
            </h2>

            <div className="mt-6">
              {topUrlsLoading ? (
                <div className="py-8 text-center text-body">
                  Loading top URLs...
                </div>
              ) : topUrls.length === 0 ? (
                <div className="py-8 text-center text-body">
                  No URL analytics available.
                </div>
              ) : (
                <BarList
                  data={topUrls.map((url) => ({
                    label: url.shortUrl,
                    value: url.clickCount ?? 0,
                  }))}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Device, Browser & Referrer Breakdown Charts */}
        {(deviceBreakdown.length > 0 || browserBreakdown.length > 0 || referrerBreakdown.length > 0) && (
          <div className="grid gap-6 lg:grid-cols-3">
            {deviceBreakdown.length > 0 && (
              <Card>
                <h2 className="mb-6 text-base font-semibold text-heading">
                  Device Type
                </h2>
                <DonutChart data={deviceBreakdown} />
              </Card>
            )}
            {browserBreakdown.length > 0 && (
              <Card>
                <h2 className="mb-6 text-base font-semibold text-heading">
                  Browser
                </h2>
                <DonutChart data={browserBreakdown} />
              </Card>
            )}
            {referrerBreakdown.length > 0 && (
              <Card>
                <h2 className="mb-6 text-base font-semibold text-heading">
                  Top Referrers
                </h2>
                <DonutChart data={referrerBreakdown} />
              </Card>
            )}
          </div>
        )}

        <Card className="p-0">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold text-heading">
              Recent clicks
            </h2>
          </div>
        
          <div className="divide-y divide-border">
            {clickLoading ? (
              <div className="px-6 py-8 text-center text-body">
                Loading Click History...
              </div>
            ) : clickHistory.length===0 ? (
              <div className="px-6 py-8 text-center text-body">
                No click history available
              </div>
            ):(
              clickHistory.slice(0, 20).map((click)=>(
                <div key={click.id}
                className="flex flex-col justify-between gap-1 px-6 py-3.5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-medium text-heading">
                      {urlAnalytics?.shortUrl}
                    </p>

                    <p className="text-xs text-body">
                      {click.ipAddress ?? "Unknown IP"} .{" "}
                      {click.userAgent ?? "Unknown Device"}
                    </p>
                  </div>

                  <span className="text-xs text-body/70">
                    {formatRelativeTime(new Date(click.clickedAt))}
                  </span>
                </div>
              ))
            )}
          </div>

          {clickTotalPages >1 && (
            <div className="border-t border-border px-6 py-4"> 
              <Pagination
                page={clickPage+1}
                totalPages={clickTotalPages}
                onPageChange={(newPage)=> setClickPage(newPage-1)}
              />
            </div>
          )}
        </Card>
       </>
      )}
    </div>
  );
}
