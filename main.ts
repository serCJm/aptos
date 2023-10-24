import { GLOBAL_CONFIG } from "./MODULES_CONFIG.js";
import { PRIVATE_KEYS } from "./secrets.js";
import { runModules } from "./src/runModules.js";
import { WalletManager } from "./src/services/wallet-manager.js";
import { countdownTimer } from "./src/utils/countdownTimer.js";
import { logger } from "./src/utils/logger.js";

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "\n", "reason:", reason);
});

async function processPrivateKeys(privateKeyData: [string, string]) {
	const [name, privateKey] = privateKeyData;
	WalletManager.init(name, privateKey);
	logger.setCustomPrepend(`[${name}][${WalletManager.address}]`);

	await runModules();

	logger.success`Automation job completed`;
}

async function main() {
	const privateKeysData = Object.entries(PRIVATE_KEYS);

	const [minTime, maxTime] = GLOBAL_CONFIG.MINMAX_WALLET_WAIT_TIME;

	for (let i = 0; i < privateKeysData.length; i++) {
		await processPrivateKeys(privateKeysData[i]);
		if (privateKeysData[i + 1]) await countdownTimer(minTime, maxTime);
	}

	process.exit(0);
}

main();
