import { useParams, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { getActiveCallers, getArchivedCallers } from '../api.js';
import { formatPhoneNumber, getName } from '../components/utils.js';

const callerQueries = {
    caller: getActiveCallers,
    archive: getArchivedCallers
}

export default function Caller() {
    const { pathname } = useLocation(),
            params = pathname.split('/'),
            type = params[1],
            callerId = params[2],
            data = useQuery({queryKey: [type], queryFn: callerQueries[type]}),
            caller = data.isSuccess ? data.data.find(caller => caller.id === callerId) : undefined;

    console.log(data, caller);

    function handleReactivate() {
        console.log('reactivate');
    }

    function Action() {
        return (
            caller.archived.isArchived ? (
                <Button variant="contained" disableElevation onClick={handleReactivate}>
                    Reactivate
                </Button>
            ) : (
                <>
                    <Button variant="contained" disableElevation onClick={handleReactivate}>
                        Edit
                    </Button>
                    <Button variant="text" disableElevation onClick={handleReactivate}>
                        Archive
                    </Button>
                </>
            )
        )
    }

    function Name() {
        return (
            <h1 className="font-page-heading">
                { getName(caller.firstName, caller.lastName) }
                { caller.archived.isArchived && (
                    <span className="font-page-heading-light italic"> (archived)</span>
                )}
            </h1>
        )
    }

    function PhoneNumbers() {
        return caller.phoneNumbers.map(number => {
            return (
                <span>{formatPhoneNumber(number)}</span>
            );
        });
    }

    return (
        data.isSuccess ? (
            <div className="caller-details">
                <Name />
                <Action/>
                <PhoneNumbers/>
            </div>
        ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '500px' }}>
                <CircularProgress />
            </Box>
        )
    )
}