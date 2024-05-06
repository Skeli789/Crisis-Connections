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
    const   [isEditMode, setIsEditMode] = useState(isNew ? true : false),
            [newUser, setNewUser] = useState({...baseUser}),
            [editedUser, setEditedUser] = useState({...baseUser}),
            [isNotProvided, setIsNotProvided] = useState({firstName: false, lastName: false})
    
    // Caller Variables
    const   data = useQuery({queryKey: [type], queryFn: callerQueries[type]}),
            caller = data.isSuccess ? data.data.find(caller => caller.id === callerId) : newUser;

    // Form Variables
    const fieldVarient = isEditMode ? 'outlined' :  'standard';
    const textAreaProps = { rows: 4, multiline: true, inputComponent: 'textarea' }; // using to avoid a known issue with MUI text field multiline throwing error on browser resize
    const initialCheck = {
        firstName: !isNew && !caller.firstName,
        lastName: !isNew && !caller.lastName,
    };

    function handleReactivate() {
        setIsEditMode(true);
    }

    const handleNotProvided = (e) => {
        // let newParams = {
        //     ...isNotProvided
        // };
        // newParams[fieldName] = e.target.checked;
        // setIsNotProvided(newParams);
    };

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
                <span className="font-body-bold">Reactivate</span>
            </Button>
        );

        const active = (!isEditMode && (
                <>
                    <Button variant="contained" disableElevation onClick={handleReactivate}>
                        <span className="font-body-bold">Edit</span>
                    </Button>
                    <Button variant="text" disableElevation onClick={handleReactivate}>
                        <span className="font-body-bold">Archive</span>
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

        return numbers.map((number, i) => {
            // TODO: add +new
            let label = "Phone Number"
            label = i === 0 ? `${label} (Required)` : label;

            return (
                <FormControl variant={fieldVarient} key={number}>
                    <InputLabel variant={fieldVarient} htmlFor={`phoneNumber-${i}`}>{label}</InputLabel>
                    {isEditMode ? (
                        <OutlinedInput
                            label={label}
                            defaultValue={isNew ? undefined :  number.toString()}
                            name={`phoneNumber-${i}`}
                            id={`phoneNumber-${i}`}
                            inputComponent={TextMaskCustom}
                            readOnly={!isEditMode}
                        />
                    ) : (
                        <Input
                            defaultValue={isNew ? undefined :  number.toString()}
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
                    label="First Name (Required)"
                    variant={fieldVarient}
                    defaultValue={isNew ? undefined :  firstName}
                    readOnly={!isEditMode}
                    disabled={initialCheck.firstName || isNotProvided.firstName}
                />
                    {/* Todo: if not provided check, disable name field */}
                { isEditMode && 
                    <FormControlLabel className="additional" data-for="firstName" control={<Checkbox defaultChecked={initialCheck.firstName} />} label="Not Provided" onChange={handleNotProvided()} />
                }
                <TextField
                    id="lastName"
                    label="Last Name (Required)"
                    variant={fieldVarient}
                    defaultValue={isNew ? undefined :  lastName}
                    readOnly={!isEditMode}
                    disabled={initialCheck.firstName || isNotProvided.lastName}
                />
                { isEditMode && 
                    <FormControlLabel className="additional" control={<Checkbox defaultChecked={initialCheck.lastName} />} label="Not Provided" />
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
                                defaultValue={isNew ? undefined :  dayjs(log.dateTime)}
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
                                defaultValue={isNew ? undefined :  mapSelection(log.service)}
                                isOptionEqualToValue={isNew ? undefined : (option, value) => option.id === value.id}
                                readOnly={!isEditMode}
                                renderInput={(params) => <TextField {...params} variant={fieldVarient} label="Service" />}
                            />
                            {/* Call With */}
                            <TextField id={`caller-log-with-${i}`} label="With" variant={fieldVarient} defaultValue={isNew ? undefined :  log.with} readOnly={!isEditMode} />
                            {/* Call Notes */}
                            <TextField
                                id={`caller-log-note-${1}`}
                                className="history_content-notes"
                                label="Notes"
                                InputProps={textAreaProps}
                                variant={fieldVarient}
                                defaultValue={isNew ? undefined :  log.notes}
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
        const locationFields = ['city', 'county', 'zip'];
        const backgroundFields = ['gender', 'sexualOrientation', 'insurance', 'ethnicity'];
        const location = locationFields.map(field => {
                return (
                    <TextField
                        key={field}
                        className={field}
                        id={field}
                        label={getLabelName(field)}
                        variant={fieldVarient}
                        defaultValue={isNew ? undefined :  caller[field]}
                        readOnly={!isEditMode} />
                )
            }
        );
        const background = (
            <div className="caller-form_row personal">
                {/* TODO: in read only show all answers of a type together, comma seperated */}
                { backgroundFields.map(field => {
                    const backgroundData = isNew ? [''] : caller[field];
                    return (
                        backgroundData.map((selection, i) => {
                            return (
                                <Autocomplete
                                    key={`${field}-${selection}-${i}`}
                                    disablePortal
                                    freeSolo
                                    id={`${field}-${selection}-${i}`}
                                    variant={fieldVarient}
                                    options={fields[field]}
                                    defaultValue={isNew ? undefined :  mapSelection(selection)}
                                    isOptionEqualToValue={isNew ? undefined : (option, value) => {
                                        console.log(option, value);
                                        return option.id === value.id
                                    }}
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
                    <div className="caller-form_row personal">
                        {location}
                        <DatePicker
                            id='caller-log-birthday'
                            label="Birthday"
                            defaultValue={isNew ? undefined :  caller.birthday ? dayjs(caller.birthday) : null} 
                            variant={fieldVarient}
                            readOnly={!isEditMode}
                            slotProps={{ textField: { variant: fieldVarient } }}/>
                    </div>
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
                            defaultValue={isNew ? undefined : mapSelection(item.undergoing, false)}
                            isOptionEqualToValue={isNew ? undefined : (option, value) => {
                                console.log(option, value);
                                return option.id === value.id
                            }}
                            readOnly={!isEditMode}
                            renderInput={(params) => <TextField {...params} readOnly={!isEditMode} variant={fieldVarient} label="Undergoing" />}
                        />
                        {/* Location */}
                        <TextField
                            id={`caller-treatment-location-${1}`}
                            label="Location"
                            InputProps={textAreaProps}
                            variant={fieldVarient}
                            defaultValue={isNew ? undefined :  item.location}
                        />
                        {/* Notes */}
                        <TextField
                            id={`caller-treatment-notes-${1}`}
                            label="Notes"
                            InputProps={textAreaProps}
                            variant={fieldVarient}
                            defaultValue={isNew ? undefined :  item.notes}
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
                        <span className="font-body-bold">Cancel</span>
                    </Button>
                    <div className="caller-form_actions-save">
                        <Button variant="text" disableElevation onClick={handleFormSaveAnother}>
                            <span className="font-body-bold">Save & Add Another</span>
                        </Button>
                        <Button variant="contained" disableElevation onClick={handleFormSave}>
                            <span className="font-body-bold">Save</span>
                        </Button>
                    </div>
                </div>
            )
        )
    }

    return ( (data.isSuccess || isNew) ? (
            <div className="caller-details page-padding" data-is-edit={isEditMode}>
                {!isEditMode && (
                    <Button variant="text" disableElevation href="./">
                        <span className="font-body-bold">Back to caller list</span>
                    </Button>
                )}
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
                                label="Relavent Information (Required)"
                                variant={fieldVarient}
                                defaultValue={isNew ? undefined :  caller.relevantInfo}
                                InputProps={textAreaProps}
                                readOnly={!isEditMode}
                            />
                            <TextField
                                id="specificInstructions"
                                label="Specific Instruction (Required)"
                                InputProps={textAreaProps}
                                variant={fieldVarient}
                                readOnly={!isEditMode}
                                defaultValue={isNew ? undefined :  caller.specificInstructions}
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