import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Scrollbar from '../../../../components/scrollbar';
//
import LeaveToolbar from './LeaveToolbar';

// ----------------------------------------------------------------------

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

LeaveDetails.propTypes = {
  leave: PropTypes.object,
};

export default function LeaveDetails({ leave }) {
  if (!leave) {
    return null;
  }

  const {
    AppliedDate,
    ApprovalStatus,
    IsLeaveHalfDay,
    LeaveAttachments,
    LeaveDateFrom,
    LeaveDateTo,
    LeaveDuration,
    LeaveID,
    LeaveReason,
    LeaveTypeID,
    LeaveTypeName,
    Remarks,
    StaffID,
    StaffName,
  } = leave;

  return (
    <>
      <LeaveToolbar leave={leave} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image disabledEffect alt="logo" src="/logo/logo_full.svg" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant="soft"
                color={
                  (ApprovalStatus === 'APPROVED' && 'success') ||
                  (ApprovalStatus === 'PENDING' && 'warning') ||
                  (ApprovalStatus === 'REJECTED' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {ApprovalStatus}
              </Label>

              <Typography variant="h6">{`LID-${LeaveID}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Person
            </Typography>

            <Typography variant="body2">{StaffName}</Typography>

            <Typography variant="body2">ID: {StaffID}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Reason
            </Typography>

            <Typography variant="body2">{LeaveReason}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Start date
            </Typography>

            <Typography variant="body2">{fDate(LeaveDateFrom)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              End date
            </Typography>

            <Typography variant="body2">{fDate(LeaveDateTo)}</Typography>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Attachment
            </Typography>

            <Typography variant="body2">{fDate(LeaveDateTo)}</Typography>
          </Grid>
        </Grid>

        {/* <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>

                  <TableCell align="left">Description</TableCell>

                  <TableCell align="left">Qty</TableCell>

                  <TableCell align="right">Unit price</TableCell>

                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.title}</Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {row.description}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="left">{row.quantity}</TableCell>

                    <TableCell align="right">{fCurrency(row.price)}</TableCell>

                    <TableCell align="right">{fCurrency(row.price * row.quantity)}</TableCell>
                  </TableRow>
                ))}

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    Subtotal
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    {fCurrency(subTotalPrice)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Discount
                  </TableCell>

                  <TableCell
                    align="right"
                    width={120}
                    sx={{ color: 'error.main', typography: 'body1' }}
                  >
                    {discount && fCurrency(-discount)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Taxes
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    {taxes && fCurrency(taxes)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'h6' }}>
                    Total
                  </TableCell>

                  <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                    {fCurrency(totalPrice)}
                  </TableCell>
                </StyledRowResult>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer> */}

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>

            <Typography variant="body2">
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>

            <Typography variant="body2">support@minimals.cc</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
