import { Alert } from "@mui/material";

export interface ErrorAlertProps {
  error: unknown;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <Alert severity="error" slotProps={{ message: { sx: { whiteSpace: "pre-wrap" } } }}>
      {String(error)}
    </Alert>
  );
}
