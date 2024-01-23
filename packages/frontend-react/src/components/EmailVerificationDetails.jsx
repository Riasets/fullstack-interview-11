import {Paper, Typography, Button, Modal, TableContainer, Container, TableHead, TableRow, TableBody, TableCell} from '@mui/material';
import {isNumber, map} from "lodash";
import moment from "moment/moment";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  p: 4,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
};

const fields = {
  domain: 'Domain',
  is_banned: 'Banned',
  is_disposable_mail: 'Dispossable Mail',
  is_dns_valid_mx: 'DNS Valid MX',
  is_free_mail: 'Free Mail',
  is_private: 'Private',
  is_private_mail: 'Private Mail',
  is_smtp_catch_all: 'SMTP Catch All',
  is_smtp_valid: 'SMTP Valid',
}
export function EmailVerificationDetails({isOpen, emailVerification, closeDetails}) {
    return (
        <Modal open={isOpen}>
          <Paper sx={style}>
            <Container
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                gap: '10px',
              }}
            >
              <Typography variant={'h5'} textAlign={'center'}>Email Verification result for {emailVerification.email}</Typography>
              <Typography variant={'body1'} textAlign={'center'}>Date:<b>{emailVerification.created_at ? moment(emailVerification.created_at).format('YYYY-MM-DD') : 'No Date'}</b></Typography>
              <Typography variant={'body1'} textAlign={'center'}>Last verified at:<b>{emailVerification.last_verified_at ? moment(emailVerification.last_verified_at).format('YYYY-MM-DD') : 'No Date'}</b></Typography>
              <Typography variant={'h5'} textAlign={'center'}>Email is {emailVerification.verification_result}</Typography>
            </Container>
              <TableContainer>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map(emailVerification, (value, field) => {
                    if (fields[field] && isNumber(value)) {
                      return (<TableRow key={field}><TableCell>{fields[field]}</TableCell><TableCell>{value? 'yes': 'no'}</TableCell></TableRow>)
                    }
                    return null;
                  })}
                </TableBody>
              </TableContainer>

              <div>
                  <Button onClick={closeDetails}>Close</Button>
              </div>
          </Paper>
        </Modal>
    )
}
