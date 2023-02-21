import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// redux
import { useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { users } = useSelector((state) => state.user);

  const currentUser = users.find((user) => user.StaffID === Number(id));

  console.log(currentUser)

  useEffect(() => {
    if (!currentUser) {
      window.location.replace(PATH_DASHBOARD.user.list);
    }
  }, [currentUser]);

  return (
    <>
      <Helmet>
        <title> User: Edit user | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit user"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'User',
              href: PATH_DASHBOARD.user.list,
            },
            { name: currentUser?.StaffName },
          ]}
        />

        <UserNewEditForm isEdit currentUser={currentUser} />
      </Container>
    </>
  );
}
