import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
import { getLeaveApplications, deleteLeaveApplications, } from '../../redux/slices/leaveApplication';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import ConfirmDialog from '../../components/confirm-dialog';

import { useAuthContext } from '../../auth/useAuthContext';
// sections
import { LeaveTableRow, LeaveTableToolbar } from '../../sections/@dashboard/leaveApplication/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'StaffName', label: 'Name', align: 'left' },
  { id: 'LeaveTypeName', label: 'Type', align: 'left' },
  { id: 'ApprovalStatus', label: 'Status', align: 'center', width: 180 },
  { id: 'duration', label: 'Duration', align: 'left' },
  { id: 'LeaveReason', label: 'Reason', align: 'left' },
  { id: '' }
];

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

// ----------------------------------------------------------------------

export default function LeaveApplicationListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user, logout } = useAuthContext();

  const { leaves, isLoading } = useSelector((state) => state.leave);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    console.log(user)
    dispatch(getLeaveApplications(user?.StaffID, user?.RoleID));
    if (user?.RoleID !== 1) {
      TABLE_HEAD.shift();
    } else {
      // eslint-disable-next-line no-lonely-if
      if (TABLE_HEAD[0].id !== 'StaffName') {
        TABLE_HEAD.unshift({ id: 'StaffName', label: 'Name', align: 'left' },);
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (leaves.length) {
      console.log(leaves)
      setTableData(leaves);
    }
  }, [leaves]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    roleId: user?.RoleID
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const rowsAfterDeletion = tableData.filter((row) => row.LeaveID !== id);
    const LeaveToBeDeleted = tableData.filter((row) => row.LeaveID === id).map((x) => x.LeaveID);
    console.log('rowtodelete', LeaveToBeDeleted);
    setSelected([]);
    setTableData(rowsAfterDeletion);
    handleDeleteLeave(LeaveToBeDeleted);
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const rowsAfterDeletion = tableData.filter((row) => !selectedRows.includes(row.LeaveID));
    const LeavesToBeDeleted = tableData.filter((row) => selectedRows.includes(row.LeaveID)).map((x) => x.LeaveID);
    console.log('rowstodelete', LeavesToBeDeleted);
    setSelected([]);
    setTableData(rowsAfterDeletion);
    handleDeleteLeave(LeavesToBeDeleted);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleDeleteLeave = (leaveID) => {
    try {
      dispatch(deleteLeaveApplications(user?.StaffID, leaveID));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.leaveApplication.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.leaveApplication.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Helmet>
        <title> Ecommerce: Leave Application List | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Leave Application List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              onClick = {console.log('rthr', PATH_DASHBOARD.leaveApplication.new)}
              to={PATH_DASHBOARD.leaveApplication.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Application
            </Button>
          }
        />

        <Card>
          <LeaveTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.LeaveID)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.LeaveID)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <LeaveTableRow
                          key={row.LeaveID}
                          row={row}
                          selected={selected.includes(row.LeaveID)}
                          onSelectRow={() => onSelectRow(row.LeaveID)}
                          onDeleteRow={() => handleDeleteRow(row.LeaveID)}
                          onEditRow={() => handleEditRow(row.LeaveID)}
                          onViewRow={() => handleViewRow(row.LeaveID)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, roleId }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    if (roleId === 1) {
      inputData = inputData.filter(
        (leave) => leave.StaffName?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    } else {
      inputData = inputData.filter(
        (leave) => leave.LeaveReason?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    }
  }

  if (filterStatus.length) {
    inputData = inputData.filter((leave) => filterStatus.includes(leave.ApprovalStatus));
  }

  return inputData;
}
