// pages/SkillsList.js
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import jsonData from "./SkillsList.json";
import { numberToMeters, numberToPercents, numberToSeconds } from "../Utils";

const columns = [
  { field: "descendant", headerName: "Descendant Name", width: 130 },
  { field: "skillName", headerName: "Skill Name", width: 150 },
  { field: "skillNumber", headerName: "Skill №", width: 60 },
  { field: "skillElement", headerName: "Skill Element", width: 120 },
  { field: "skillType", headerName: "Skill Type", width: 120 },
  {
    field: "cooldown",
    headerName: "cooldown",
    width: 130,
    valueFormatter: numberToSeconds,
  },
  { field: "cost1", headerName: "cost1", width: 100 },
  { field: "cost2", headerName: "cost2", width: 100 },
  {
    field: "duration1",
    headerName: "duration1",
    width: 100,
    valueFormatter: numberToSeconds,
  },
  {
    field: "duration2",
    headerName: "duration2",
    width: 100,
    valueFormatter: numberToSeconds,
  },
  {
    field: "interval",
    headerName: "interval",
    width: 100,
    valueFormatter: numberToSeconds,
  },
  {
    field: "range1",
    headerName: "range1",
    width: 100,
    valueFormatter: numberToMeters,
  },
  {
    field: "range2",
    headerName: "range2",
    width: 100,
    valueFormatter: numberToMeters,
  },
  {
    field: "modifier1",
    headerName: "modifier1",
    width: 120,
    valueFormatter: numberToPercents,
  },
  { field: "modifier2", headerName: "modifier2", width: 120, valueFormatter: numberToPercents },
  { field: "modifier3", headerName: "modifier3", width: 120, valueFormatter: numberToPercents },
  { field: "modifier4", headerName: "modifier4", width: 120, valueFormatter: numberToPercents },
];

const rows = jsonData.map((item) => ({
  id: item.id,
  descendant: item.descendant,
  skillName: item.skillName,
  skillNumber: item.skillNumber,
  skillElement: item.skillElement,
  skillType: item.skillType,
  cooldown: item.cooldown,
  cost1: item.cost1,
  cost2: item.cost2,
  duration1: item.duration1,
  duration2: item.duration2,
  interval: item.interval,
  range1: item.range1,
  range2: item.range2,
  modifier1: item.modifier1,
  modifier2: item.modifier2,
  modifier3: item.modifier3,
  modifier4: item.modifier4,
}));

// Sort the rows
export const sortedRows = [...rows].sort((a, b) => {
  if (a.descendant < b.descendant) return -1;
  if (a.descendant > b.descendant) return 1;
  return a.skillNumber - b.skillNumber; // Sort by skillNumber if descendants are the same
});

export default function DataTable() {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={sortedRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
      />
    </div>
  );
}
