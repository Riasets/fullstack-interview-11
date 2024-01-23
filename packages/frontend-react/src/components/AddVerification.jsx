import { useState } from 'react';
import styles from './AddVerification.module.css';
import {Paper, Typography, Button, Modal, TextField} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
};
export function AddVerification({isOpen, addEmailVerification, close}) {
    const [email, setEmail] = useState();
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()



      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
        if (isValid) {
          setError(false);
          addEmailVerification({email})
          setEmail('');
        } else {
          setError(true);
        }

    }

    return (
      <Modal open={isOpen} onClose={close}>
        <Paper sx={style} elevation={3}>
          <Typography variant="h5" textAlign={'center'}>New Email Verification</Typography>
          <div>
            <TextField
              error={error}
              helperText={error? 'Invalid email': ''}
              margin={'normal'}
              fullWidth={true}
              label={'Email Address'}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={e => { handleSubmit(e)}} variant="contained" style={{background: 'orange', width: '100%', marginTop: '15px', borderRadius: '20px'}}>Submit</Button>
        </Paper>
      </Modal>
    )
}
