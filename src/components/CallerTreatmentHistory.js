import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, TextField } from '@mui/material';
import { fields, mapSelection } from '../utils/fields.js';

const Treatment = ({isNew, item, fieldVarient, isEditMode, index, removeTreatment, textAreaProps, saveChanges}) => {
    const defaultUndergoing = isNew || !item.undergoing ? undefined : mapSelection(item.undergoing, true);
    const [value, setValue] = useState({ ...item, undergoing: defaultUndergoing });

    function handleFieldChange(e, name) {
        // Update the internal state
        const fieldName = name ? name : e.target.name;
        const newValue = e.target.value ? e.target.value : e.target.innerText;
        let obj = {...value, [fieldName]: newValue};
        setValue(obj);

        // Update the global state
        if (fieldName === "undergoing") {
            obj[fieldName] = newValue.toLowerCase();
        }
        delete obj.showDelete;
        saveChanges(obj, index);
    }

    return (
        <>
            {/* Treatment Header */}
            <div className="history_header">
                <span aria-hidden="true" className="material-symbols-outlined">medical_services</span>
                <h3 className="font-title">Treatment</h3>
                {(isEditMode && item.showDelete) && (
                    <Button className="call-log_remove" variant="text" disableElevation type='button' onClick={() => removeTreatment()}>
                        <>
                            <span aria-hidden="true" className="material-symbols-outlined red">delete</span>
                            <span className="a11y-text font-body-bold">Remove treatment</span>
                        </>
                    </Button>
                )}
            </div>

            {/* Treatment Content */}
            <div className="history_content caller-form_row treatment">
                {/* Undergoing */}
                <Autocomplete
                    disablePortal
                    id={`caller-undergoing-${index}`}
                    variant={fieldVarient}
                    options={fields.treatmentUndergoing}
                    defaultValue={defaultUndergoing}
                    isOptionEqualToValue={isNew ? undefined : (option, value) => option.id === value.id}
                    readOnly={!isEditMode}
                    forcePopupIcon={isEditMode}
                    onChange={(e) => {handleFieldChange(e, 'undergoing')}}
                    renderInput={(params) => <TextField {...params} readOnly={!isEditMode} variant={fieldVarient} label="Undergoing" />}
                />
                {/* Location */}
                <TextField
                    id={`caller-treatment-location-${index}`}
                    name='location'
                    label="Location"
                    InputProps={textAreaProps}
                    variant={fieldVarient}
                    onBlur={(e) => {handleFieldChange(e)}}
                    defaultValue={isNew ? undefined : item.location}
                />
                {/* Notes */}
                <TextField
                    id={`caller-treatment-notes-${index}`}
                    name="notes"
                    label="Notes"
                    InputProps={textAreaProps}
                    variant={fieldVarient}
                    onBlur={(e) => {handleFieldChange(e)}}
                    defaultValue={isNew ? undefined : item.notes}
                />
            </div>
        </>
    )
};

export default function TreatmentHistory({isNew, caller, fieldVarient, isEditMode, textAreaProps, saveChanges}) {
    const newTreatment = {
        undergoing: undefined,
        location: '',
        notes: '',
        showDelete: true
    };
    const [data, setData] = useState(caller.currentBehavioralTreatment.length > 0 ? caller.currentBehavioralTreatment : []);

    const addTreatment = () => {
        const list = [...data, newTreatment];
        setData(list);
        saveChanges('currentBehavioralTreatment', list);
    }

    const removeItem = (index) => {
        const list = data.filter((item, i) => i !== index);
        setData(list);
        saveChanges('currentBehavioralTreatment', list);
    }

    const saveData = (obj, index) => {
        const list = data.map((item, i) => i === index ? obj : item);
        setData(list);
        saveChanges('currentBehavioralTreatment', list);
    }

    const treatments = data.map((item, i) => {
        return (
            <li key={`treatment-${i}`}>
                <Treatment isNew={isNew} item={item} textAreaProps={textAreaProps} fieldVarient={fieldVarient} isEditMode={isEditMode} index={i} removeTreatment={() => { removeItem(i) }} saveChanges={saveData} />
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
