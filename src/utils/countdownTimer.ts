import { randomNumber } from "./utils.js";

function formatTime(seconds: number): string {
    const hours: number = Math.floor(seconds / 3600);
    const minutes: number = Math.floor((seconds % 3600) / 60);
    const remainingSeconds: number = seconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

export let cancelCountdown: () => void = () => {};

export async function countdownTimer(
    minSeconds: number,
    maxSeconds: number = minSeconds
): Promise<void> {
    return new Promise<void>((resolve) => {
        const progressBarWidth: number = 60;
        const seconds: number = randomNumber(minSeconds, maxSeconds);
        let remainingSeconds: number = seconds;
        let isCancelled: boolean = false;

        cancelCountdown = () => {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write("\n");
            isCancelled = true;
        };

        process.stdout.write("\n\x1b[32m");

        const interval = setInterval(async () => {
            if (isCancelled) {
                clearInterval(interval);
                resolve();
                return;
            }

            const formattedTime: string = formatTime(remainingSeconds);
            const progress: number = Math.round(
                (remainingSeconds / seconds) * progressBarWidth
            );
            const progressBar: string = "\x1b[42m".concat(
                " ".repeat(progress),
                "\x1b[0m".concat(" ".repeat(progressBarWidth - progress))
            );

            process.stdout.cursorTo?.(0);
            process.stdout.write(
                `Countdown: ${formattedTime} [${progressBar}]`
            );
            remainingSeconds--;

            if (remainingSeconds < 0) {
                clearInterval(interval);
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write("\x1b[0m");
                process.stdout.write("Countdown complete!");
                process.stdout.write("\n");
                resolve();
            }
        }, 1000);
    });
}
