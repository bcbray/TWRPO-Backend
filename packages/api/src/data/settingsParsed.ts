import * as settings from './settings';

type settingsKeys = keyof typeof settings;

const settingsParsed = {} as { [key in settingsKeys]: any };

for (const [key, value] of Object.entries(settings)) {
    if (typeof value === 'function') continue;
    let newValue: any = value;
    if (value instanceof RegExp) {
        newValue = value.source;
    }
    (settingsParsed as any)[key] = newValue;
}

export default settingsParsed;
