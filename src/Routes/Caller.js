import { useState } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Box, Checkbox, CircularProgress, FormControlLabel, TextField} from '@mui/material';
import { getActiveCallers, getArchivedCallers } from '../api.js';
import { formatDate, formatPhoneNumber, getName, serviceOptions } from '../components/utils.js';

const callerQueries = {
    caller: getActiveCallers,
    archive: getArchivedCallers
}

export default function Caller() {
    // State Variables
    const [isEditMode, setIsEditMode] = useState(false);
    // Caller Variables
    const { pathname } = useLocation(),
            params = pathname.split('/'),
            type = params[1],
            callerId = params[2],
            data = useQuery({queryKey: [type], queryFn: callerQueries[type]}),
            caller = data.isSuccess ? data.data.find(caller => caller.id === callerId) : undefined;

    // Form Variables
    const fieldVarient = isEditMode ? 'outlined' :  'standard';

    console.log(data, caller);

    function handleReactivate() {
        setIsEditMode(true);
    }

    function sendData() {
        console.log('send data');
    }

    function handleChange(e) {
        console.log('handle change')
    }

    function handleFormCancel() {
        // TODO: reset values
        setIsEditMode(false);
    }

    function handleFormSave() {
        console.log('save form')
    }

    function handleFormSaveAnother() {
        console.log('save form and add another')
    }

    // Sub Components
    function Action() {
        const archived = (
            <Button variant="contained" disableElevation onClick={handleReactivate}>
                Reactivate
            </Button>
        );

        const active = (!isEditMode && (
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

        return (
            caller.archived.isArchived ? archived : active
        )
    }

    function PageTitle() {
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
        return caller.phoneNumbers.map( (number, i) => {
            return (
                <TextField key={number} id={`phoneNumber-${i}`} label="Phone Number" variant={fieldVarient} value={formatPhoneNumber(number)} readOnly={!isEditMode} />
            );
        });
    }

    function Names() {
        const firstName = caller.firstName ? caller.firstName : 'Not Provided';
        const lastName = caller.lastName ? caller.lastName : 'Not Provided';
        return (
            <>
                <TextField
                    id="firstName"
                    label="First Name"
                    variant={fieldVarient}
                    value={firstName}
                    readOnly={!isEditMode}/>
                { isEditMode && 
                    <FormControlLabel control={<Checkbox defaultChecked={!caller.firstName} />} label="Not Provided" />
                }
                <TextField id="lastName" label="Last Name" variant={fieldVarient} value={lastName} readOnly={!isEditMode}/>
                { isEditMode && 
                    <FormControlLabel control={<Checkbox defaultChecked={!caller.lastName} />} label="Not Provided" />
                }
            </>
        )
    }

    function CallHistory() {
        const callLog = caller.callHistory.map((log, i) => {
            return (
                <li key={log.dateTime}>
                    <h3 className="font-title">Call Log</h3>
                    <div className="caller-form-row">
                        {/* Call Date */}
                        <TextField id={`caller-log-date-${i}`} label="Date and Time" variant={fieldVarient} value={formatDate(log.dateTime)} readOnly={!isEditMode} />
                        {/* Call Service */}
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={serviceOptions}
                            defaultValue={log.service}
                            readOnly={!isEditMode}
                            renderInput={(params) => <TextField {...params} label="Service" />}
                        />
                        {/* Call With */}
                        <TextField id={`caller-log-with-${i}`} label="With" variant={fieldVarient} value={log.with} readOnly={!isEditMode} />
                    </div>
                    {/* Call Notes */}
                    <TextField
                        id={`caller-log-note-${1}`}
                        label="Notes"
                        multiline
                        variant={fieldVarient}
                        value={log.notes}
                    />
                </li>
            )
        })

        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<span className="material-symbols-outlined">expand_more</span>}
                    aria-controls="call-history-panel"
                    id="call-history-header"
                >
                    <h2 className="font-heading">Activity</h2>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {callLog}
                    </ul>
                </AccordionDetails>
            </Accordion>
        )
    }

    function FormAction() {
        return (
            isEditMode && (
                <div className="caller-form_actions">
                    <Button variant="text" disableElevation onClick={handleFormCancel}>
                        Cancel
                    </Button>
                    <Button variant="text" disableElevation onClick={handleFormSaveAnother}>
                        Save & Add Another
                    </Button>
                    <Button variant="contained" disableElevation onClick={handleFormSave}>
                        Save
                    </Button>
                </div>
            )
        )
    }

    return (
        data.isSuccess ? (
            <div className="caller-details">
                <PageTitle />
                <Action/>
                <form action='' method="post" className="caller-form">
                    <fieldset disabled={!isEditMode}>
                        <div className="caller-form_row">
                            <PhoneNumbers/>
                        </div>
                        <div className="caller-form_row">
                            <Names/>
                        </div>
                        <div className="caller-form_row">
                            <TextField
                                id="relevantInfo"
                                label="Relavent Information"
                                multiline
                                variant={fieldVarient}
                                value={caller.relevantInfo}
                            />
                            <TextField
                                id="specificInstructions"
                                label="Specific Instruction"
                                multiline
                                variant={fieldVarient}
                                value={caller.specificInstructions}
                            />
                        </div>
                    </fieldset>
                    <fieldset disabled={!isEditMode}>
                        <CallHistory/>
                    </fieldset>
                    <FormAction/>
                </form>
            </div>
        ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '500px' }}>
                <CircularProgress />
            </Box>
        )
    )
}