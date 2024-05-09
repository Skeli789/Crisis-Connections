import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, TextField } from '@mui/material';
import { fields, mapSelection } from '../utils/fields.js';

const Treatment = ({isNew, item, fieldVarient, isEditMode, index, removeTreatment, textAreaProps}) => {
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
                    defaultValue={isNew || !item.undergoing ? undefined : mapSelection(item.undergoing, false)}
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

export default function TreatmentHistory ({isNew, caller, fieldVarient, isEditMode, textAreaProps}) {
    const newTreatment = {
        undergoing: undefined,
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