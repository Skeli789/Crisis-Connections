import { forwardRef, useState } from 'react';
import { Button, Input, InputLabel, FormControl, FormHelperText, OutlinedInput } from '@mui/material';
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

const PhoneField = ({number, index, fieldVarient, isEditMode, handleFieldChange, isNew, error = false}) => {
    let label = "Phone Number";
    const helperText = error && 'Enter a valid phone number.';

    label = index === 0 ? <>{label} {isEditMode && <span className="required">(Required)</span>}</> : label;

    // number = isNew ? undefined : number.toString();
    number = number.toString();

    return (
        <FormControl className="phone-group_field" variant={fieldVarient}>
            <InputLabel variant={fieldVarient} htmlFor={`phoneNumber-${index}`}>{label}</InputLabel>
            {isEditMode ? (
                <>
                    <OutlinedInput
                        label={label}
                        value={number}
                        autoComplete="nope"
                        error={error}
                        name={`phoneNumber-${index}`}
                        id={`phoneNumber-${index}`}
                        inputComponent={TextMaskCustom}
                        readOnly={!isEditMode}
                        onBlur={(e) => handleFieldChange(e.target.value, index)}
                    />
                    {error && (
                        <FormHelperText error>
                            {helperText}
                        </FormHelperText>
                    )}
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

export default function PhoneNumbers({isNew, caller, fieldVarient, isEditMode, callerList, duplicateData, saveChanges}) {
    const [numbers, setNumbers] = useState(isNew ? [''] : caller.phoneNumbers.map(num => num.toString()));
    const [allHaveValue, setAllHaveValue] = useState(numbers.every(num => num.length === 10));
    const [duplicates, setDuplicates] = useState([]);
    const [fieldWithErrors, setFieldWithErrors] = useState([]);

    const addField = () => {
        setNumbers([...numbers, '']);
        setAllHaveValue(false);
    }

    const removeField = (index) => {
        const nums = numbers.filter((num, i) => i !== index);
        if (duplicates.some(dupe => dupe.phoneNumber === numbers[index])) {
            const dupes = duplicates.filter(dupe => dupe.phoneNumber !== numbers[index]);
            setDuplicates(dupes);
            duplicateData(dupes);
        }
        setNumbers(nums);
        saveChanges('phoneNumbers', nums);
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

        setNumbers(nums);
        setAllHaveValue(nums.every(num => num.length === 10));
        setFieldWithErrors(nums.map((num, i) => num.length > 0 && num.length < 10));
        duplicateData(dupes);
        setDuplicates(dupes);
        saveChanges('phoneNumbers', nums);
    }

    return (
        <div className="multiple-field">
            {numbers.map((number, i) => {
                return (
                    <div key={`${number}-${i}`} className="multiple-field_item">
                        {(isEditMode && i !== 0) && (
                            <Button className="phone-group_remove multiple-field_remove" variant="text" disableElevation type='button' onClick={() => removeField(i)}>
                                <>
                                    <span aria-hidden="true" className="material-symbols-outlined red">delete</span>
                                    <span className="a11y-text font-body-bold">Remove phone number:{number}</span>
                                </>
                            </Button>
                        )}
                        <PhoneField number={number} index={i} fieldVarient={fieldVarient} isEditMode={isEditMode}
                                    handleFieldChange={handleFieldChange} isFirst={i === 0} isNew={isNew} error={fieldWithErrors[i]} />
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