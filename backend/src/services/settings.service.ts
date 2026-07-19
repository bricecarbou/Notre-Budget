import { prisma } from "../lib/prisma";

const SETTINGS_ID = "singleton";

export async function getAppSettings() {
  const settings = await prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
  return settings;
}

export async function getMonthStartDay() {
  const settings = await getAppSettings();
  return settings.monthStartDay;
}

export async function updateAppSettings(data: { monthStartDay: number }) {
  return prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });
}
