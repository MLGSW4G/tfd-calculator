// src/pages/SkillsList.js
import { React, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import jsonData from "./SkillsList.json";
import { numberToMeters, numberToPercents, numberToSeconds } from "../Utils";
import { LocalizationContext } from "../components/LocalizationContext";
import { getTranslation } from "../translations";

export const rows = jsonData.map((item) => ({
  id: item.id,
  descendantName: item.descendantName,
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

const SkillsList = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "skillsList");
  const translationsOverview = getTranslation(language, "overview");
  const translationsDescendantsList = getTranslation(language, "descendantsList");

  const columns = [
    { field: "id", headerName: translations.id, width: 60 },
    {
      field: "descendantName",
      headerName: translations.descendantName,
      width: 130,
      valueFormatter: (value) => {
        return translationsDescendantsList.descendants[value];
      },
    },
    { field: "skillNumber", headerName: translations.skillNumber, width: 50 },
    {
      field: "skillName",
      headerName: translations.skillName,
      width: 150,
      valueFormatter: (value) => {
        return translationsOverview.skillNames[value];
      },
    },
    {
      field: "skillElement",
      headerName: translations.skillElement,
      width: 120,
      valueFormatter: (value) => {
        return translationsOverview.skillElements[value];
      },
    },
    {
      field: "skillType",
      headerName: translations.skillType,
      width: 120,
      valueFormatter: (value) => {
        return translationsOverview.skillArcheTypes[value];
      },
    },
    { field: "cooldown", headerName: translations.cooldown, width: 130, valueFormatter: numberToSeconds },
    { field: "cost1", headerName: translations.cost1, width: 100 },
    { field: "cost2", headerName: translations.cost2, width: 100 },
    { field: "duration1", headerName: translations.duration1, width: 100, valueFormatter: numberToSeconds },
    { field: "duration2", headerName: translations.duration2, width: 100, valueFormatter: numberToSeconds },
    { field: "interval", headerName: translations.interval, width: 100, valueFormatter: numberToSeconds },
    { field: "range1", headerName: translations.range1, width: 100, valueFormatter: numberToMeters },
    { field: "range2", headerName: translations.range2, width: 100, valueFormatter: numberToMeters },
    { field: "modifier1", headerName: translations.modifier1, width: 120, valueFormatter: numberToPercents },
    { field: "modifier2", headerName: translations.modifier2, width: 120, valueFormatter: numberToPercents },
    { field: "modifier3", headerName: translations.modifier3, width: 120, valueFormatter: numberToPercents },
    { field: "modifier4", headerName: translations.modifier4, width: 120, valueFormatter: numberToPercents },
  ];

  return (
    <div style={{ width: "100%", margin: 0, padding: 0 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [
              { field: "descendantName", sort: "asc" },
              { field: "skillNumber", sort: "asc" },
            ],
          },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
      />
    </div>
  );
};

export default SkillsList;
