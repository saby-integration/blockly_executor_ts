import {getNumberWithLeadingZeros} from './helpers';

const patterns: {[key: string]: Function} = {
    Y: (date: Date) => date.getFullYear(),
    m: (date: Date) => date.getMonth() + 1,
    d: (date: Date) => date.getDate(),
    H: (date: Date) => date.getHours(),
    M: (date: Date) => date.getMinutes(),
    S: (date: Date) => date.getSeconds(),
    f: (date: Date) => date.getMilliseconds()
};

export function dateFormat(date: Date, pattern: string): string {
    const regex = new RegExp(Object.keys(patterns).map(key => key).join('|'), 'gi');
    return pattern.replace(regex, substring => {
        const func = patterns[substring];
        if (func) {
            return getNumberWithLeadingZeros(func(date));
        }
        return substring;
    });
}
