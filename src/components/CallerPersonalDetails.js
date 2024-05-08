import { useState, Fragment } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getLabelName } from '../utils/utils';
import { fields, mapSelection } from '../utils/fields.js';

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
// TODO: Group x icon with the field, also for phone numbers. Update so "ethnicity" longest line fits

export default function PersonalDetails({caller, isNew, fieldVarient, isEditMode}) {
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