import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Box, CircularProgress, Snackbar, TextField } from '@mui/material';
import { getActiveCallers, getArchivedCallers, saveNewCaller, saveUpdatedCaller, baseUser } from '../utils/api';
import { requiredFields } from '../utils/fields';
import { formatPhoneNumber, getName, isOld } from '../utils/utils';

import OldProfile from '../components/OldProfile';
import CallerPhoneFields from '../components/CallerPhoneFields';
import CallerNames from '../components/CallerNames';
import CallerCallHistory from '../components/CallerCallHistory';
import CallerPersonalDetails from '../components/CallerPersonalDetails';
import CallerTreatmentHistory from '../components/CallerTreatmentHistory';
import CallerArchiveModal from '../components/CallerArchiveModal';

import '../styles/routes/Caller.css';

// TODO: Server side should be assigning id to new callers and return it to the front-end

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
            callerId = parseInt(params[2]);
    // State Variables
    const   [isEditMode, setIsEditMode] = useState(isNew ? true : false),
            [editedUser, setEditedUser] = useState({...baseUser}),
            [modalOpen, setModalOpen] = useState(false),
            [disableSave, setDisableSave] = useState(true),
            [toast, setToast] = useState({ // Toast is a pop-up message that appears on the screen
                open: false,
                severity: '', // "success" or "error"
                message: ''
            });
    // Caller Variables
    const   callerList = useQuery({queryKey: [isNew ? 'caller' : type], queryFn: callerQueries[isNew ? 'caller' : type]}),
            caller = !isNew && callerList.isSuccess ? callerList.data.find(caller => caller.id === callerId) : {...baseUser};  

    const   [isArchived, setIsArchived] = useState(isNew || caller == null ? false : caller.archived.isArchived);
    const   [duplicates, setDuplicates] = useState([]);

    // Form Variables
    const fieldVarient = isEditMode ? 'outlined' :  'standard';
    const initialCheck = {
        firstName: !isNew && caller != null && !caller.firstName,
        lastName: !isNew && caller != null && !caller.lastName,
    };
    const latestCallDate = isNew || caller == null ? new Date() : new Date(Math.max(...caller.callHistory.map(e => new Date(e.dateTime))));
    const isOldCaller = isOld(latestCallDate);

    // Other Variables
    const queryClient = useQueryClient();

    // Functions
    function successPopUp(message) {
        setToast({open: true, severity: "success", message: message});
    }

    function errorPopUp(message) {
        setToast({open: true, severity: "error", message: message});
    }

    function waitPopUp() {
        setToast({open: true, severity: "info", message: "Please wait..."});
    }

    function handleClosePopUp() {
        setToast({...toast, open: false})
    }

    async function handleArchive(reason) {
        // TODO: fill by with logged in user information if possible.
        const user = {...caller, archived: { isArchived: true, by: "", dateTime: Date.now(), reason: reason }};
        setIsArchived(true);
        setEditedUser(user);
        await handleFormSave(user, "Profile successfully archived!");
    };

    async function handleReactivate() {
        const user = {...caller, archived: { isArchived: false }};
        setIsArchived(false);
        setEditedUser(user);
        await handleFormSave(user, "Profile successfully reactivated!");
    }

    function openArchiveModal () {
        setModalOpen(true);
    };

    function handleEdit() {
        setEditedUser({...caller});
        setIsEditMode(true);
        setDisableSave(false);
    }

    function handleFormCancel() {
        if (isNew) {
            window.location.href = '#/';
        } else {
            setIsEditMode(false);
        }
    }

    function isFormReady(user) {
        let isReady = false;
        let changedProfile = user ? {...user} : {...editedUser};

        if (!isNew) {
            // if editing existing and field is unchanged, populate existing value
            for (const [field, savedValue] of Object.entries(caller)) {
                if (changedProfile[field] === undefined) {
                    changedProfile[field] = savedValue;
                }
            }
        }

        // check if required have value
        isReady = requiredFields.every(field => {
            let hasValue = false;
            const newValue = changedProfile[field];
            switch(field) {
                case 'callHistory':
                    hasValue = newValue?.every(log => log.dateTime && log.service);
                    break;
                case 'phoneNumbers':
                    // has at least one number and all numbers are valid length
                    hasValue = newValue?.length > 0 && newValue.every(number => number.toString().length === 10);
                    break;
                default:
                    hasValue = newValue.trim().length > 0;
                    break;
            }

            return hasValue;
        });

        // set last updated to now
        changedProfile.lastUpdated = {
            by: "", // TODO: Replace with username
            dateTime: Date.now(),
        }

        return ({ isReady: isReady, latestUserInfo: changedProfile });
    }

    const navigate = useNavigate();
    async function handleFormSave(user, saveMessage) {
        const { isReady, latestUserInfo } = isFormReady(user);
        if (isReady) {
            try
            {
                waitPopUp(); // Tell the user to wait while the profile is being saved

                if (isNew) {
                    // TODO: Set ID on server side
                    // Create a new id that is one higher than the highest id in the list
                    if (callerList.data == null || callerList.data.length === 0) {
                        latestUserInfo.id = 1;
                    } else {
                        latestUserInfo.id = Math.max(...callerList.data.map(caller => caller.id)) + 1;
                    }
                    await saveNewCaller(latestUserInfo);
                } else {
                    await saveUpdatedCaller(latestUserInfo);
                }

                setIsEditMode(false);
                successPopUp(saveMessage);
                queryClient.removeQueries(); // Force clear cache
                handleRedirectToDetails(latestUserInfo);
            } catch (error) {
                errorPopUp("An error occurred on the server while saving the profile.");
                console.log("Error saving profile", error);
            }
        } else {
            errorPopUp("Required fields must be filled out to save.");
        }
    }

    function handleDuplicates(data) {
        setDuplicates(data);
    }

    function handleNewChanges(field, data) {
        const updatedUser = {...editedUser, [field]: data};
        setEditedUser(updatedUser);
        setDisableSave(!isFormReady(updatedUser).isReady);
    }

    function handleRedirectToDetails(userData) {
        let baseUrl = userData.archived.isArchived ? "archive" : "caller";
        navigate(`/${baseUrl}/${userData.id}`);
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
                    <Button variant="text" disableElevation onClick={openArchiveModal}>
                        <span className="font-body-bold">Archive</span>
                    </Button>
                    <CallerArchiveModal textAreaProps={textAreaProps} modalOpen={modalOpen} setModalOpen={setModalOpen} setIsArchived={setIsArchived} archiveUser={handleArchive}/>
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
                            disabled={disableSave}
                            onClick={async () => await handleFormSave(null, "Profile successfully saved!")}
                        >
                            <span className="font-body-bold">Save</span>
                        </Button>
                    </div>
                </div>
            )
        )
    }

    let viewCaller = isEditMode ? editedUser : caller;
    return ((callerList.isSuccess || isNew) && viewCaller != null ? (
            <div className="caller-details page-padding" data-is-edit={isEditMode}>
                {/* Header */}
                {!isEditMode && <BackButton/>}
                <div className="caller-details-header">
                    <PageTitle />
                    <Action/>
                    {(isOldCaller && !isArchived && !isEditMode) && <OldProfile/>}
                </div>
                {(viewCaller.archived.isArchived || isArchived) && !modalOpen && (
                    <p className='archive-reason font-body italic'>
                        <span className='font-body-bold'>Archive Reason: </span>
                        {viewCaller.archived.reason ? viewCaller.archived.reason : "None"}
                    </p>
                )}
                {(duplicates.length > 0) && (
                    <DuplicateWarning duplicates={duplicates} />
                )}
                {/* Form Fields */}
                <form key={isEditMode ? "edit" : "view"} action='' method="post" onSubmit={() => handleFormSave(null, "Profile successfully saved!")} className="caller-form">
                    <fieldset className="caller-details_header" disabled={!isEditMode}>
                        <div className="phone">
                            <CallerPhoneFields
                                isNew = {isNew}
                                caller = {viewCaller}
                                fieldVarient = {fieldVarient}
                                isEditMode = {isEditMode}
                                callerList = {callerList.data != null ? callerList.data : []}
                                duplicateData = {handleDuplicates}
                                saveChanges = {handleNewChanges}
                            />
                        </div>
                        <div className="caller-form_row name">
                            <CallerNames
                                isNew = {isNew}
                                fieldVarient = {fieldVarient}
                                isEditMode = {isEditMode}
                                initialCheck = {initialCheck}
                                caller = {viewCaller}
                                saveChanges = {handleNewChanges}
                            />
                        </div>
                        <div className="caller-form_row info">
                            <TextField
                                id="relevantInfo"
                                label={<>Relevant Information {isEditMode && <span className="required">(Required)</span>}</>}
                                variant={fieldVarient}
                                defaultValue={isNew ? undefined : viewCaller.relevantInfo}
                                InputProps={textAreaProps}
                                readOnly={!isEditMode}
                                onChange={(e) => {handleNewChanges('relevantInfo', e.target.value)}}
                            />
                            <TextField
                                id="specificInstructions"
                                label={<>Specific Instruction {isEditMode && <span className="required">(Required)</span>}</>}
                                InputProps={textAreaProps}
                                variant={fieldVarient}
                                readOnly={!isEditMode}
                                defaultValue={isNew ? undefined : viewCaller.specificInstructions}
                                onChange={(e) => {handleNewChanges('specificInstructions', e.target.value)}}
                            />
                        </div>
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
                        <CallerPersonalDetails
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={viewCaller}
                            saveChanges = {handleNewChanges}
                        />
                    </fieldset>
                    <fieldset className="caller-form_section" disabled={!isEditMode}>
                        <CallerCallHistory
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={viewCaller}
                            textAreaProps={textAreaProps}
                            saveChanges = {handleNewChanges}
                        />
                    </fieldset>
                    <fieldset className="caller-form_section"  disabled={!isEditMode}>
                        <CallerTreatmentHistory
                            isNew={isNew}
                            fieldVarient={fieldVarient}
                            isEditMode={isEditMode}
                            caller={viewCaller}
                            textAreaProps={textAreaProps}
                            saveChanges = {handleNewChanges}
                        />
                    </fieldset>
                    <FormAction/>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={toast.open}
                        autoHideDuration={6000}
                        onClose={handleClosePopUp}
                    >
                        <Alert
                            onClose={handleClosePopUp}
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
            <div className="caller-details page-padding">
                <BackButton/>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '500px' }}>
                    <CircularProgress />
                </Box>
            </div>
        )
    )
}