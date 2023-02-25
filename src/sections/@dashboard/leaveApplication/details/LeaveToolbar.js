import PropTypes from 'prop-types';
import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Stack,
  Button,
  Dialog,
  Tooltip,
  IconButton,
  DialogActions,
  CircularProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/iconify';
//
import LeavePDF from './LeavePDF';

// ----------------------------------------------------------------------

LeaveToolbar.propTypes = {
  leave: PropTypes.object,
};

export default function LeaveToolbar({ leave }) {
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

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    navigate(PATH_DASHBOARD.leaveApplication.edit(LeaveID));
  };

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit} disabled={ApprovalStatus !== 'PENDING'}>
              <Iconify icon="eva:edit-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="View">
            <IconButton onClick={handleOpen}>
              <Iconify icon="eva:eye-fill" />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            // document={<LeavePDF leave={leave} />}
            fileName={`LID-${LeaveID}`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Iconify icon="eva:download-fill" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>

          <Tooltip title="Print">
            <IconButton>
              <Iconify icon="eva:printer-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send">
            <IconButton>
              <Iconify icon="ic:round-send" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton>
              <Iconify icon="eva:share-fill" />
            </IconButton>
          </Tooltip>
        </Stack>
        {
          ApprovalStatus !== 'APPROVED' &&
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="eva:checkmark-fill" />}
            sx={{ alignSelf: 'flex-end' }}
          >
            Mark as Approved
          </Button>
        }
      </Stack>

      <Dialog fullScreen open={open}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={handleClose}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Tooltip>
          </DialogActions>

          {/* <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <LeavePDF leave={leave} />
            </PDFViewer>
          </Box> */}
        </Box>
      </Dialog>
    </>
  );
}
