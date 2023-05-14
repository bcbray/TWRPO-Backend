import 'util';

declare global {
    interface String {
        indexOfRegex: (regex: RegExp, startPos?: number, failValue?: number) => number;
    }

    interface RegExpConstructor {
        escape: (str: string) => string;
    }
}

// eslint-disable-next-line func-names
String.prototype.indexOfRegex = function (regex: RegExp, startPos = 0, failValue = -1): number {
    const indexOf = this.substring(startPos).search(regex);
    return indexOf >= 0 ? indexOf + (startPos) : failValue;
};

// eslint-disable-next-line func-names
RegExp.escape = function (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
