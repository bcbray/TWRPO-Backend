export interface LogMethod {
    (message: string, ...meta: any[]): void;
    (message: any): void;
}

export interface Logger {
    emerg: LogMethod;
    alert: LogMethod;
    crit: LogMethod;
    error: LogMethod;
    warning: LogMethod;
    notice: LogMethod;
    info: LogMethod;
    debug: LogMethod;
}
