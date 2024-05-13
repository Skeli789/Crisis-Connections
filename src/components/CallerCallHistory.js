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
                            <span aria-hidden="true" className="material-symbols-outlined red">delete</span>
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
                        label={<>Date and Time {isEditMode && <span className="required">(Required)</span>}</>}
                        defaultValue={dayjs(log.dateTime)}
                        variant={fieldVarient}
                        readOnly={!isEditMode}
                        maxDate={dayjs()} // Only allow past values
                        onChange={(newDate) => { handleFieldChange(newDate.valueOf(), 'dateTime', index) }}
                        slotProps={{ textField: { variant: fieldVarient } }}
                    />
                    {/* Call Service */}
                    <Autocomplete
                        className="history_content-service"
                        disablePortal
                        id={`caller-log-service-${index}`}
                        variant={fieldVarient}
                        options={fields.services}
                        defaultValue={isNew || !log.service ? undefined : mapSelection(log.service)}
                        isOptionEqualToValue={isNew ? undefined : (option, value) => option.id === value.id}
                        readOnly={!isEditMode}
                        forcePopupIcon={isEditMode}
                        onChange = {(e, newValue) => { handleFieldChange(newValue.id, 'service', index) }}
                        renderInput={(params) => <TextField {...params} variant={fieldVarient} label={<>Service {isEditMode && <span className="required">(Required)</span>}</>} />}
                    />
                    {/* Call With */}
                    <TextField id={`caller-log-with-${index}`}
                        label="With"
                        variant={fieldVarient}
                        defaultValue={isNew ? undefined :  log.with}
                        readOnly={!isEditMode}
                        onBlur={(e) => { handleFieldChange(e.target.value, 'with', index) }}
                    />
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

export default function CallHistory ({isNew, fieldVarient, isEditMode, caller, textAreaProps, saveChanges}) {
    const initialEmpty = isNew || caller.callHistory.length === 0;
    // TODO: Prefill "with" name using login information, if possible
    const newLog = {dateTime: Date.now(), service: undefined, with: '', notes: '', showDelete: true};
    const [history, setHistory] = useState(initialEmpty ? [] : caller.callHistory.map(log => { return {...log, showDelete: false } }));

    const addLog = () => {
        const logs = [...history, newLog];
        setHistory(logs);
        saveChanges('callHistory', logs);
    }

    function removeLog(index) {
        const logs = history.filter((log, i) => i !== index);
        setHistory(logs);
        saveChanges('callHistory', logs);
    }

    const handleFieldChange = (newValue, field, i) => {
        console.log('handleFieldChange', newValue, field, i);
        let logs = history.map((existing, index) => { return index === i ? {...existing, [field]: newValue} : existing });
        setHistory(logs);
        saveChanges('callHistory', logs);
    }

    const callLogs = sortByCallHistory(history).map((log, i) => {
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
                    {callLogs}
                </ul>
            </AccordionDetails>
        </Accordion>
    )
}