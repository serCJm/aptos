import { setTimeout } from "timers/promises";
import { logger } from "./logger.js";

export async function asyncRetry<U extends any[]>(
	operation: () => Promise<void>,
	errorHandler: (error: any, ...errorHandlerArgs: U) => Promise<boolean>,
	errorHandlerArgs: U,
	maxRetries: number = 3,
	retryDelayMs: number = 10000,
) {
	let retries = 0;

	while (retries < maxRetries) {
		try {
			await operation();
			return;
		} catch (error: any) {
			const shouldRetry = await errorHandler(error, ...errorHandlerArgs);

			if (shouldRetry) {
				retries++;
				logger.info`Retrying operation in ${
					retryDelayMs / 1000
				} seconds...`;
				await setTimeout(retryDelayMs);
			} else {
				throw error;
			}
		}
	}

	throw new Error("Maximum number of retries reached.");
}
