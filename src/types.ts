import { Move_Resources } from "aptos";
import { TOKENS } from "./services/token-manager.js";

// ORDER
export const ORDER: Record<string, OrderType> = {
	RANDOM: "random",
	ONE_RANDOM: "one_random",
	DEFAULT: "default",
} as const;
export type OrderType = "random" | "one_random" | "default";

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
