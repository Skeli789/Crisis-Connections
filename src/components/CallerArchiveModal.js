import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export default function Modal ({modalOpen, setModalOpen, textAreaProps, archiveUser}) {
    const [archiveReason, setArchiveReason] = useState('');
            
    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleModalContinue = (e) => {
        setModalOpen(false);
        archiveUser(archiveReason);
        // send updated data to parent
    };

    return (
        <Dialog
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure you want to archive this profile?</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        fullWidth
                        id="archiveReason"
                        label="Archive Reason"
                        variant='outlined'
                        InputProps={textAreaProps}
                        onChange={(e) => { setArchiveReason(e.target.value)}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>Cancel</Button>
                    <Button onClick={(e) => {handleModalContinue(e)}}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
    )
}