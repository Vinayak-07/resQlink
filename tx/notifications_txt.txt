import * as Notifications from 'expo-notifications';

export async function scheduleLocalNotification(strings) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 ' + strings.startDrill,
        body: 'Time for your safety drill practice! Stay prepared, stay safe.',
        sound: true,
        data: { type: 'drill_reminder' }
      },
      trigger: { seconds: 5 }
    });
    
    console.log('Notification scheduled successfully');
  } catch (error) {
    console.log('Notification error:', error);
  }
}

export async function scheduleAlertNotification(alert) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Emergency Alert',
        body: alert.title + ': ' + alert.summary,
        sound: true,
        priority: 'high',
        data: { type: 'emergency_alert', alertId: alert.id }
      },
      trigger: null // Show immediately
    });
  } catch (error) {
    console.log('Alert notification error:', error);
  }
}
