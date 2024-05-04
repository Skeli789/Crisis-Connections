import { useState } from 'react';
import { useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Box, Checkbox, CircularProgress, FormControlLabel, TextField} from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getActiveCallers, getArchivedCallers } from '../api.js';
import { formatPhoneNumber, getLabelName, getName, sortByCallHistory } from '../components/utils.js';
import { fields, mapSelection } from '../components/fields.js';

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

    // function handleFieldChange(e) {
    //     console.log('handle change')
    // }

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
        const callLog = sortByCallHistory(caller.callHistory).map((log, i) => {
            return (
                <li key={log.dateTime}>
                    <h3 className="font-title">Call Log</h3>
                    <div className="caller-form-row">
                        {/* Call Date */}
                        <DateTimePicker id={`caller-log-date-${i}`} label="Date and Time" defaultValue={dayjs(log.dateTime)} variant={fieldVarient} readOnly={!isEditMode} />
                        {/* Call Service */}
                        <Autocomplete
                            disablePortal
                            id={`caller-log-service-${i}`}
                            variant={fieldVarient}
                            options={fields.services}
                            defaultValue={mapSelection(log.service)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
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

    function PersonalDetails() {
        const location = (
            <div className='caller-form-row'>
                <TextField id='city' label="City" variant={fieldVarient} value={caller.city} readOnly={!isEditMode} />
                <TextField id='county' label="County" variant={fieldVarient} value={caller.county} readOnly={!isEditMode} />
                <TextField id='zip' label="Zip" variant={fieldVarient} value={caller.zip} readOnly={!isEditMode} />
                <DatePicker id='caller-log-birthday' label="Birthday" defaultValue={dayjs(caller.birthday)} variant={fieldVarient} readOnly={!isEditMode} />
            </div>
        );

        const backgroundFields = ['gender', 'sexualOrientation', 'insurance', 'ethnicity'];

        const background = (
            <div className='caller-form-row'>
                { backgroundFields.map(field => {
                    return (
                        caller[field].map((selection, i) => {
                            return (
                                <Autocomplete
                                    key={`${field}-${selection}-${i}`}
                                    disablePortal
                                    freeSolo
                                    id={`${field}-${selection}-${i}`}
                                    variant={fieldVarient}
                                    options={fields[field]}
                                    defaultValue={mapSelection(selection)}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    readOnly={!isEditMode}
                                    renderInput={(params) => <TextField {...params} label={getLabelName(field)} />}
                                />
                            )
                        })
                    )
                })}
            </div>
        );

        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<span className="material-symbols-outlined">expand_more</span>}
                    aria-controls="personal-history-panel"
                    id="personal-history-header"
                >
                    <h2 className="font-heading">Personal History</h2>
                </AccordionSummary>
                <AccordionDetails>
                    {location}
                    {background}
                </AccordionDetails>
            </Accordion>
        )
    }

    function TreatmentHistory() {
        const treatments = caller.currentBehavioralTreatment.map((item, i) => {
            // undergoing, location, notes
            return (
                <li key={`treatment-${i}`}>
                    <h3 className="font-title">Treatment</h3>
                    <div className="caller-form-row">
                        {/* Undergoing */}
                        <Autocomplete
                            disablePortal
                            id={`caller-undergoing-${i}`}
                            variant={fieldVarient}
                            options={fields.treatmentUndergoing}
                            defaultValue={mapSelection(item.undergoing, false)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            readOnly={!isEditMode}
                            renderInput={(params) => <TextField {...params} label="Undergoing" />}
                        />
                        {/* Location */}
                        <TextField
                            id={`caller-treatment-location-${1}`}
                            label="Location"
                            multiline
                            variant={fieldVarient}
                            value={item.location}
                        />
                        {/* Notes */}
                        <TextField
                            id={`caller-treatment-notes-${1}`}
                            label="Notes"
                            multiline
                            variant={fieldVarient}
                            value={item.notes}
                        />
                    </div>
                </li>
            )
        });

        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<span className="material-symbols-outlined">expand_more</span>}
                    aria-controls="treatment-history-panel"
                    id="treatment-history-header"
                >
                    <h2 className="font-heading">Treatment History</h2>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {treatments}
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
                    <fieldset disabled={!isEditMode}>
                        <PersonalDetails/>
                    </fieldset>
                    <fieldset disabled={!isEditMode}>
                        <TreatmentHistory/>
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