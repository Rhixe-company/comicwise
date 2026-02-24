"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserGrowthChartProps {
  data: { month: string; users: number }[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} width="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface TopComicsChartProps {
  data: { title: string; views: number }[];
}

export function TopComicsChart({ data }: TopComicsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Viewed Comics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} width="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface GenreDistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function GenreDistributionChart({ data }: GenreDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comics by Genre</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="value"
              fill="8884d8"
              label={(entry: { name: string; percent: number }) =>
                `${entry.name} ${(entry.percent * 100).toFixed(0)}%`
              }
              labelLine={false}
              outerRadius={80}
            >
              {data.map((_entry, index) => (
                <Cell fill={COLORS[index % COLORS.length]} key={`cell-${index}`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ChapterPublishingChartProps {
  data: { chapters: number; date: string; }[];
}

export function ChapterPublishingChart({ data }: ChapterPublishingChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapter Publishing Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} width="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="chapters" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
