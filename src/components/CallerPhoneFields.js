import { forwardRef, useState } from 'react';
import { Button, Input, InputLabel, FormControl, OutlinedInput } from '@mui/material';
import { IMaskInput } from 'react-imask';
import { getName } from '../utils/utils.js';

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
    
    number = isNew ? undefined : number.toString();

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
                    defaultValue={number}
                    name={`phoneNumber-${index}`}
                    id={`phoneNumber-${index}`}
                    inputComponent={TextMaskCustom}
                    readOnly={!isEditMode}
                />
            )}
        </FormControl>
    ); 
}

export default function PhoneNumbers ({isNew, caller, fieldVarient, isEditMode, callerList, duplicateData}) {
    const [numbers, setNumbers] = useState(isNew ? [''] : caller.phoneNumbers.map(num => num.toString()));
    const [allHaveValue, setAllHaveValue] = useState(numbers.every(num => num.length === 10));
    const [duplicates, setDuplicates] = useState([]);

    const addField = () => {
        setNumbers([...numbers, '']);
        setAllHaveValue(false);
    }

    function removeField(index) {
        setNumbers(numbers.filter((num, i) => i !== index));
        if (duplicates.some(dupe => dupe.phoneNumber === numbers[index])) {
            const dupes = duplicates.filter(dupe => dupe.phoneNumber !== numbers[index]);
            setDuplicates(dupes);
            duplicateData(dupes);
        }
    }

    const handleFieldChange = (newValue, i) => {
        const number = newValue.replace(/\D/g, "");
        const duplicateNums = callerList.filter(item => {
            const isThisCaller = item.id === caller.id;
            return !isThisCaller && item.phoneNumbers.some(num => num.toString() === number);
        });
        const notAlreadyLogged = !duplicates.some(dupe => dupe.index === i);
        let nums = numbers.map((existing, index) => { return index === i ? number : existing });
        let dupes = [];

        setNumbers(nums);
        setAllHaveValue(nums.every(num => num.length === 10));

        if (notAlreadyLogged && duplicateNums.length > 0) {
            const obj = {
                phoneNumber: number,
                dupes: duplicateNums.map(profile => { 
                    return ({
                        id: profile.id, 
                        name: getName(profile.firstName,profile.lastName)
                    });
                })
            };
            dupes = [...duplicates, obj];
        } else if (!notAlreadyLogged && !duplicateNums) {
            dupes = duplicates.filter(dupe => dupe.phoneNumber === number);
        }

        duplicateData(dupes);
        setDuplicates(dupes);
    }

    return (
        <div className="multiple-field">
            {numbers.map((number, i) => {
                return (
                    <div key={`${number}-${i}`} className="multiple-field_item">
                        {(isEditMode && i !== 0) && (
                            <Button className="phone-group_remove multiple-field_remove" variant="text" disableElevation type='button' onClick={() => removeField(i)}>
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
                <Button className="phone-group_add multiple-field_add" variant="text" disableElevation disabled={!allHaveValue} onClick={addField}>
                    <span aria-hidden="true" className="material-symbols-outlined">add_circle</span>
                    <span className="font-body-bold">Add phone number</span>
                </Button>
            )}
        </div>
    );
}