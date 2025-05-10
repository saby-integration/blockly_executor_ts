import SimpleBlock from '../BlockTemplates/SimpleBlock';

export function getClass(cls: string): Promise<SimpleBlock> {
    return import(cls);
}

export function snakeCaseToUpperCamelCase(str: string): string {
    const newStr = str
        .replace(/_\w/gi, match => match[1].toUpperCase());
    return `${newStr[0].toUpperCase()}${newStr.slice(1)}`;
}

export function guid(): string {
    // tslint:disable-next-line:no-magic-numbers
    return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c =>
        // @ts-ignore
        // tslint:disable-next-line:no-bitwise
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function getNumberWithLeadingZeros(num: number): string {
    return num <= 9 ? `0${num}` : `${num}`;
}

export function objGetPathValue(obj: any, path: string, params?: any): any {
    const delimiter = params?.delimiter || '.';
    const _path = path.split(delimiter);
    let _obj = obj;
    let i = 0;
    const size = _path.length;
    while (i < size) {
        const elem = _path[i];
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            _obj = _obj[elem];
        } else if (Array.isArray(obj)) {
            if (Number.isInteger(elem)) {
                _obj = _obj[+elem];
            } else {
                const index = ArrayHelper.find<any>(obj, _path[i + 1], elem);
                if (index >= 0) {
                    _obj = _obj[index];
                    i += 1;
                } else {
                    return null;
                }
            }
        } else {
            throw new Error(`obj_get_path_value: type in path ${path} not supported (${obj})`);
        }
        if (!_obj) {
            break;
        }
        i += 1;
        return _obj;
    }
}

class ArrayHelper {
    static find<T>(items: T[], value: T, field: string = 'id'): number {
        for (let i = 0; i < items.length; i++) {
            if (items[i][field] === value) {
                return i;
            }
        }
        return -1;
    }
}
