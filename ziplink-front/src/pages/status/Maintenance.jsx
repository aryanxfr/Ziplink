import { Wrench } from "lucide-react";
import StatusPage from "../../components/common/StatusPage";

export default function Maintenance() {
  return (
    <StatusPage
      icon={Wrench}
      title="We'll be right back"
      description="ZipLink is undergoing scheduled maintenance. Thanks for your patience."
    />
  );
}
