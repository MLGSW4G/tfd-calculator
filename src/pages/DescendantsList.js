// src/pages/DescendantsList.js
import React, { useState, useContext, useEffect } from "react";
import { LocalizationContext } from "../components/LocalizationContext";
import { Slider, Typography, Box } from "@mui/material";
import data from "../api/descendant.json";
import { getTranslation } from "../translations";
import { useNumberFormatter } from "../components/NumberFormatter";
import "../styles/styles.css";
import { PAGE_TITLE_FORMAT } from "../const";
import { Helmet } from "react-helmet";
import { DataGridPro } from "@mui/x-data-grid-pro";

const DescendantsList = () => {
    const { language } = useContext(LocalizationContext);
    const formatNumber = useNumberFormatter();
    const translations = getTranslation(language, "descendantsList");

    const pageTitleFormat = localStorage.getItem("pageTitleFormat") || PAGE_TITLE_FORMAT;
    const pageTitle = pageTitleFormat.replaceAll("{name}", getTranslation(language, "navTabs").descendantsList);

    const [descendantLevel, setDescendantLevel] = useState(() => {
        const cachedDescendantLevel = localStorage.getItem("descendantLevel");
        return cachedDescendantLevel ? JSON.parse(cachedDescendantLevel) : 1;
    });

    const columns = [
        { field: "id", headerName: translations.id, width: 100 },
        {
            field: "descendantIcon",
            headerName: translations.descendantIcon,
            width: 64,
            renderCell: (params) => <img src={params.row.descendantImageURL} alt={params.row.descendantName} style={{ width: 64, height: 64 }} />,
        },
        { field: "descendantImageURL", headerName: translations.descendantImageURL, width: 130 },
        {
            field: "descendantName",
            headerName: translations.descendantLabel,
            width: 130,
        },
        {
            field: "maxHp",
            headerName: translations["Max HP"],
            width: 120,
            valueFormatter: formatNumber,
        },
        {
            field: "maxShield",
            headerName: translations["Max Shield"],
            width: 120,
            valueFormatter: formatNumber,
        },
        {
            field: "maxMp",
            headerName: translations["Max MP"],
            width: 120,
            valueFormatter: formatNumber,
        },
        {
            field: "def",
            headerName: translations["DEF"],
            width: 120,
            valueFormatter: formatNumber,
        },
        {
            field: "shieldRecoveryOutofCombat",
            headerName: translations["Shield Recovery Out of Combat"],
            width: 120,
            valueFormatter: formatNumber,
        },
        {
            field: "shieldRecoveryInCombat",
            headerName: translations["Shield Recovery In Combat"],
            width: 120,
            valueFormatter: formatNumber,
        },
    ];

    const rows = data.map((item) => ({
        id: item.descendant_id,
        descendantName: translations.descendants[item.descendant_name],
        descendantImageURL: item.descendant_image_url,
        maxHp: item.descendant_stat[descendantLevel - 1].stat_detail[0]["stat_value"],
        maxShield: item.descendant_stat[descendantLevel - 1].stat_detail[1]["stat_value"],
        maxMp: item.descendant_stat[descendantLevel - 1].stat_detail[2]["stat_value"],
        def: item.descendant_stat[descendantLevel - 1].stat_detail[3]["stat_value"],
        shieldRecoveryOutofCombat: item.descendant_stat[descendantLevel - 1].stat_detail[4]["stat_value"],
        shieldRecoveryInCombat: item.descendant_stat[descendantLevel - 1].stat_detail[5] ? item.descendant_stat[descendantLevel - 1].stat_detail[5]["stat_value"] : 0,
    }));

    useEffect(() => {
        localStorage.setItem("descendantLevel", JSON.stringify(descendantLevel));
    }, [descendantLevel]);

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            <Box
                sx={{
                    margin: "auto",
                    justifyContent: "center",
                    width: "80%",
                    marginTop: "3%",
                }}
            >
                <Typography id="descendant-level-label">
                    {translations.descendantLevel}: {descendantLevel}
                </Typography>
                <Slider valueLabelDisplay="auto" value={descendantLevel} min={1} max={40} onChange={(e) => setDescendantLevel(e.target.value)} />

                <DataGridPro
                    columns={columns}
                    rows={rows}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                                descendantImageURL: false,
                            },
                        },
                    }}
                    rowHeight={64}
                    hideFooter
                />
            </Box>
        </>
    );
};

export default DescendantsList;
