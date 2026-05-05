import { db } from '../db/localDB';

export const getOrGenerateDeviceId = async () => {
  let deviceIdConfig = await db.appConfig.get('deviceId');
  if (!deviceIdConfig) {
    const newId = `DEV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    await db.appConfig.put({ key: 'deviceId', value: newId });
    return newId;
  }
  return deviceIdConfig.value;
};