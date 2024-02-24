import { Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Chunk } from "./models/Chunk";

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export const Card: FunctionComponent<Chunk> = ({ id, type, title, content, category }) => {
    const [side, setSide] = useState(false);

    function handleClick() {
        setSide(!side);
        console.log(side);
    }

    function handlePlayClick(event: any) {
        event.stopPropagation();
    }
    return (
        <div>

            <div className={`card ${side ? "side" : ""}`} onClick={handleClick}>
                <div className="front">{title}</div>
                <div className="back">
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, direction: 'rtl', marginTop: '0.5rem' }}>
                        <IconButton aria-label="play/pause" onClick={handlePlayClick}>
                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                        </IconButton>
                    </Box>
                    <Typography style={{ whiteSpace: "pre-line", fontSize: "1.2rem" }}>
                        {content}
                    </Typography>
                </div>
            </div>
        </div>
    );
}
