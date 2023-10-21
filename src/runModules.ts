import { LiquidSwap } from "./modules/liquidSwap.js";

export async function runModules() {
	const module = new LiquidSwap();

	await module.run();

	// const enabledModules = await getEnabledModules();
	// if (MODULES_CONFIG[Bridge.name].ENABLED) enabledModules.unshift(Bridge);

	// const [minTime, maxTime] = GLOBAL_CONFIG.MINMAX_MODULES_WAIT_TIME;

	// for (const [index, module] of enabledModules.entries()) {
	// 	try {
	// 		let chain;
	// 		if (module instanceof Bridge) chain = CHAINS.ETH;

	// 		await BaseModule.runModule(module, chain);

	// 		const notLast = index < enabledModules.length - 1;
	// 		if (notLast) await countdownTimer(minTime, maxTime);
	// 	} catch (error) {
	// 		logger.error`Module failed, switching to next one...`;
	// 		console.log(error);
	// 	}
	// }
}
