import { Alert } from "@mui/material";

export interface ErrorAlertProps {
  error: Error;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  return <Alert severity="error">{error.message}</Alert>;
}
