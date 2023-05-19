import { Avatar, Box, Card, CardContent, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";
import { SitClass } from "../types/sitTypes";
import { simpleTimeStringFromISO } from "../utils/timeUtils";
import { hexWithOpacityToRgb } from "../utils/colorUtils";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { ClassConfig } from "../types/rezervoTypes";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

export type AgendaClass = {
    config: ClassConfig;
    sitClass: SitClass | undefined;
    markedForDeletion: boolean;
};

export default function AgendaClassItem({
    agendaClass,
    onSetToDelete,
    onInfo,
}: {
    agendaClass: AgendaClass;
    // eslint-disable-next-line no-unused-vars
    onSetToDelete: (toDelete: boolean) => void;
    onInfo: () => void;
}) {
    const theme = useTheme();

    const classColorRGB = agendaClass.sitClass
        ? `rgb(${hexWithOpacityToRgb(
              agendaClass.sitClass.color,
              agendaClass.markedForDeletion ? 0.3 : 0.6,
              theme.palette.mode === "dark" ? 0 : 255
          ).join(",")})`
        : agendaClass.markedForDeletion
        ? "#696969"
        : "#111";

    const displayName = agendaClass.sitClass?.name ?? agendaClass.config.display_name;

    const configTime = new Date();
    configTime.setHours(agendaClass.config.time.hour);
    configTime.setMinutes(agendaClass.config.time.minute);
    const timeFrom = simpleTimeStringFromISO(
        agendaClass.sitClass?.from ? agendaClass.sitClass?.from : configTime.toISOString()
    );

    const timeTo = agendaClass.sitClass?.to ? simpleTimeStringFromISO(agendaClass.sitClass?.to) : null;

    return (
        <Card
            sx={{
                position: "relative",
                borderLeft: `0.4rem solid ${classColorRGB}`,
                backgroundColor: theme.palette.mode === "dark" ? "#111" : "white",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background:
                        agendaClass.sitClass === undefined
                            ? `repeating-linear-gradient(
                            -55deg,
                            ${theme.palette.background.default},
                            ${theme.palette.background.default} 10px,
                            ${theme.palette.background.paper} 10px,
                            ${theme.palette.background.paper} 20px)`
                            : undefined,
                }}
            >
                <CardContent
                    className={"unselectable"}
                    sx={{ paddingBottom: 2, opacity: agendaClass.markedForDeletion ? 0.3 : 1 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography sx={{ fontSize: "1.05rem" }}>{displayName}</Typography>
                            <Typography sx={{ fontSize: "0.85rem" }} variant="body2" color="text.secondary">
                                {`${timeFrom}${timeTo ? ` - ${timeTo}` : ""}`}
                            </Typography>
                            {agendaClass.sitClass && (
                                <Typography sx={{ fontSize: "0.85rem" }} variant="body2" color="text.secondary">
                                    {agendaClass.sitClass.studio.name}
                                </Typography>
                            )}
                            {agendaClass.sitClass && (
                                <Typography sx={{ fontSize: "0.85rem" }} variant="body2" color="text.secondary">
                                    {agendaClass.sitClass.instructors.map((i) => i.name).join(", ")}
                                </Typography>
                            )}
                        </Box>
                        {agendaClass.sitClass === undefined && (
                            <Tooltip title={"Spøkelsestime"}>
                                <Avatar
                                    alt={"Ghost class"}
                                    src={"/ghost.png"}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        marginLeft: 1,
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Box>
                </CardContent>
                <Box sx={{ display: "flex", marginRight: 2 }}>
                    {agendaClass.sitClass && (
                        <IconButton onClick={onInfo} size={"small"}>
                            <InfoOutlinedIcon />
                        </IconButton>
                    )}
                    {agendaClass.markedForDeletion ? (
                        <Tooltip title={"Angre sletting"}>
                            <IconButton onClick={() => onSetToDelete(false)} size={"small"}>
                                <RestoreFromTrashIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <IconButton onClick={() => onSetToDelete(true)} size={"small"}>
                            <DeleteRoundedIcon />
                        </IconButton>
                    )}
                    {/*<IconButton onClick={onSettings} size={"small"}>*/}
                    {/*    <SettingsOutlinedIcon/>*/}
                    {/*</IconButton>*/}
                </Box>
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    backgroundColor: theme.palette.mode === "dark" ? "#111" : "white",
                    zIndex: -1,
                }}
            />
        </Card>
    );
}
