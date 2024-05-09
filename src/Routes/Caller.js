import { useState } from 'react';
import { useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Box, CircularProgress, Snackbar, TextField } from '@mui/material';
import { getActiveCallers, getArchivedCallers, baseUser } from '../utils/api';
import { formatPhoneNumber, getName, isOld } from '../utils/utils';

import OldProfile from '../components/OldProfile';
import CardPhoneFields from '../components/CallerPhoneFields';
import CallerNames from '../components/CallerNames';
import CallerCallHistory from '../components/CallerCallHistory';
import CallerPersonalDetails from '../components/CallerPersonalDetails';
import CallerTreatmentHistory from '../components/CallerTreatmentHistory';
import CallerArchiveModal from '../components/CallerArchiveModal';

import '../styles/routes/Caller.css';

const callerQueries = {
    caller: getActiveCallers,
    archive: getArchivedCallers
}

const textAreaProps = { rows: 4, multiline: true, inputComponent: 'textarea' }; // using to avoid a known issue with MUI text field multiline throwing error on browser resize

const BackButton = () => {
    return (
        <div className="caller-details_back">
            <Button variant="text" disableElevation href="#/">
                <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
                <span className="font-body-bold">Back to caller list</span>
            </Button>
        </div>
    )
}

const DuplicateWarning = ({duplicates}) => {
    const list = duplicates.map(item => {
        return (
            <li key={item.phoneNumber}>
                <span>
                    {formatPhoneNumber(item.phoneNumber)} is used in 
                    { item.dupes.map((profile, i) => {
                            return (
                                <span key={profile.id}>
                                    <Button variant="text" disableElevation target="_blank" href={`#/caller/${profile.id}`}>{profile.name}</Button>
                                    {i < item.dupes.length - 1 && ','}
                                </span>
                            )
                        })
                    }
                </span>
            </li>
        )
    });

    return (
        <div className="duplicate-error">
            <span>
                <span className="material-symbols-outlined">error</span>
                There are potential duplicate caller profile(s).
            </span>
            <ul>
                {list}
            </ul>
        </div>
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
            // [editedUser, setEditedUser] = useState({...baseUser}),
            [modalOpen, setModalOpen] = useState(false),
            [toast, setToast] = useState({
                open: false,
                severity: '', // "success" or "error"
                message: ''
            });
    // Caller Variables
    const   callerList = useQuery({queryKey: [type], queryFn: callerQueries[type]}),
            caller = callerList.isSuccess ? callerList.data.find(caller => caller.id === callerId) : {...baseUser};  
            
    const   [isArchived, setIsArchived] = useState(isNew ? false : caller.archived.isArchived);
    const   [duplicates, setDuplicates] = useState([]);

    // Form Variables
    const fieldVarient = isEditMode ? 'outlined' :  'standard';
    const initialCheck = {
        firstName: !isNew && !caller.firstName,
        lastName: !isNew && !caller.lastName,
    };
    const latestCallDate = isNew ? new Date() : new Date(Math.max(...caller.callHistory.map(e => new Date(e.dateTime))));
    const isOldCaller = isOld(latestCallDate);

    const handleArchive = () => {
        setModalOpen(true);
    };
    
    function handleReactivate() {
        // TODO: set caller profile archive.isArchived = false
    }

    function handleEdit() {
        setIsEditMode(true);
    }

    function handleFormCancel() {
        if (isNew) {
            window.location.href = '#/';
        } else {
            setIsEditMode(false);
        }
    }

    function handleFormSave(e) {
        // TODO: push update to database
        setIsEditMode(false);
        // TODO: update toast to reflect status
        setToast({open: true, severity: "success", message: "Profile successfully saved!"});
    }

    function handleCloseToast() {
        setToast({...toast, open: false})
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
                    <CallerArchiveModal textAreaProps={textAreaProps} modalOpen={modalOpen} setModalOpen={setModalOpen} setIsArchived={setIsArchived}/>
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
        // TODO: style and route actions
        return (
            isEditMode && (
                <div className="caller-form_actions">
                    <Button variant="text" disableElevation onClick={handleFormCancel}>
                        <span className="font-body-bold">Cancel</span>
                    </Button>
                    <div className="caller-form_actions-save">
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

    function handleDuplicates(data) {
        setDuplicates(data);
    }

    return ( (callerList.isSuccess || isNew) ? (
            <div className="caller-details page-padding" data-is-edit={isEditMode}>
                {!isEditMode && <BackButton/>}
                <div className="caller-details-header">
                    <PageTitle />
                    <Action/>
                    {(isOldCaller && !isArchived && !isEditMode) && <OldProfile/>}
                </div>
                {(caller.archived.isArchived || isArchived) && !modalOpen && (
                    <p className='archive-reason font-body italic'>
                        <span className='font-body-bold'>Archive Reason: </span>
                        {caller.archived.reason}
                    </p>
                )}
                {(duplicates.length > 0) && (
                    <DuplicateWarning duplicates={duplicates} />
                )}
                <form action='' method="post" onSubmit={handleFormSave} className="caller-form">
                    <fieldset className="caller-details_header" disabled={!isEditMode}>
                        <div className="phone">
                            <CardPhoneFields
                                isNew = {isNew}
                                caller = {caller}
                                fieldVarient = {fieldVarient}
                                isEditMode = {isEditMode}
                                callerList = {callerList.data}
                                duplicateData = {handleDuplicates}
                            />
                        </div>
                        <div className="caller-form_row name">
                            <CallerNames
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
                        <CallerCallHistory
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={caller}
                            textAreaProps={textAreaProps}
                        />
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
                        <CallerPersonalDetails
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={caller}
                        />
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
                        <CallerTreatmentHistory
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={caller}
                            textAreaProps={textAreaProps}
                        />
                    </fieldset>
                    <FormAction/>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={toast.open}
                        autoHideDuration={6000}
                        onClose={handleCloseToast}
                    >
                        <Alert
                            onClose={handleCloseToast}
                            severity={toast.severity}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {toast.message}
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