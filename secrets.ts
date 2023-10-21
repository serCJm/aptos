import fs from "fs/promises";
import { logger } from "./src/utils/logger.js";

export const PRIVATE_KEYS = await importPrivateKeys(
	"resources/private-keys.txt",
);

async function importPrivateKeys(path: string) {
	const EXCLUDED_WALLETS = await importExcludedWallets(
		"resources/excluded-wallets.txt",
	);

	const text = await fs.readFile(path, "utf8");

	const lines = text.split("\n");

	const privateKeys: Record<string, string> = {};

	lines.forEach((line: string) => {
		const [name, privateKey] = line.trim().replace("\r", "").split(":");
		if (EXCLUDED_WALLETS.has(name)) {
			logger.info`Skipping wallet ${name} as it's in the excluded list.`;
			return;
		}
		privateKeys[name] = privateKey;
	});
	return privateKeys;
}

async function importExcludedWallets(path: string) {
	const text = await fs.readFile(path, "utf8");

	const lines = text.split(",");

	const excludedWallets = lines.map((line: string) =>
		line.trim().replace("\r", ""),
	);
	return new Set(excludedWallets);
}
