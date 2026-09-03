import { ServerCrash } from "lucide-react";
import Button from "../../components/ui/Button";
import StatusPage from "../../components/common/StatusPage";

export default function ServerError() {
  return (
    <StatusPage
      code="500"
      icon={ServerCrash}
      title="Something went wrong on our end"
      description="Our team has been notified. Please try again in a moment."
      secondaryAction={
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      }
    />
  );
}
