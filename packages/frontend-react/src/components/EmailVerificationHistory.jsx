import { useState, useEffect } from 'react';
import { AddVerification } from './AddVerification'
import { EmailVerificationDetails } from './EmailVerificationDetails'
import { EmailVerificationCard } from './EmailVerificationCard'
import {Container, Typography, Button, Snackbar, Modal, CircularProgress} from "@mui/material";

export function EmailVerificationHistory () {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [emailVerifications, setEmailVerifications] = useState([]);
  const [emailVerification, setEmailVerification] = useState({});
  const [isNotificationOpened, setIsNotificationOpened] = useState(false);
  const [notificationText, setNotificationText] = useState('');

  const fetchEmailVerifications = () => {
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/emails`)
          .then((response) => response.json())
          .then((json) => {
              setEmailVerifications(json)
              setIsLoading(false)
          })
          .catch((error) => console.log(error));
  }


  const addEmailVerification = ({email}) => {
      setIsLoading(true)
      setIsAddOpen(false)
      fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/verify`,
          {
              method: 'post',
              body: JSON.stringify({email}),
              headers: {'Content-Type': 'application/json'}
          }
     )
      .then((response) => {
        setNotificationText('Email validated!');
        setIsNotificationOpened(true);
        return response.json()
      })
      .then((json) => {
          fetchEmailVerifications()
      })
      .catch((error) => {
        setNotificationText('Error!');
        setIsNotificationOpened(true);
        console.log(error)
      });
  }

  const showDetailsModal = (verificationId) => {
      setIsDetailsOpen(true)
      setEmailVerification(
          emailVerifications.filter(emailVerification => emailVerification.id === verificationId)[0]
      )
  }

  useEffect(() => {
      fetchEmailVerifications()
  }, []);

  return (
    <div style={{backgroundColor: '#f5f5f5', width: '100%', height: '100%'}}>
      <Modal open={isLoading}><CircularProgress style={{position: 'absolute', top: '50%', left: '50%'}}/></Modal>
      <Container maxWidth={'none'} style={{padding: '50px'}}>
        <Container
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 0,
          }}
          maxWidth={'none'}
        >
            <Typography variant={"h4"}>Email Verification History</Typography>
            <Button variant="contained" style={{background: 'orange', borderRadius: '20px'}} onClick={() => {setIsAddOpen(true)}}>Verify Email</Button>
        </Container>

        <AddVerification isOpen={isAddOpen} close={() => setIsAddOpen(false)} addEmailVerification={addEmailVerification} />
        <EmailVerificationDetails isOpen={isDetailsOpen} emailVerification={emailVerification} closeDetails={() => {setIsDetailsOpen(false)}} />

        <Container
          maxWidth={'none'}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            padding: 0,
            marginTop: '15px',
            gap: '10px'
          }}
        >
        {
            emailVerifications.length ?
                emailVerifications.map(
                    (emailVerification) =>
                    <EmailVerificationCard key={emailVerification.id} verification={emailVerification} showDetails={showDetailsModal}/>
                ) :
                <button>Verify Email</button>
        }
        </Container>
      </Container>
      <Snackbar
      open={isNotificationOpened}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      onClose={() => setIsNotificationOpened(false)}
      autoHideDuration={6000}
      message={notificationText}
      />
    </div>
  );
}
