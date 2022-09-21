import { Request } from "express";

export class ParamError extends Error {
    constructor(public message: string) {
        super();
    }
}

export const queryParamString = (query: Request['query'] | URLSearchParams, name: string): undefined | string => {
    const param = query instanceof URLSearchParams
        ? query.get(name)
        : query[name];
    if (param === undefined || param === null) {
        return undefined;
    }
    if (typeof param !== 'string') {
        throw new ParamError(`'${name}' parameter must be a string`);
    }
    return param;
};

export const queryParamDate = (query: Request['query'] | URLSearchParams, name: string): undefined | Date => {
    const stringParam = queryParamString(query, name);
    if (stringParam === undefined) {
        return undefined;
    }
    const date = new Date(stringParam);
    if (Number.isNaN(date.getTime())) {
        throw new ParamError(`'${stringParam}' is not a valid date for '${name}'. Must use ISO 8601 format.`);
    }
    return date;
};

export const queryParamBoolean = (query: Request['query'] | URLSearchParams, name: string): undefined | boolean => {
    const stringParam = queryParamString(query, name);
    if (stringParam === undefined) {
        return undefined;
    }
    if (stringParam === 'true') {
        return true;
    }
    if (stringParam === 'false') {
        return false;
    }
    throw new ParamError(`'${stringParam}' is not a valid boolean for '${name}'. Must be "true" or "false".`);
};

export const queryParamInteger = (query: Request['query'] | URLSearchParams, name: string): undefined | number => {
    const stringParam = queryParamString(query, name);
    if (stringParam === undefined) {
        return undefined;
    }
    const num = Number(stringParam);
    if (!Number.isInteger(num) || String(num) !== stringParam) {
        throw new ParamError(`'${stringParam}' is not a valid valie for '${name}'.`);
    }
    return num;
};
