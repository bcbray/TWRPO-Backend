import * as settings from './settings';

type settingsKeys = keyof typeof settings;

const settingsParsed = {} as { [key in settingsKeys]: any };

for (const [key, value] of Object.entries(settings)) {
    if (typeof value === 'function') continue;
    (settingsParsed as any)[key] = value;
}

export default settingsParsed;
