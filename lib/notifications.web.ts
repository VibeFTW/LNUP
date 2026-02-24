export async function registerForPushNotifications(): Promise<string | null> {
  return null;
}

export async function savePushToken(_token: string): Promise<void> {}

export async function removePushToken(_token: string): Promise<void> {}

export async function scheduleEventReminder(
  _eventId: string,
  _title: string,
  _venueName: string,
  _eventDate: string,
  _timeStart: string
): Promise<string | null> {
  return null;
}

export async function cancelScheduledNotification(
  _notificationId: string
): Promise<void> {}
