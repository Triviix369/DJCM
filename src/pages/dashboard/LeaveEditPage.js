import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import LeaveNewEditForm from '../../sections/@dashboard/leaveApplication/LeaveNewEditForm';
// redux
import { useSelector } from '../../redux/store';

// ----------------------------------------------------------------------

export default function LeaveEditPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { leaves } = useSelector((state) => state.leave);

  const currentLeave = leaves.find((leave) => leave.LeaveID === Number(id));

  return (
    <>
      <Helmet>
        <title> TaskMate: Edit an application | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit an application"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'List',
              href: PATH_DASHBOARD.leaveApplication.root,
            },
            {
              name: `LID-${id}`,
              href: PATH_DASHBOARD.leaveApplication.view(id),
            },
            { name: 'Edit' },
          ]}
        />
        <LeaveNewEditForm isEdit currentLeave={currentLeave} />
      </Container>
    </>
  );
}
