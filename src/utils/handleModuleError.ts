import { logger } from "./logger.js";

export async function handleModuleError(
	error: any,
	operationName: string,
): Promise<boolean> {
	logger.error`Error in ${operationName}:\n${error}`;

	return true;
}
