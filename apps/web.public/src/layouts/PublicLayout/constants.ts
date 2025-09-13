import { type NotificationData } from '@mantine/notifications';

export const refusalNotificationChain: NotificationData[] = [
  {
    title: 'Am I a joke to you?',
    message: 'No way I\'m going to support this kind of crap 💩💩💩',
  }, {
    title: 'No, seriously',
    message: 'You will not be able to select this joke of a language',
  }, {
    title: 'Listen!',
    message: 'I\'m going to have to disable the option',
    color: 'orange',
  }, {
    title: 'Denied',
    message: 'Selecting non-existent language option disabled',
    color: 'red',
  }
]