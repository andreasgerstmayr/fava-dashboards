import { Alert } from "@mui/material";

export interface ErrorAlertProps {
  error: Error;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <Alert severity="error" slotProps={{ message: { sx: { whiteSpace: "pre-wrap" } } }}>
      {error.message}
    </Alert>
  );
}
