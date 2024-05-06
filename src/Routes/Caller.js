import { forwardRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Box, Checkbox, CircularProgress, Input, InputLabel, FormControl, FormControlLabel, OutlinedInput, TextField} from '@mui/material';
import { IMaskInput } from 'react-imask';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getActiveCallers, getArchivedCallers, baseUser } from '../api.js';
import { getLabelName, getName, sortByCallHistory } from '../components/utils.js';
import { fields, mapSelection } from '../components/fields.js';

import '../styles/routes/Caller.css';


const callerQueries = {
    caller: getActiveCallers,
    archive: getArchivedCallers
}

const TextMaskCustom = forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(#00) 000 - 0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
});

export default function Caller() {
    // Page Info
    const { pathname } = useLocation(),
            params = pathname.split('/'),
            type = params[1],
            isNew = type === 'new',
            callerId = params[2];
    // State Variables
    const [isEditMode, setIsEditMode] = useState(isNew ? true : false);
    const [newUser, setNewUser] = useState({...baseUser});
    const [editedUser, setEditedUser] = useState({...baseUser});
    
    // Caller Variables
    const   data = useQuery({queryKey: [type], queryFn: callerQueries[type]}),
            caller = data.isSuccess ? data.data.find(caller => caller.id === callerId) : newUser;

    // Form Variables
    const fieldVarient = isEditMode ? 'outlined' :  'standard';
    const textAreaProps = { rows: 4, multiline: true, inputComponent: 'textarea' }; // using to avoid a known issue with MUI text field multiline throwing error on browser resize

    function handleReactivate() {
        setIsEditMode(true);
    }

    // const handleChange = (event) => {
    //     setValues({
    //       ...values,
    //       [event.target.name]: event.target.value,
    //     });
    //   };

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
                { isNew ? 'New User' : getName(caller.firstName, caller.lastName) }
                { caller.archived.isArchived && (
                    <span className="font-page-heading-light italic"> (archived)</span>
                )}
            </h1>
        )
    }

    function PhoneNumbers() {
        const numbers = isNew ? [''] : caller.phoneNumbers;

        return numbers.map( (number, i) => {
            // TODO: add +new

            return (
                <FormControl variant={fieldVarient} key={number}>
                    <InputLabel variant={fieldVarient} htmlFor={`phoneNumber-${i}`}>Phone Number</InputLabel>
                    {isEditMode ? (
                        <OutlinedInput
                            label="Phone Number"
                            defaultValue={number.toString()}
                            name={`phoneNumber-${i}`}
                            id={`phoneNumber-${i}`}
                            inputComponent={TextMaskCustom}
                            readOnly={!isEditMode}
                        />
                    ) : (
                        <Input
                            defaultValue={number.toString()}
                            name={`phoneNumber-${i}`}
                            id={`phoneNumber-${i}`}
                            inputComponent={TextMaskCustom}
                            readOnly={!isEditMode}
                        />
                    )}
                </FormControl>
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
                    defaultValue={isNew ? '' : firstName}
                    readOnly={!isEditMode}/>
                    {/* Todo: if not provided check, disable name field */}
                { isEditMode && 
                    <FormControlLabel className="additional" control={<Checkbox defaultChecked={!isNew && !caller.firstName} />} label="Not Provided" />
                }
                <TextField
                    id="lastName"
                    label="Last Name"
                    variant={fieldVarient}
                    defaultValue={isNew ? '' : lastName}
                    readOnly={!isEditMode}/>
                { isEditMode && 
                    <FormControlLabel className="additional" control={<Checkbox defaultChecked={!isNew && !caller.lastName} />} label="Not Provided" />
                }
            </>
        )
    }

    function CallHistory() {
        const callLog = sortByCallHistory(caller.callHistory).map((log, i) => {
            return (
                <li key={log.dateTime}>
                    <div className="history_header">
                        {/* <span aria-hidden="true" className="material-symbols-outlined">medical_services</span> */}
                        <span aria-hidden="true" className="material-symbols-outlined">call_log</span>
                        <h3 className="font-title">Call Log</h3>
                    </div>
                    <div className="history_content">
                        <div className="caller-form_row">
                            {/* Call Date */}
                            <DateTimePicker
                                className="history_content-date"
                                id={`caller-log-date-${i}`}
                                label="Date and Time"
                                defaultValue={dayjs(log.dateTime)}
                                variant={fieldVarient}
                                readOnly={!isEditMode}
                                slotProps={{ textField: { variant: fieldVarient } }}
                            />
                            {/* Call Service */}
                            <Autocomplete
                                className="history_content-service"
                                disablePortal
                                id={`caller-log-service-${i}`}
                                variant={fieldVarient}
                                options={fields.services}
                                defaultValue={mapSelection(log.service)}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                readOnly={!isEditMode}
                                renderInput={(params) => <TextField {...params} variant={fieldVarient} label="Service" />}
                            />
                            {/* Call With */}
                            <TextField id={`caller-log-with-${i}`} label="With" variant={fieldVarient} defaultValue={log.with} readOnly={!isEditMode} />
                            {/* Call Notes */}
                            <TextField
                                id={`caller-log-note-${1}`}
                                className="history_content-notes"
                                label="Notes"
                                InputProps={textAreaProps}
                                variant={fieldVarient}
                                defaultValue={log.notes}
                            />
                        </div>
                    </div>
                </li>
            )
        })

        return (
            <Accordion className="caller-form_section" defaultExpanded elevation={0} square>
                <AccordionSummary
                    expandIcon={<span className="material-symbols-outlined">expand_more</span>}
                    aria-controls="call-history-panel"
                    id="call-history-header"
                >
                    <h2 className="font-heading">Activity</h2>
                </AccordionSummary>
                <AccordionDetails>
                    <ul className="history">
                        {callLog}
                    </ul>
                </AccordionDetails>
            </Accordion>
        )
    }

    function PersonalDetails() {
        const location = (
            <div className="caller-form_row personal">
                <TextField
                    className='city'
                    id='city'
                    label="City"
                    variant={fieldVarient}
                    defaultValue={caller.city}
                    readOnly={!isEditMode} />
                <TextField
                    id='county'
                    label="County"
                    variant={fieldVarient}
                    defaultValue={caller.county}
                    readOnly={!isEditMode} />
                <TextField
                    id='zip'
                    label="Zip"
                    variant={fieldVarient}
                    defaultValue={caller.zip}
                    readOnly={!isEditMode} />
                <DatePicker
                    id='caller-log-birthday'
                    label="Birthday"
                    defaultValue={caller.birthday ? dayjs(caller.birthday) : null} 
                    variant={fieldVarient}
                    readOnly={!isEditMode}
                    slotProps={{ textField: { variant: fieldVarient } }}/>
            </div>
        );

        const backgroundFields = ['gender', 'sexualOrientation', 'insurance', 'ethnicity'];

        const background = (
            <div className="caller-form_row personal">
                {/* TODO: in read only show all answers of a type together, comma seperated */}
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
                                    renderInput={(params) => <TextField {...params} variant={fieldVarient} label={getLabelName(field)} />}
                                />
                            )
                        })
                    )
                })}
            </div>
        );

        return (
            <Accordion className="caller-form_section" defaultExpanded elevation={0} square>
                {/* TODO: default expand to false if no info set and in read only */}
                <AccordionSummary
                    expandIcon={<span className="material-symbols-outlined">expand_more</span>}
                    aria-controls="personal-history-panel"
                    id="personal-history-header"
                >
                    <h2 className="font-heading">Personal Information</h2>
                </AccordionSummary>
                <AccordionDetails>
                    {location}
                    {background}
                </AccordionDetails>
            </Accordion>
        )
    }

    function TreatmentHistory() {
        const data = caller.currentBehavioralTreatment.length > 0 ? caller.currentBehavioralTreatment : [
            {
                undergoing: '',
                location: '',
                notes: ''
            }
        ];
        const treatments = data.map((item, i) => {
            return (
                <li key={`treatment-${i}`}>
                    <div className="history_header">
                        <span aria-hidden="true" className="material-symbols-outlined">medical_services</span>
                        <h3 className="font-title">Treatment</h3>
                    </div>
                    <div className="history_content caller-form_row treatment">
                        {/* Undergoing */}
                        <Autocomplete
                            disablePortal
                            id={`caller-undergoing-${i}`}
                            variant={fieldVarient}
                            options={fields.treatmentUndergoing}
                            defaultValue={mapSelection(item.undergoing, false)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            readOnly={!isEditMode}
                            renderInput={(params) => <TextField {...params} readOnly={!isEditMode} variant={fieldVarient} label="Undergoing" />}
                        />
                        {/* Location */}
                        <TextField
                            id={`caller-treatment-location-${1}`}
                            label="Location"
                            InputProps={textAreaProps}
                            variant={fieldVarient}
                            defaultValue={item.location}
                        />
                        {/* Notes */}
                        <TextField
                            id={`caller-treatment-notes-${1}`}
                            label="Notes"
                            InputProps={textAreaProps}
                            variant={fieldVarient}
                            defaultValue={item.notes}
                        />
                    </div>
                </li>
            )
        });

        return (
            <Accordion className="caller-form_section" defaultExpanded elevation={0} square>
                <AccordionSummary
                    expandIcon={<span className="material-symbols-outlined">expand_more</span>}
                    aria-controls="treatment-history-panel"
                    id="treatment-history-header"
                >
                    <h2 className="font-heading">Treatment History</h2>
                </AccordionSummary>
                <AccordionDetails>
                    <ul className="history">
                        {treatments}
                    </ul>
                </AccordionDetails>
            </Accordion>
        )
    }

    function FormAction() {
        // TODO:  style and route actions
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

    return ( (data.isSuccess || isNew) ? (
            <div className="caller-details page-padding" data-is-edit={isEditMode}>
                <div className="caller-details-header">
                    <PageTitle />
                    <Action/>
                </div>
                {caller.archived.isArchived && (
                    <p className='archive-reason font-body italic'>
                        <span className='font-body-bold'>Archive Reason: </span>
                        {caller.archived.reason}
                    </p>
                )}
                <form action='' method="post" className="caller-form">
                    <fieldset className="caller-details_header" disabled={!isEditMode}>
                        <div className="caller-form_row phone">
                            <PhoneNumbers/>
                        </div>
                        <div className="caller-form_row name">
                            <Names/>
                        </div>
                        <div className="caller-form_row info">
                            <TextField
                                id="relevantInfo"
                                label="Relavent Information"
                                variant={fieldVarient}
                                defaultValue={caller.relevantInfo}
                                InputProps={textAreaProps}
                                readOnly={!isEditMode}
                            />
                            <TextField
                                id="specificInstructions"
                                label="Specific Instruction"
                                InputProps={textAreaProps}
                                variant={fieldVarient}
                                readOnly={!isEditMode}
                                defaultValue={caller.specificInstructions}
                            />
                        </div>
                    </fieldset>
                    <fieldset className="caller-form_section" disabled={!isEditMode}>
                        <CallHistory/>
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
                        <PersonalDetails/>
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
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