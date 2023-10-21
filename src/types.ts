// ORDER
export const ORDER: Record<string, OrderType> = {
	RANDOM: "random",
	ONE_RANDOM: "one_random",
	DEFAULT: "default",
} as const;
export type OrderType = "random" | "one_random" | "default";