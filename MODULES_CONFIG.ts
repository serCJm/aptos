import { AnimeSwap } from "./src/modules/animeSwap.js";
import { LiquidSwap } from "./src/modules/liquidSwap.js";
import { Mint } from "./src/modules/mint.js";
import { PancakeSwap } from "./src/modules/pancakeSwap.js";
import { ModulesConfig, ORDER } from "./src/types.js";

export const MODULE_MAP = {
	LiquidSwap,
	PancakeSwap,
	AnimeSwap,
	Mint,
} as const;

export const MODULES_CONFIG: Record<string, ModulesConfig> = {
	[LiquidSwap.name]: {
		ENABLED: false,
		EXCLUDED_TOKENS: [],
	},
	[PancakeSwap.name]: {
		ENABLED: false,
		EXCLUDED_TOKENS: [],
	},
	[AnimeSwap.name]: {
		ENABLED: false,
		EXCLUDED_TOKENS: [],
	},
	[Mint.name]: {
		ENABLED: true,
	},
};

export const GLOBAL_CONFIG = {
	PREVENT_SENDING_MAX_ETHER: false, // prevents from swapping entire eth balance if forget to provide amount in settings
	MINMAX_WALLET_WAIT_TIME: [60 * 30, 60 * 60], // seconds
	MINMAX_MODULES_WAIT_TIME: [60 * 3, 60 * 7], // seconds
	ORDER: ORDER.ONE_RANDOM,
};
