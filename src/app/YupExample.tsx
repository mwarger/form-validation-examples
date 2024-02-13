import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { MessageTypeEnum, messageTypeOptionsArray } from './messageTypeOptions';

const phoneNumberSchema = yup
  .string()
  .when('messageType', ([messageType], schema) => {
    return messageType === 'phone'
      ? schema.required().test('Invalid phone number', (val) => {
          if (val === undefined || val === null || val === '') {
            return false;
          }

          const results = isValidPhoneNumber(val, 'US');
          return results;
        })
      : schema.optional();
  });

const schema = yup
  .object({
    messageType: yup
      .mixed()
      .oneOf(messageTypeOptionsArray, 'Invalid message type'),
    message: yup
      .string()
      .required('Message is required')
      .when('messageType', {
        is: 'sms',
        then: (schema) => schema.max(140),
        otherwise: (schema) => schema.max(2000),
      }),
    phoneNumber: phoneNumberSchema,
    recipients: yup.string(),
  })
  .required();

type FormInputs = yup.InferType<typeof schema>;

export function YupExample() {
  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      messageType: '',
      message: '',
      phoneNumber: '',
      recipients: '',
    },
  });
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('yup success');

    if (data.messageType === MessageTypeEnum.enum.Email) {
      console.log('email', data);
    }

    // this should be an error since SMS is supposed to be 'sms'
    if (data.messageType === 'SMS') {
      console.log('sms', data);
    }

    if (data.messageType === MessageTypeEnum.enum.Phone) {
      console.log('phone', data);
    }

    // this does not throw an error because yup doesn't get correct type info
    if (data.messageType === 'whatsapp') {
      console.log('whatsapp', data);
    }
  };

  const onError: SubmitErrorHandler<FormInputs> = (errors, e) => {
    console.log('yup error', errors);
  };

  const values = watch();

  if (isSubmitSuccessful) {
    if (values.messageType === MessageTypeEnum.enum.Email) {
      console.log('email', values);
      return (
        <>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <Button onClick={() => reset()}>Reset</Button>
        </>
      );
    }

    if (values.messageType === MessageTypeEnum.enum.SMS) {
      console.log('sms', values);
      return (
        <>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <Button onClick={() => reset()}>Reset</Button>
        </>
      );
    }

    if (values.messageType === MessageTypeEnum.enum.Phone) {
      console.log('phone', values);
      return (
        <>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <Button onClick={() => reset()}>Reset</Button>
        </>
      );
    }
  }

  return (
    <Stack gap={2} width={'100%'}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack gap={1} direction={'column'}>
          <Typography>Yup Conditional Form Example</Typography>
          <Controller
            name="messageType"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <TextField select {...field} label="Message Type">
                  <MenuItem value={''}>None</MenuItem>
                  <MenuItem value={'email'}>Email</MenuItem>
                  <MenuItem value={'sms'}>SMS</MenuItem>
                  <MenuItem value={'phone'}>Phone</MenuItem>
                </TextField>
                {invalid && (
                  <Typography color="error">{error?.message}</Typography>
                )}
              </>
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <TextField {...field} label="Phone Number" />
                {invalid && (
                  <Typography color="error">{error?.message}</Typography>
                )}
              </>
            )}
          />
          <Controller
            name="message"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <TextField
                  multiline
                  minRows={4}
                  fullWidth
                  {...field}
                  label="Message"
                />
                {invalid && (
                  <Typography color="error">{error?.message}</Typography>
                )}
              </>
            )}
          />
          <Controller
            name="recipients"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <TextField minRows={4} {...field} label="Recipients" />
                {invalid && (
                  <Typography color="error">{error?.message}</Typography>
                )}
              </>
            )}
          />

          <input type="submit" />

          <Typography>Values</Typography>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <Typography>Errors</Typography>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        </Stack>
      </form>
    </Stack>
  );
}
