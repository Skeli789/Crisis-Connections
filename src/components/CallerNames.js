import { useState } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';

export default function Names({isNew, fieldVarient, isEditMode, initialCheck, caller}) {
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