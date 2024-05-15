import { useState } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';

export default function Names({isNew, fieldVarient, isEditMode, initialCheck, caller, saveChanges}) {
    const [firstName, setFirstName] = useState(isNew ? '' : (caller.firstName ? caller.firstName : 'Not Provided'));
    const [lastName, setLastName] = useState(isNew ? '' : (caller.lastName ? caller.lastName : 'Not Provided'));
    const [aka, setAka] = useState(isNew ? '' : (caller.aka ? caller.aka : 'Not Provided'));
    const [isNotProvided, setIsNotProvided] = useState({firstName: initialCheck.firstName, lastName: initialCheck.lastName});
    const fnCheck = isNotProvided.firstName;
    const lnCheck = isNotProvided.lastName;

    function handleFieldChange(e) {
        const fieldName = e.target.name;
        const value = e.target.value;

        switch (fieldName) {
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'aka':
                setAka(value);
                break;
            default:
                break;
        }

        saveChanges(fieldName, value);
    }

    function handleNotProvided(e) {
        const name = e.target.name.replace("na-", "");
        const isChecked = e.target.checked;
        let prop = {...isNotProvided};

        prop[name] = isChecked;
        setIsNotProvided(prop);
        
        switch (name) {
            case 'firstName':
                setFirstName(isChecked ? 'Not Provided' : '');
                break;
            case 'lastName':
                setLastName(isChecked ? 'Not Provided' : '');
                break;
            case 'aka':
                setAka(isChecked ? 'Not Provided' : '');
                break;
            default:
                break;
        }

        saveChanges(name, '');
    }

    return (
        <>
            <TextField
                id="firstName"
                name="firstName"
                label={<>First Name {isEditMode && <span className="required">(Required)</span>}</>}
                variant={fieldVarient}
                value={firstName}
                autoComplete="nope"
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
                label={<>Last Name {isEditMode && <span className="required">(Required)</span>}</>}
                variant={fieldVarient}
                value={lastName}
                autoComplete="nope"
                readOnly={!isEditMode}
                disabled={isEditMode && isNotProvided.lastName}
                onChange={handleFieldChange}
            />
            { isEditMode && 
                <div className="additional">
                    <FormControlLabel className="additional" name="na-lastName" control={<Checkbox checked={lnCheck} />} label="Not Provided" onChange={handleNotProvided} />
                </div>
            }
            <TextField
                id="aka"
                name="aka"
                label="Also Known As"
                variant={fieldVarient}
                value={aka}
                autoComplete="nope"
                readOnly={!isEditMode}
                onChange={handleFieldChange}
            />
        </>
    )
}