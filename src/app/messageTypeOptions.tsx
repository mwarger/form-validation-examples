import { z } from 'zod';

export const messageTypeOptions = {
  Email: 'email',
  SMS: 'sms',
  Phone: 'phone',
} as const;
export const MessageTypeEnum = z.nativeEnum(messageTypeOptions);

export const messageTypeOptionsArray = Object.values(messageTypeOptions);
export const messageTypeLabelsArray = Object.keys(messageTypeOptions);

export const messageTypeOptionsWithLabels = messageTypeOptionsArray.map(
  (option, index) => ({
    value: option,
    label: messageTypeLabelsArray[index],
  })
);

export const messageTypeOptionsWithLabelsAndEmpty = [
  { value: '', label: 'None' },
  ...messageTypeOptionsWithLabels,
];
