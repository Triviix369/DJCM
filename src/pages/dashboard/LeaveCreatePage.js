import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import LeaveNewEditForm from '../../sections/@dashboard/leaveApplication/LeaveNewEditForm';

// ----------------------------------------------------------------------

export default function LeaveCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> TaskMate: Create a new application | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new application"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'List',
              href: PATH_DASHBOARD.leaveApplication.root,
            },
            { name: 'New application' },
          ]}
        />
        <LeaveNewEditForm />
      </Container>
    </>
  );
}
