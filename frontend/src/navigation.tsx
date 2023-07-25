import React from "react";
import { Dashboard } from "./types";

type NavigationProps = {
    dashboards: Dashboard[];
    dashboardId: number;
};

export const Navigation = ({ dashboards, dashboardId }: NavigationProps) => (
    <div className="headerline">
        {dashboards.map((dashboard, i) => (
            <h3 key={i}>{i == dashboardId ? dashboard.name : <a href={`?dashboard=${i}`}>{dashboard.name}</a>}</h3>
        ))}
    </div>
);
