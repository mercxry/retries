import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface IProps {
  message?: string;
}

export function AlertError(props: IProps) {
  return (
    <Alert
      variant="destructive"
      style={props.message ? {} : { display: "none" }}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Formula Error</AlertTitle>
      <AlertDescription>{props.message}</AlertDescription>
    </Alert>
  );
}
