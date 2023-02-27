import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useState, useEffect, useMemo, } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// moment
import moment from 'moment';
// utils
import { fData } from '../../../utils/formatNumber';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// assets
import { countries } from '../../../assets/data';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';
// redux
import { getRoleType, createUser, } from '../../../redux/slices/user';
import { useDispatch, useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const statusTypes = [
  { name: 'Full Time', statusId: 1 },
  { name: 'Part Time', statusId: 2 },
  { name: 'Intern', statusId: 3 },
];

const genders = [
  { name: 'Male', value: 1 },
  { name: 'Female', calue: 2 },
];


export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const dispatch = useDispatch();

  const { roleTypes } = useSelector((state) => state.user);

  const [ProfilePictureName, setProfilePictureName] = useState('-');

  const [MediaType, setMediaType] = useState('-');

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
    recruitmentDate: Yup.string().required('Recruitment Date is required'),
    staffDOB: Yup.string().required('Date Of Birth is required'),
    username: Yup.string().required('Username is required'),
    userPassword: Yup.string().required('Password is required'),
    ICNo: Yup.string().required('IC Number is required'),
    address: Yup.string().required('Address is required'),
    // country: Yup.string().required('Country is required'),
    // company: Yup.string().required('Company is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    role: Yup.number().required('Role is required'),
    statusType: Yup.number().required('Status is required'),
    avatarUrl: Yup.string().required('Avatar is required').nullable(true),
  });

  const defaultValues = useMemo(
    () => ({

      name: currentUser?.StaffName || '',
      email: currentUser?.StaffEmail || '',
      phoneNumber: currentUser?.StaffPhone || '',
      gender: currentUser?.StaffGender || '',
      recruitmentDate: currentUser?.RecruitmentDate || null,
      staffDOB: currentUser?.StaffDateOfBirth || null,
      ICNo: currentUser?.ICorPassportNo || '',
      username: currentUser?.StaffUsername || '',
      userPassword: currentUser?.StaffPassword || '',
      address: currentUser?.StaffAddress || '',
      // country: currentUser?.country || '',
      // state: currentUser?.state || '',
      // city: currentUser?.city || '',
      // zipCode: currentUser?.zipCode || '',
      // profilePic: currentUser?.ProfilePictureName || '',
      // profilePicFileType: currentUser?.MediaType || '',
      // profilePic: ProfilePictureName || '',
      // profilePicFileType: MediaType || '',
      avatarUrl: `10.64.222.188/TaskMate/TaskMate_UploadedFiles/UserProfilePicture/${currentUser?.ProfilePictureName}.${currentUser?.MediaType}` || null,
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.StaffStatus,
      // statusId: currentUser?.StatusID || null,
      // company: currentUser?.company || '',
      role: currentUser?.StaffRole || '',
      
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    dispatch(getRoleType());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    const el = {}
    el.profilePic = ProfilePictureName;
    el.profilePicFileType = MediaType;

    console.log('DATA', user?.StaffID, data, typeof(data), ProfilePictureName, MediaType,);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('API', dispatch(createUser(user?.StaffID, data, ProfilePictureName, MediaType,)));
      dispatch(createUser(user?.StaffID, data, ProfilePictureName, MediaType,));
      
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.list);
    } catch (error) {
      console.error(error);
    }
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    //   navigate(PATH_DASHBOARD.user.list);
    //   console.log('DATA', data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      console.log("file", file.name, file.name.split('.')[0], file.name.split('.')[1])
      if (file) {
        setProfilePictureName(file.name.split('.')[0]);
        setMediaType(file.name.split('.')[1]);
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.statusId === 1 ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              {console.log('currentUser', currentUser)}
              {console.log('defaultValues', defaultValues.avatarUrl)}
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                src={defaultValues.avatarUrl}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFSelect native name="gender" label="Gender" placeholder="Gender">
                <option value="" />
                {genders.map((gender, index) => (
                  <option key={index} value={gender.value}>
                    {gender.name}
                  </option>
                ))}
              </RHFSelect>
              <Controller
                name="staffDOB"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    inputFormat='dd/MM/yyyy'
                    label="Date Of Birth"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(moment(newValue).format("YYYY/MM/DD"));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                    )}
                  />
                )}
              />
              <Controller
                name="recruitmentDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    inputFormat='dd/MM/yyyy'
                    label="Recruitment Date"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(moment(newValue).format("YYYY/MM/DD"));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                    )}
                  />
                )}
              />
              <RHFTextField name="ICNo" label="IC / Passport No." />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="username" label="Username" />
              <RHFTextField name="userPassword" label="Password" />
              {/* <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFTextField name="company" label="Company" /> */}
              <RHFSelect native name="role" label="Role" placeholder="Role">
                <option value="" />
                {/* {console.log('roleTypes', roleTypes)} */}
                {roleTypes.map((role, index) => (
                  <option key={index} value={role.RoleID}>
                    {role.RoleName}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="statusType" label="Status" placeholder="Status">
              <option value="" />
                {statusTypes.map((status, index) => (
                  <option key={index} value={status.statusId}>
                    {status.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
