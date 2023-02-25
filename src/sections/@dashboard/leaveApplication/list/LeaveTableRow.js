import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
  Stack,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Link,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { CustomAvatar } from '../../../../components/custom-avatar';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

LeaveTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function LeaveTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { user } = useAuthContext();

  const { StaffName, cover, LeaveTypeName, ApprovalStatus, ActualLeaveDuration, LeaveReason } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {user?.RoleID === 1 ?
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CustomAvatar name={StaffName} />

              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {StaffName}
              </Link>
            </Stack>
          </TableCell>
          : null
        }

        <TableCell>{LeaveTypeName}</TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (ApprovalStatus === 'REJECTED' && 'error') ||
              (ApprovalStatus === 'PENDING' && 'warning') ||
              'success'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {ApprovalStatus ? sentenceCase(ApprovalStatus) : ''}
          </Label>
        </TableCell>

        <TableCell align="center">{ActualLeaveDuration}</TableCell>

        <TableCell align="left">{LeaveReason}</TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            // onEditRow();
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-outline" />
          View
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
