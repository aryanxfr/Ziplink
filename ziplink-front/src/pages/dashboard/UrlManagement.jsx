import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical, Copy, Power, PowerOff, Trash2, Link2 } from "lucide-react";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Dropdown from "../../components/ui/Dropdown";
import Pagination from "../../components/ui/Pagination";

import dashboardService from "../../services/dashboard.service";
import urlService from "../../services/url.service";
import CreateUrlModal from "../../components/url/CreateUrlModal";

import ConfirmationDialog from "../../components/ui/ConfirmationDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/Table";
import { formatDate } from "../../utils/formatters";
import { ROUTES } from "../../constants/routes";
import notify from "../../utils/toast";


const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired" },
];

function getUrlStatus(url) {
  if (url.expiresAt && new Date(url.expiresAt) < Date.now()) {
    return "expired";
  }
  return url.active ? "active" : "inactive";
}

const STATUS_BADGE = {
  active:  { variant: "success", label: "Active" },
  inactive: { variant: "neutral", label: "Inactive" },
  expired: { variant: "warning", label: "Expired" },
};


export default function UrlManagement() {
  const navigate = useNavigate();
  const [urls, setUrls]=useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page,setPage] = useState(0);
  const [size]=useState(10);
  const[totalPages, setTotalPages]=useState(0);
  const[loading, setLoading]=useState(false);
  const[initialLoad, setInitialLoad]=useState(true);
  const [error,setError]=useState(null);
  const [createOpen, setCreateOpen]= useState(false);
  const [dialog,setDialog]=useState(null);

  const searchTimer = useRef(null);
  const handleSearchChange = (v) => {
    setSearch(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(v);
      setPage(0);
    }, 300);
  };

  const fetchUrls= async () => {
    try{
      setLoading(true);
      setError(null);

      const response=await dashboardService.getUrls({
        page,
        size,
        search: debouncedSearch || undefined,
        status: status==="all" ? undefined : status.toUpperCase(),
      });
      setUrls(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
    } catch(err){
      console.error(err);
      setError(err);
    } finally{
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const dialogCopy = {
    delete: { title: "Delete link", description: "This link will be permanently deleted and stop redirecting. This can't be undone.", confirmLabel: "Delete link", variant: "danger" },
    deactivate: { title: "Deactivate link", description: "Visitors will no longer be redirected until you reactivate this link.", confirmLabel: "Deactivate", variant: "danger" },
    activate: { title: "Activate link", description: "This link will start redirecting visitors again immediately.", confirmLabel: "Activate", variant: "primary" },
  };

  const handleCreateUrl = async(data)=>{
    try{
      await urlService.createUrl(data);
      setCreateOpen(false);
      setPage(0);
      await fetchUrls(); 
    }catch(err){
      console.error(err);
      throw err;
    }
  };

  const handleDialogConfirm= async () => {
    if(!dialog) return;
    try{
      switch (dialog.type){
        case "delete":
          await urlService.deleteUrl(dialog.url.id);
          notify.success("Link deleted.");
          break;
        
        case "activate":
          await urlService.activateUrl(dialog.url.id);
          notify.success("Link activated.");
          break;
        
        case "deactivate":
          await urlService.deactivateUrl(dialog.url.id);
          notify.success("Link deactivated.");
          break;
        
        default:
          break;
      }
      setDialog(null);

      await fetchUrls();
    } catch(err){
      console.error(err);
      notify.error(err.response?.data?.message ?? "Action failed. Please try again.");
      setDialog(null);
    }
  }

   useEffect(()=>{
    fetchUrls();
  },[page,debouncedSearch,status])
 
  if(initialLoad){
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded bg-surface" />
        <div className="h-11 w-full max-w-sm animate-pulse rounded-2xl bg-surface" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  if(error){
    return(
      <EmptyState
        icon={Link2}
        title="Unable to load URLS"
        description="Something went wrong while fetching your URLs."
        actionLabel="Retry"
        onAction={fetchUrls}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-heading">URL Management</h1>
          <p className="mt-1 text-sm text-body">Search, filter, and manage every link in one place.</p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>
          Create link
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search by link or destination…" className="sm:max-w-sm" />
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(v) => { setStatus(v); setPage(0); }}
          className="sm:w-48"
        />
      </div>

      {loading && (
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      )}

      {!loading && urls.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No links found"
          description="Try adjusting your search or filters, or create a new link."
          actionLabel="Create link"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Short link</TH>
              <TH>Destination</TH>
              <TH>Clicks</TH>
              <TH>Status</TH>
              <TH>Created</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {urls.map((url) => {
              const urlStatus = getUrlStatus(url);
              const badge = STATUS_BADGE[urlStatus];
              return (
              <TR key={url.id} className="cursor-pointer hover:bg-surface/50" onClick={() => navigate(ROUTES.URL_DETAIL.replace(':id', url.id))}>
                <TD className="font-medium">{url.shortUrl}</TD>
                <TD className="max-w-[220px] truncate text-body">{url.originalUrl}</TD>
                <TD>{(url.clickCount ?? 0).toLocaleString()}</TD>
                <TD>
                  <Badge variant={badge.variant} dot>
                    {badge.label}
                  </Badge>
                </TD>
                <TD className="text-body">{formatDate(url.createdAt)}</TD>
                <TD className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    trigger={
                      <button className="rounded-lg p-1.5 hover:bg-black/5">
                        <MoreVertical className="h-4 w-4 text-body" />
                      </button>
                    }
                    items={[
                      { label: "Copy link", icon: Copy, onClick: async () => {
                        await navigator.clipboard.writeText(url.shortUrl);
                        notify.success("Link copied!");
                      } },
                      urlStatus === "expired"
                        ? { label: "Expired — can't activate", icon: Power, onClick: () => notify.error("Expired links cannot be reactivated. Update the expiry date first."), danger: true }
                        : url.active  
                          ? { label: "Deactivate", icon: PowerOff, onClick: () => setDialog({ type: "deactivate", url }) }
                          : { label: "Activate", icon: Power, onClick: () => setDialog({ type: "activate", url }) },
                      { label: "Delete", icon: Trash2, onClick: () => setDialog({ type: "delete", url }), danger: true },
                    ]}
                  />
                </TD>
              </TR>
            )})}
          </TBody>
        </Table>
      )}

      <Pagination page={page+1} totalPages={totalPages} onPageChange={(newPage)=> setPage(newPage-1)} />

      <CreateUrlModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateUrl}
      />

      <ConfirmationDialog
        isOpen={!!dialog}
        onClose={() => setDialog(null)}
        onConfirm={handleDialogConfirm}
        title={dialog ? dialogCopy[dialog.type].title : ""}
        description={dialog ? dialogCopy[dialog.type].description : ""}
        confirmLabel={dialog ? dialogCopy[dialog.type].confirmLabel : ""}
        variant={dialog?.type === "activate" ? "primary" : "danger"}
      />
    </div>
  );
}
