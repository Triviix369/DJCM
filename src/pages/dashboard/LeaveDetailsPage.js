import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import LeaveDetails from '../../sections/@dashboard/leaveApplication/details';
// redux
import { useSelector, useDispatch } from '../../redux/store';

// ----------------------------------------------------------------------

export default function LeaveDetailsPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { leaves } = useSelector((state) => state.leave);

  const currentLeave = leaves.find((leave) => leave.LeaveID === Number(id));

  console.log(currentLeave);

  return (
    <>
      <Helmet>
        <title> Leave: View | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Leave Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'List',
              href: PATH_DASHBOARD.leaveApplication.root,
            },
            { name: `LID-${currentLeave?.LeaveID}` },
          ]}
        />

        <LeaveDetails leave={currentLeave} />
      </Container>
    </>
  );
}
