import { forwardRef, useState, Fragment } from 'react';
import { useLocation } from "react-router-dom";
import { useQuery, useMutation } from '@tanstack/react-query';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Alert, Button, Box, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input, InputLabel, FormControl, FormControlLabel, OutlinedInput, Snackbar, TextField} from '@mui/material';
import { IMaskInput } from 'react-imask';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getActiveCallers, getArchivedCallers, pushNewCaller, baseUser } from '../api.js';
import { getLabelName, getName, sortByCallHistory } from '../components/utils.js';
import { fields, mapSelection } from '../components/fields.js';

import '../styles/routes/Caller.css';

const callerQueries = {
    caller: getActiveCallers,
    archive: getArchivedCallers
}

const textAreaProps = { rows: 4, multiline: true, inputComponent: 'textarea' }; // using to avoid a known issue with MUI text field multiline throwing error on browser resize

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

const PhoneField = ({number, index, fieldVarient, isEditMode, handleFieldChange, isNew}) => {
    let label = "Phone Number"
        label = index === 0 ? `${label} (Required)` : label;
    
    number = number.toString();

    return (
        <FormControl className="phone-group_field" variant={fieldVarient}>
            <InputLabel variant={fieldVarient} htmlFor={`phoneNumber-${index}`}>{label}</InputLabel>
            {isEditMode ? (
                <>
                    <OutlinedInput
                        label={label}
                        value={number}
                        name={`phoneNumber-${index}`}
                        id={`phoneNumber-${index}`}
                        inputComponent={TextMaskCustom}
                        readOnly={!isEditMode}
                        onBlur={(e) => handleFieldChange(e.target.value, index)}
                    />
                </>
            ) : (
                <Input
                    defaultValue={isNew ? undefined :  number.toString()}
                    name={`phoneNumber-${index}`}
                    id={`phoneNumber-${index}`}
                    inputComponent={TextMaskCustom}
                    readOnly={!isEditMode}
                />
            )}
        </FormControl>
    ); 
}

const PhoneNumbers = ({isNew, caller, fieldVarient, isEditMode}) => {
    const [numbers, setNumbers] = useState(isNew ? [''] : caller.phoneNumbers.map(num => num.toString()));
    const [allHaveValue, setAllHaveValue] = useState(numbers.every(num => num.length === 10));

    const addField = () => {
        setNumbers([...numbers, '']);
        setAllHaveValue(false);
    }

    function removeField(index) {
        setNumbers(numbers.filter((num, i) => i !== index));
    }

    const handleFieldChange = (newValue, i) => {
        let nums = numbers.map((existing, index) => { return index === i ? newValue.replace(/\D/g, "") : existing });
        setNumbers(nums);
        setAllHaveValue(nums.every(num => num.length === 10));
    }

    return (
        <>
            {numbers.map((number, i) => {
                return (
                    <div key={`${number}-${i}`} className="phone-group">
                        {(isEditMode && i !== 0) && (
                            <Button className="phone-group_remove" variant="text" disableElevation type='button' onClick={() => removeField(i)}>
                                <>
                                    <span aria-hidden="true" className="material-symbols-outlined red">cancel</span>
                                    <span className="a11y-text font-body-bold">Remove phone number:{number}</span>
                                </>
                            </Button>
                        )}
                        <PhoneField number={number} index={i} fieldVarient={fieldVarient} isEditMode={isEditMode} handleFieldChange={handleFieldChange} isFirst={i === 0} isNew={isNew}/>
                    </div>
                )
            })}
            {isEditMode && (
                <Button className="phone-group_add" variant="text" disableElevation disabled={!allHaveValue} onClick={addField}>
                    <span aria-hidden="true" className="material-symbols-outlined">add_circle</span>
                    <span className="font-body-bold">Add phone number</span>
                </Button>
            )}
        </>
    );
}

const Names = ({isNew, fieldVarient, isEditMode, initialCheck, handleFieldChange, caller}) => {
    const [firstName, setFirstName] = useState(isNew ? '' : (caller.firstName ? caller.firstName : 'Not Provided'));
    const [lastName, setLastName] = useState(isNew ? '' : (caller.lastName ? caller.lastName : 'Not Provided'));
    const [isNotProvided, setIsNotProvided] = useState({firstName: initialCheck.firstName, lastName: initialCheck.lastName});
    const fnCheck = isNotProvided.firstName;
    const lnCheck = isNotProvided.lastName;

    function handleFieldChange(e) {
        if (e.target.name === 'firstName') {
            setFirstName(e.target.value);
        } else if (e.target.name === 'lastName') {
            setLastName(e.target.value);
        }
    }

    function handleNotProvided(e) {
        const name = e.target.name.replace("na-", "");
        const isChecked = e.target.checked;
        let prop = {...isNotProvided};

        prop[name] = isChecked;
        setIsNotProvided(prop);
        
        if (name === 'firstName') {
            setFirstName(isChecked ? 'Not Provided' : '');
        } else if (name === 'lastName') {
            setLastName(isChecked ? 'Not Provided' : '');
        }
}

    return (
        <>
            <TextField
                id="firstName"
                name="firstName"
                label="First Name (Required)"
                variant={fieldVarient}
                value={firstName}
                readOnly={!isEditMode}
                disabled={isEditMode && isNotProvided.firstName}
                onChange={handleFieldChange}
            />
            { isEditMode && 
                <div className="additional">
                    <FormControlLabel name="na-firstName" control={<Checkbox checked={fnCheck} />} label="Not Provided" onChange={handleNotProvided} />
                </div>
            }
            <TextField
                id="lastName"
                name="lastName"
                label="Last Name (Required)"
                variant={fieldVarient}
                value={lastName}
                readOnly={!isEditMode}
                disabled={isEditMode && isNotProvided.lastName}
                onChange={handleFieldChange}
            />
            { isEditMode && 
                <div className="additional">
                    <FormControlLabel className="additional" name="na-lastName" control={<Checkbox checked={lnCheck} />} label="Not Provided" onChange={handleNotProvided} />
                </div>
            }
        </>
    )
}

const CallLog = ({log, index, isNew, fieldVarient, isEditMode, removeLog, handleFieldChange}) => {
    return (
        <>
            <div className="history_header">
                <span aria-hidden="true" className="material-symbols-outlined">call_log</span>
                <h3 className="font-title">Call Log</h3>
                {(isEditMode && log.showDelete) && (
                    <Button className="call-log_remove" variant="text" disableElevation type='button' onClick={() => removeLog()}>
                        <>
                            <span aria-hidden="true" className="material-symbols-outlined red">cancel</span>
                            <span className="a11y-text font-body-bold">Remove call log</span>
                        </>
                    </Button>
                )}
            </div>
            <div className="history_content">
                <div className="caller-form_row">
                    {/* Call Date */}
                    <DateTimePicker
                        className="history_content-date"
                        id={`caller-log-date-${index}`}
                        label="Date and Time"
                        defaultValue={isNew ? undefined :  dayjs(log.dateTime)}
                        variant={fieldVarient}
                        readOnly={!isEditMode}
                        onBlur={(e) => { handleFieldChange(e.target.value, 'dateTime', index) }}
                        slotProps={{ textField: { variant: fieldVarient } }}
                    />
                    {/* Call Service */}
                    <Autocomplete
                        className="history_content-service"
                        disablePortal
                        id={`caller-log-service-${index}`}
                        variant={fieldVarient}
                        options={fields.services}
                        defaultValue={isNew ? undefined :  mapSelection(log.service)}
                        isOptionEqualToValue={isNew ? undefined : (option, value) => option.id === value.id}
                        readOnly={!isEditMode}
                        onBlur={(e) => { handleFieldChange(e.target.value, 'service', index) }}
                        renderInput={(params) => <TextField {...params} variant={fieldVarient} label="Service" />}
                    />
                    {/* Call With */}
                    <TextField id={`caller-log-with-${index}`} label="With" variant={fieldVarient} defaultValue={isNew ? undefined :  log.with} readOnly={!isEditMode} onBlur={(e) => { handleFieldChange(e.target.value, 'with', index) }} />
                    {/* Call Notes */}
                    <TextField
                        id={`caller-log-note-${index}`}
                        className="history_content-notes"
                        label="Notes"
                        InputProps={textAreaProps}
                        variant={fieldVarient}
                        defaultValue={isNew ? undefined :  log.notes}
                        onBlur={(e) => { handleFieldChange(e.target.value, 'notes', index) }}
                    />
                </div>
            </div>
        </>
    )
} 

const CallHistory = ({isNew, fieldVarient, isEditMode, caller}) => {
    const initialEmpty = isNew || caller.callHistory.length === 0;
    // TODO: Prefill "with" name using login information, if possible
    const newLog = {dateTime: Date.now(), service: '', with: '', notes: '', showDelete: true};
    // TODO: Very duplicative of phone numbers, etc behavior. Can be consolidated?
    const [history, setHistory] = useState(initialEmpty ? [newLog] : caller.callHistory);

    const addLog = () => {
        setHistory([...history, newLog]);
    }

    function removeLog(index) {
        setHistory(history.filter((log, i) => i !== index));
    }

    const handleFieldChange = (newValue, field, i) => {
        let logs = history.map((existing, index) => { return index === i ? {...existing, [field]: newValue} : existing });
        setHistory(logs);
    }

    const callLog = sortByCallHistory(history).map((log, i) => {
        return (
            <li key={log.dateTime}>
                <CallLog log={log} index={i} isNew={isNew} fieldVarient={fieldVarient} isEditMode={isEditMode} removeLog={() => { removeLog(i) }} handleFieldChange={handleFieldChange} />
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
                {isEditMode && (
                    <Button className="call-history_add" variant="text" disableElevation onClick={addLog}>
                        <span aria-hidden="true" className="material-symbols-outlined">add_circle</span>
                        <span className="font-body-bold">Add call log</span>
                    </Button>
                )}
                <ul className="history">
                    {callLog}
                </ul>
            </AccordionDetails>
        </Accordion>
    )
}

const PersonalDetails = ({caller, isNew, fieldVarient, isEditMode}) => {
    const locationFields = ['city', 'county', 'zip'];
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
                <Background 
                    isNew={isNew}
                    caller={caller}
                    fieldVarient={fieldVarient}
                    isEditMode={isEditMode}
                />
            </AccordionDetails>
        </Accordion>
    )
}

const Background = ({isNew, caller, fieldVarient, isEditMode}) => { 
    const backgroundFields = ['gender', 'sexualOrientation', 'insurance', 'ethnicity'];
    let fieldValues = {};
    // Add empty fields if not provided
    backgroundFields.forEach(field => {
        if (caller[field].length === 0) {
            fieldValues = {
                ...fieldValues,
                [field]: ['']
            }
        } else {
            fieldValues[field] = caller[field];
        }
    });

    const [backgroundData, setBackgroundData] = useState(fieldValues);

    
    const addField = (field) => {
        const newObj = {...backgroundData, [field]: [...backgroundData[field], '']}
        setBackgroundData(newObj);
    }

    function removeField(field, index) {
        let newObj = {...backgroundData};
        newObj[field] = newObj[field].filter((item, i) => i !== index);
        setBackgroundData(newObj);
    }

    const handleFieldChange = (newValue, field, index) => {
        const newObj = {...backgroundData};
        newObj[field][index] = newValue;
        setBackgroundData(newObj);
    }

    return (
        backgroundFields.map(field => {
            const data = backgroundData[field];
            const fieldLabel = getLabelName(field);
            const disableAdd = data[data.length - 1].length === 0;

            return (
                <div key={field} className="personal-background">
                    { data.map((selection, i) => {
                        const isLast = isEditMode && i === data.length - 1;
                        return (
                            <Fragment key={`${field}-${selection}-${i}`}>
                                {(isEditMode && i !== 0) && (
                                    <Button className="personal-background_remove" variant="text" disableElevation type='button' onClick={() => removeField(field, i)}>
                                        <>
                                            <span aria-hidden="true" className="material-symbols-outlined red">cancel</span>
                                            <span className="a11y-text font-body-bold">Remove {field}</span>
                                        </>
                                    </Button>
                                )}
                                <Autocomplete
                                    disablePortal
                                    freeSolo
                                    id={`${field}-${selection}-${i}`}
                                    variant={fieldVarient}
                                    options={fields[field]}
                                    value={mapSelection(selection)}
                                    isOptionEqualToValue={isNew ? undefined : (option, value) => option.id === value.id}
                                    readOnly={!isEditMode}
                                    forcePopupIcon={true}
                                    onBlur={(e) => { handleFieldChange(e.target.value, field, i) }}
                                    renderInput={(params) => <TextField {...params} variant={fieldVarient} label={fieldLabel} />}
                                />
                                {isLast && (
                                    <Button className="personal-background_add" variant="text" disableElevation disabled={disableAdd} onClick={() => {addField(field)}}>
                                        <span aria-hidden="true" className="material-symbols-outlined">add_circle</span>
                                        <span className="font-body-bold">Add {field === 'sexualOrientation' ? 'Orientation' : fieldLabel}</span>
                                    </Button>
                                )}
                            </Fragment>
                        )
                    })
                }
            </div>
            )
        })
    );
}

const TreatmentHistory = ({isNew, caller, fieldVarient, isEditMode}) => {
    const newTreatment = {
        undergoing: '',
        location: '',
        notes: '',
        showDelete: true
    };
    const [data, setData] = useState(caller.currentBehavioralTreatment.length > 0 ? caller.currentBehavioralTreatment : [newTreatment]);

    const addTreatment = () => {
        setData([...data, newTreatment]);
    }

    const removeItem = (index) => {
        setData(data.filter((item, i) => i !== index));
    }

    const treatments = data.map((item, i) => {
        return (
            <li key={`treatment-${i}`}>
                <Treatment isNew={isNew} item={item} fieldVarient={fieldVarient} isEditMode={isEditMode} index={i} removeTreatment={() => { removeItem(i) }} />
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
                {isEditMode && (
                    <Button className="treatment-history_add" variant="text" disableElevation onClick={addTreatment}>
                        <span aria-hidden="true" className="material-symbols-outlined">add_circle</span>
                        <span className="font-body-bold">Add treatment</span>
                    </Button>
                )}
            </AccordionDetails>
        </Accordion>
    )
}

const Treatment = ({isNew, item, fieldVarient, isEditMode, index, removeTreatment}) => {
    return (
        <>
            <div className="history_header">
                <span aria-hidden="true" className="material-symbols-outlined">medical_services</span>
                <h3 className="font-title">Treatment</h3>
                {(isEditMode && item.showDelete) && (
                    <Button className="call-log_remove" variant="text" disableElevation type='button' onClick={() => removeTreatment()}>
                        <>
                            <span aria-hidden="true" className="material-symbols-outlined red">cancel</span>
                            <span className="a11y-text font-body-bold">Remove treatment</span>
                        </>
                    </Button>
                )}
            </div>
            <div className="history_content caller-form_row treatment">
                {/* Undergoing */}
                <Autocomplete
                    disablePortal
                    id={`caller-undergoing-${index}`}
                    variant={fieldVarient}
                    options={fields.treatmentUndergoing}
                    defaultValue={isNew ? undefined : mapSelection(item.undergoing, false)}
                    isOptionEqualToValue={isNew ? undefined : (option, value) => option.id === value.id}
                    readOnly={!isEditMode}
                    renderInput={(params) => <TextField {...params} readOnly={!isEditMode} variant={fieldVarient} label="Undergoing" />}
                />
                {/* Location */}
                <TextField
                    id={`caller-treatment-location-${index}`}
                    label="Location"
                    InputProps={textAreaProps}
                    variant={fieldVarient}
                    defaultValue={isNew ? undefined :  item.location}
                />
                {/* Notes */}
                <TextField
                    id={`caller-treatment-notes-${index}`}
                    label="Notes"
                    InputProps={textAreaProps}
                    variant={fieldVarient}
                    defaultValue={isNew ? undefined :  item.notes}
                />
            </div>
        </>
    )
};

const Modal = ({modalOpen, setModalOpen, setIsArchived}) => {
            
    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleModalContinue = (e) => {
        console.log(e);
        setModalOpen(false);
        setIsArchived(true);
    };

    return (
        <Dialog
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure you want to archive this profile?</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        fullWidth
                        id="archiveReason"
                        label="Archive Reason"
                        variant='outlined'
                        InputProps={textAreaProps}
                        // value={archiveReason}
                        // onChange={(e) => { setTest(e.target.value)}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>Cancel</Button>
                    <Button onClick={(e) => {handleModalContinue(e)}}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
    )
}

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
            [modalOpen, setModalOpen] = useState(false),
            [openToast, setOpenToast] = useState(false);
    // Caller Variables
    const   data = useQuery({queryKey: [type], queryFn: callerQueries[type]}),
            caller = data.isSuccess ? data.data.find(caller => caller.id === callerId) : newUser;  
            
    const   [isArchived, setIsArchived] = useState(isNew ? false : caller.archived.isArchived);

    // Form Variables
    const fieldVarient = isEditMode ? 'outlined' :  'standard';
    const initialCheck = {
        firstName: !isNew && !caller.firstName,
        lastName: !isNew && !caller.lastName,
    };

    const handleArchive = () => {
        setModalOpen(true);
    };
    

    function handleReactivate() {
        // TODO: handle reactivate
    }

    function handleEdit() {
        setIsEditMode(true);
    }

    function handleFormCancel() {
        // TODO: reset values

        if (isNew) {
            window.location.href = '/';
        } else {
            setIsEditMode(false);
        }
    }

    function handleFormSave(e) {
        // TODO: better handle save, aggregating all values

        // const inputs = Array.from(e.currentTarget).filter(item => item.nodeName === 'INPUT');
        // const fakeForm = {
        //     ...baseUser,
        //     firstName: 'Emily',
        //     lastName: 'Painter',
        //     phoneNumbers: [1234567890],
        //     relevantInfo: 'baby shark do do do dod dooo',
        //     specificInstructions: 'mama shark do do do dod dodooo'
        // };
        // const activeUsers = [...data, fakeForm];

        // pushNewCaller(activeUsers);
        setIsEditMode(false);
        setOpenToast(true);

    }

    function handleFormSaveAnother() {
        console.log('save form and add another')
    }

    function handleCloseToast() {
        setOpenToast(false);
    }

    // Sub Components
    function Action() {
        const archived = (
            <>
                <Button variant="contained" disableElevation onClick={handleReactivate}>
                    <span className="font-body-bold">Reactivate</span>
                </Button>
            </>
        );

        const active = (!isEditMode && (
                <>
                    <Button variant="contained" disableElevation onClick={handleEdit}>
                        <span className="font-body-bold">Edit</span>
                    </Button>
                    <Button variant="text" disableElevation onClick={handleArchive}>
                        <span className="font-body-bold">Archive</span>
                    </Button>
                    <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} setIsArchived={setIsArchived}/>
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
                { isArchived && (
                    <span className="font-page-heading-light italic"> (archived)</span>
                )}
            </h1>
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
                        <Button
                            variant="contained"
                            disableElevation
                            // type="submit"
                            onClick={() => { handleFormSave()}}
                        >
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
                    <div className="caller-details_back">
                        <Button variant="text" disableElevation href="/">
                            <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
                            <span className="font-body-bold">Back to caller list</span>
                        </Button>
                    </div>
                )}
                <div className="caller-details-header">
                    <PageTitle />
                    <Action/>
                </div>
                {(caller.archived.isArchived || isArchived) && !modalOpen && (
                    <p className='archive-reason font-body italic'>
                        <span className='font-body-bold'>Archive Reason: </span>
                        {caller.archived.reason}
                    </p>
                )}
                <form action='' method="post" onSubmit={handleFormSave} className="caller-form">
                    <fieldset className="caller-details_header" disabled={!isEditMode}>
                        <div className="caller-form_row phone">
                            <PhoneNumbers
                                isNew = {isNew}
                                caller = {caller}
                                fieldVarient = {fieldVarient}
                                isEditMode = {isEditMode} />
                        </div>
                        <div className="caller-form_row name">
                            <Names
                                isNew = {isNew}
                                fieldVarient = {fieldVarient}
                                isEditMode = {isEditMode}
                                initialCheck = {initialCheck}
                                caller = {caller}
                            />
                        </div>
                        <div className="caller-form_row info">
                            <TextField
                                id="relevantInfo"
                                label="Relevant Information (Required)"
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
                        <CallHistory
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={caller}
                        />
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
                        <PersonalDetails
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={caller}
                        />
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
                        <TreatmentHistory
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={caller}
                        />
                    </fieldset>
                    <FormAction/>
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openToast} autoHideDuration={6000} onClose={handleCloseToast}>
                        <Alert
                            onClose={handleCloseToast}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            Profile successfully saved!
                        </Alert>
                    </Snackbar>
                </form>
            </div>
        ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '500px' }}>
                <CircularProgress />
            </Box>
        )
    )
}