import {
  useForm,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { TextField, Typography, Stack, MenuItem, Button } from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  messageTypeOptionsWithLabelsAndEmpty,
  MessageTypeEnum,
} from './messageTypeOptions';

const commonFields = z.object({ recipients: z.string().optional() });

const messageSchema = z
  .string({
    required_error: 'Message is required',
  })
  .min(1, { message: 'Message is required' })
  .max(2000);

const emailSchema = z.object({
  messageType: z.literal(MessageTypeEnum.enum.Email),
  message: messageSchema,
});

type EmailFormInputs = z.infer<typeof emailSchema>;

const smsSchema = z.object({
  messageType: z.literal(MessageTypeEnum.enum.SMS),
  message: z
    .string({
      required_error: 'Message is required',
    })
    .min(1, { message: 'Message is required' })
    .max(140),
});

const phoneNumberSchema = z.string().refine(
  (val) => {
    if (val === undefined || val === null || val === '') {
      return false;
    }
    const results = isValidPhoneNumber(val, 'US');
    return results;
  },
  { message: 'Invalid phone number' }
);

const phoneSchema = z.object({
  messageType: z.literal(MessageTypeEnum.enum.Phone),
  message: messageSchema,
  phoneNumber: phoneNumberSchema,
});

const schema = z
  .discriminatedUnion('messageType', [emailSchema, smsSchema, phoneSchema], {
    description: 'Message type',
    errorMap: (error, ctx) => {
      if (error.code === z.ZodIssueCode.invalid_union_discriminator) {
        return { message: 'Invalid message type' };
      }

      if (error.code === z.ZodIssueCode.invalid_type) {
        return { message: 'Invalid message type' };
      }

      return { message: ctx.defaultError };
    },
  })
  .and(commonFields);

type FormInputs = z.infer<typeof schema>;

export function ZodExample() {
  const {
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      messageType: '' as FormInputs['messageType'],
      message: '',
      phoneNumber: '',
      recipients: '',
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('zod success');

    if (data.messageType === MessageTypeEnum.enum.Email) {
      console.log('email', data);
    }

    if (data.messageType === 'SMS') {
      console.log('sms', data);
    }

    if (data.messageType === MessageTypeEnum.enum.Phone) {
      console.log('phone', data);
    }

    if (data.messageType === 'whatsapp') {
      console.log('whatsapp', data);
    }
  };
  const onError: SubmitErrorHandler<FormInputs> = (errors, e) => {
    console.log('zod error', errors);
  };

  const values = watch();

  if (isSubmitSuccessful) {
    if (values.messageType === MessageTypeEnum.enum.Email) {
      console.log('email', values);
      return (
        <>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <EmailViewer {...values} />
          <Button onClick={() => reset()}>Reset</Button>
        </>
      );
    }

    if (values.messageType === MessageTypeEnum.enum.SMS) {
      console.log('sms', values);
      return (
        <>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <EmailViewer {...values} />
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
      <form
        onSubmit={handleSubmit((data) => onSubmit(data as FormInputs), onError)}
      >
        <Stack gap={1} direction={'column'}>
          <Typography>Zod Conditional Form Example</Typography>
          <Controller
            name="messageType"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <TextField select {...field} label="Message Type">
                  {messageTypeOptionsWithLabelsAndEmpty.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
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
                <TextField multiline minRows={4} {...field} label="Message" />
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

function EmailViewer(props: EmailFormInputs) {
  return <div>Email {props.message}</div>;
}
