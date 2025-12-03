import { DataGrid, DataGridProps, GridValidRowModel } from "@mui/x-data-grid";
import { PanelProps } from "./registry";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableSpec<R extends GridValidRowModel = any> = DataGridProps<R>;

export function TablePanel({ spec }: PanelProps<TableSpec>) {
  return <DataGrid {...spec} />;
}
