import fs from "fs/promises";

const COLOR_STYLES = {
    matrixGreen: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    lavender: "\x1b[38;5;140m",
    orange: "\x1b[38;5;214m",
    reset: "\x1b[0m",
} as const;

const LogLevel = {
    LOG: "log",
    ERROR: "error",
    WARN: "warn",
    INFO: "info",
    SUCCESS: "success",
    STEP: "info",
} as const;

type LogLevelType = (typeof LogLevel)[keyof typeof LogLevel];

export class logger {
    private static logFilePath = "log.txt";
    static #customPrepend: string = "";
    static #customPrependCache: string = "";

    public static setCustomPrepend(info: string): void {
        this.#customPrepend = info;
        this.#customPrependCache = info;
    }

    public static addCustomPrepend(info: string): void {
        this.#customPrepend = this.#customPrependCache + info;
    }

    static styleWithColor(
        text: string,
        color: keyof typeof COLOR_STYLES
    ): string {
        return `${COLOR_STYLES[color]}${text}${COLOR_STYLES.reset}`;
    }

    public static log(strings: TemplateStringsArray, ...values: any[]): void {
        this.logWithLevel(LogLevel.LOG, "lavender", strings, values);
    }

    public static error(strings: TemplateStringsArray, ...values: any[]): void {
        this.logWithLevel(LogLevel.ERROR, "red", strings, values);
    }

    public static warn(strings: TemplateStringsArray, ...values: any[]): void {
        this.logWithLevel(LogLevel.WARN, "orange", strings, values);
    }

    public static info(strings: TemplateStringsArray, ...values: any[]): void {
        this.logWithLevel(LogLevel.INFO, "cyan", strings, values, true);
    }

    public static success(
        strings: TemplateStringsArray,
        ...values: any[]
    ): void {
        this.logWithLevel(LogLevel.SUCCESS, "matrixGreen", strings, values);
    }

    private static logWithLevel(
        level: LogLevelType,
        color: keyof typeof COLOR_STYLES,
        strings: TemplateStringsArray,
        values: any[],
        overwrite: boolean = false
    ): void {
        const plainLogEntry = `[${level.toUpperCase()}] ${this.getFormattedTimestamp()} ${
            this.#customPrepend
        } ${String.raw(strings, ...values)}`;

        const styledLogEntry = `${this.styleWithColor(
            `[${level.toUpperCase()}]`,
            color
        )}${this.styleWithColor(this.getFormattedTimestamp(), color)} ${
            this.#customPrepend
        } ${String.raw(strings, ...values)}`;

        let logMethod = level;
        if (level === LogLevel.SUCCESS) logMethod = "log";

        if (overwrite) {
            process.stdout.write("\r\x1b[K" + styledLogEntry);
        } else {
            console[logMethod as "log" | "error" | "warn" | "info"](
                "\n" + styledLogEntry
            );
        }

        if (level === LogLevel.SUCCESS || level === LogLevel.ERROR)
            this.writeToFile(plainLogEntry);
    }

    private static getFormattedTimestamp(): string {
        const now = new Date();
        const pad = (num: number): string => num.toString().padStart(2, "0");
        return `[${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now
            .getFullYear()
            .toString()
            .substring(2)} ${pad(now.getHours())}:${pad(
            now.getMinutes()
        )}:${pad(now.getSeconds())}]`;
    }

    private static async writeToFile(content: string): Promise<any> {
        try {
            await fs.appendFile(this.logFilePath, content + "\n");
        } catch (err) {
            console.error("Error writing log to file:", err);
        }
    }
}
