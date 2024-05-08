import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { sortByCallHistory } from '../utils/utils.js';
import { fields, mapSelection } from '../utils/fields.js';

const CallLog = ({log, index, isNew, fieldVarient, isEditMode, removeLog, textAreaProps, handleFieldChange}) => {
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

export default function CallHistory ({isNew, fieldVarient, isEditMode, caller, textAreaProps}) {
    const initialEmpty = isNew || caller.callHistory.length === 0;
    // TODO: Prefill "with" name using login information, if possible
    const newLog = {dateTime: Date.now(), service: undefined, with: '', notes: '', showDelete: true};
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
                <CallLog log={log} index={i} isNew={isNew} fieldVarient={fieldVarient} isEditMode={isEditMode} textAreaProps={textAreaProps} removeLog={() => { removeLog(i) }} handleFieldChange={handleFieldChange} />
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