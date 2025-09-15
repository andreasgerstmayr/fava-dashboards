import { Alert } from "@mui/material";

export interface ErrorAlertProps {
  error: Error;
}

export function ErrorAlert(props: ErrorAlertProps) {
  const { error } = props;
  return <Alert severity="error">{error.message}</Alert>;
}
