import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
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
  Typography
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar'
//
import LeavePDF from './LeavePDF';
// redux
import { editLeaveStatus, resetLeaveStatusSubmit } from '../../../../redux/slices/leaveApplication';
import { useDispatch, useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

LeaveToolbar.propTypes = {
  leave: PropTypes.object,
};

export default function LeaveToolbar({ leave }) {
  const dispatch = useDispatch();
  const { leavestatus } = useSelector((state) => state.leave);
  const { enqueueSnackbar } = useSnackbar();
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

  const defaultValues = useMemo(
    () => ({
      leaveId: leave?.LeaveID || null,
      approval: leave?.ApprovalStatus || null,
      remarks: "-",
    }),
    [leave]
  );

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

  const onSubmit = () => {
    defaultValues.approval = defaultValues.approval === "APPROVED" ? "REJECTED" : "APPROVED"
    dispatch(editLeaveStatus(StaffID, defaultValues))
  };

  useEffect(()=>{
    if(leavestatus !== null && leavestatus !== undefined){
      enqueueSnackbar(leavestatus[0].ReturnVal === "1"? "Successfully updated status": "Error occured")
      dispatch(resetLeaveStatusSubmit()) 
      navigate(PATH_DASHBOARD.leaveApplication.root);
    }
  },[leavestatus, enqueueSnackbar, navigate, dispatch])

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
        <Button
          color="inherit"
          variant="outlined"
          onClick={onSubmit}
          startIcon={<Iconify icon="eva:checkmark-fill" />}
          sx={{ alignSelf: 'flex-end' }}
        >
          {
            ApprovalStatus === "APPROVED" ? "Mark as Reject" : "Mark as Approved"
          }
        </Button>
      </Stack>

      <Dialog open={open}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
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
