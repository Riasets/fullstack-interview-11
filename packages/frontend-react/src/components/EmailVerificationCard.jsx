import React from 'react'
import {Box, Container, Typography} from '@mui/material';
import moment from "moment";

export function EmailVerificationCard({verification, showDetails}) {
  const onEmailClick = (e) => {
      e.preventDefault()
      showDetails(verification.id)
  }

  return (
    <Box width={'300px'} style={{backgroundColor: '#fff', borderRadius: '10px', padding: '15px'}}>
        <Typography onClick={e => onEmailClick(e)} style={{color: 'orange', cursor: 'pointer'}}>
         {verification.email}
        </Typography>
        <hr/>
        <Container style={{display: 'flex', justifyContent: 'flex-start', gap: '10px', padding: 0,}}>
          <Typography variant={'body2'}>Date: <b>{verification.created_at ? moment(verification.created_at).format('YYYY-MM-DD') : 'No Date'}</b></Typography>
          <Typography style={
                {
                  textTransform: 'capitalize',
                  color: verification.verification_result === 'valid' ? 'green': 'red'
                }
              }
                variant={'body2'}
            >
              <b>{verification.verification_result}</b>
            </Typography>
        </Container>
    </Box>
  );
}
