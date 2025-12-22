// Minimal Recharts typings used by the app (narrow surface)
declare module "recharts" {
  import type * as React from "react";

  export interface LegendPayload {
    value?: string;
    type?: string;
    id?: string;
    color?: string;
  }

  export interface LegendProperties {
    payload?: LegendPayload[];
    layout?: "horizontal" | "vertical";
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
  }

  export interface BarProperties {
    dataKey?: string | number;
    barSize?: number;
    maxBarSize?: number;
    [key: string]: any;
  }

  export const Bar: React.FC<BarProperties>;
  export const BarChart: React.FC<any>;
  export const LineChart: React.FC<any>;
  export const Line: React.FC<any>;
  export const PieChart: React.FC<any>;
  export const Pie: React.FC<any>;
  export const ResponsiveContainer: React.FC<any>;
  export const Legend: React.FC<LegendProperties>;
  export const CartesianGrid: React.FC<any>;
  export const Cell: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;

  export default {} as any;
}
