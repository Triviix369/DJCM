import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, InputAdornment, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// moment
import moment from 'moment';
// helpers
import { uploader } from '../../../utils/helpers';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../../components/hook-form';
// redux
import { getRemainingLeave, getTypeOfLeave, submitLeave } from '../../../redux/slices/leaveApplication';
import { useDispatch, useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

const leaveOption = [
  { label: 'Full day', value: 0 },
  { label: 'Morning session', value: 1 },
  { label: 'Afternoon session', value: 2 },
];

// ----------------------------------------------------------------------

LeaveNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentLeave: PropTypes.object
};

export default function LeaveNewEditForm({ isEdit, currentLeave }) {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const dispatch = useDispatch();

  const { types, isLoading, submission, leaves } = useSelector((state) => state.leave);

  const { enqueueSnackbar } = useSnackbar();

  const NewLeaveSchema = Yup.object().shape({
    type: Yup.number().required('Type of leave is required'),
    option: Yup.number().required('Option is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
    reason: Yup.string().required('Reason is required'),
    // attachments: Yup.array().min(1, 'Images is required').max(1, 'Only 1 image is allowed')
  });

  const defaultValues = useMemo(
    () => ({
      type: currentLeave?.LeaveTypeID || '',
      option: currentLeave?.option || '',
      reason: currentLeave?.LeaveReason || '',
      attachments: currentLeave?.attachments || [],
      startDate: currentLeave?.startDate || null,
      endDate: currentLeave?.endDate || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLeave]
  );

  const methods = useForm({
    resolver: yupResolver(NewLeaveSchema),
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
    console.log(currentLeave)
    if (isEdit && currentLeave) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentLeave]);

  useEffect(() => {
    dispatch(getTypeOfLeave(user?.StaffID, user?.RoleID));
  }, [dispatch, user]);

  useEffect(() => {
    console.log(submission)
    if (submission) {
      reset();
      enqueueSnackbar(!isEdit ? 'Submit success!' : 'Update success!');
      navigate(PATH_DASHBOARD.leaveApplication.root);
    }
  }, [submission, enqueueSnackbar, navigate, reset, isEdit]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(submitLeave(user?.StaffID, data));
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.attachments || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      console.log('file', newFiles)
      setValue('attachments', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.attachments]
  );

  const handleUpload = () => {
    const files = values.attachments || [];
    console.log(files)
    try {
      files.map(async (file) => {
        const filename = new Date().valueOf();
        const extension = file.name.split('.').pop();
        const newFilename = `${filename}${extension}`;
        setValue('filename', newFilename, { shouldValidate: true });
        const res = await uploader([file], [newFilename], 'LeaveSupportFilename')
        console.log(res)
      })
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = values.attachments && values.attachments?.filter((file) => file !== inputFile);
    setValue('attachments', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('attachments', []);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          <Card sx={{ p: 3, width: '100%' }}>
            <Stack spacing={3}>
              <RHFSelect native name="type" label="Type of leave">
                <option value="" />
                {types.map((type, index) => (
                  <option key={index} value={type.LeaveTypeID}>
                    {type.LeaveTypeName}
                  </option>
                ))}
              </RHFSelect>

              <Stack
                spacing={3}
                direction={{ xs: 'column', sm: 'row' }}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Leave option
                  </Typography>

                  <RHFRadioGroup row spacing={4} name="option" options={leaveOption} />
                </Stack>

                {/* Commented for now - Start */}
                {/* <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Multiple day
                  </Typography>

                  <RHFSwitch name="isHalfDay" />
                </Stack> */}
                {/* Commented for now - End */}
              </Stack>

              <Stack
                spacing={3}
                direction={{ xs: 'column', sm: 'row' }}
              >
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label="Start date"
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
                  name="endDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label="End date"
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
              </Stack>

              <RHFTextField name="reason" label="Reason" />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Attachments &nbsp;
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    (Optional)
                  </Typography>
                </Typography>

                <RHFUpload
                  multiple
                  thumbnail
                  name="attachments"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => handleUpload()}
                />
              </Stack>
            </Stack>
          </Card>

          <LoadingButton sx={{ mt: 3, width: '50%', lineHeight: 1.2 }} type="submit" variant="contained" size="large" loading={isSubmitting}>
            {!isEdit ? 'Submit Application' : 'Save Changes'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
