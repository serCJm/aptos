import { Move_Resources } from "aptos";
import { BaseModule } from "./modules/baseModule.js";
import { TOKENS } from "./services/token-manager.js";

// ORDER
export type OrderKye = "RANDOM" | "ONE_RANDOM" | "DEFAULT";
export type OrderType = "random" | "one_random" | "default";

export const ORDER: Record<OrderKye, OrderType> = {
	RANDOM: "random",
	ONE_RANDOM: "one_random",
	DEFAULT: "default",
} as const;

// TOKENS
export type TokensType = (typeof TOKENS)[keyof typeof TOKENS];
export type TokensTypeKey = keyof typeof TOKENS;
export type MinMaxSwapPercentType = [number, number] | [];
export type TokensData = {
	name: string;
	chainId: number;
	decimals: number;
	address: string;
	minMaxPercent: MinMaxSwapPercentType;
};
export type TokensDataType = Record<TokensType, TokensData>;

// MOVE
type CoinData = {
	coin: { value: string };
	deposit_events: { counter: string };
	frozen: boolean;
	withdraw_events: { counter: string };
};

export interface MoveCoinResource extends Move_Resources {
	type: string;
	data: CoinData;
}

// MODULES
export type BaseModuleDerivedClass = new (...args: any[]) => BaseModule;
export type ModuleConfigType = {
	ENABLED: boolean;
	[key: string]: any;
};

type BaseConfig = {
	ENABLED: boolean;
};

export type DexConfig = BaseConfig & {
	ENABLED: boolean;
	SWAP: boolean;
	ADD_LIQUIDITY: boolean;
	EXCLUDED_TOKENS: TokensType[];
};

export type LendingProtocolConfig = BaseConfig & {
	VOLUME_MAKER: [number, number] | [];
};

export type ModulesConfig = BaseConfig | DexConfig | LendingProtocolConfig;
