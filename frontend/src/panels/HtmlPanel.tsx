import { PanelProps } from "./registry";

export function HtmlPanel({ spec }: PanelProps<string>) {
  return <div dangerouslySetInnerHTML={{ __html: spec }}></div>;
}
