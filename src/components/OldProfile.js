import { IconButton, Tooltip} from '@mui/material';

export default function OldProfile () {
    return ((
            <div className="old-profile">
                <Tooltip title="Last called over 6 months ago">
                    <IconButton>
                        <span className="material-symbols-outlined">call_quality</span>
                    </IconButton>
                </Tooltip>
            </div>
        )
    )
}