import { WifiOff } from "lucide-react";
import Button from "../../components/ui/Button";
import StatusPage from "../../components/common/StatusPage";

export default function Offline() {
  return (
    <StatusPage
      icon={WifiOff}
      title="You're offline"
      description="Check your internet connection and try again."
      secondaryAction={
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      }
    />
  );
}
