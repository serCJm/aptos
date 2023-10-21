import { appendFile } from "fs/promises";

export function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloat(min: number, max: number, decimals: number) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

export function shuffleArr([...arr]: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export async function logToFile(
    filePath: string,
    message: string
): Promise<void> {
    try {
        await appendFile(filePath, message);
    } catch (error) {
        console.error(`Error writing to file: ${error}`);
    }
}