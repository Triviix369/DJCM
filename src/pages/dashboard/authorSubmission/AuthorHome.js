import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
    Tab,
    Tabs,
    Card,
    Table,
    Button,
    Tooltip,
    Divider,
    TableBody,
    Container,
    IconButton,
    TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
// import { AuthorJournalTableToolbar, UserTableRow } from '../../../sections/@dashboard/authorSubmission/list';

// ----------------------------------------------------------------------
export default function AuthorHome() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Author Home </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'} >
                <CustomBreadcrumbs
                    heading="Author Submission Listing"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Listing' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            to={PATH_DASHBOARD.user.new}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New Submission
                        </Button>
                    }
                />
                {/* <Card>
                    
                </Card> */}
            </Container>
        </>
    );
}