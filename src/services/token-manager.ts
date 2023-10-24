import { MoveCoinResource, TokensDataType, TokensType } from "../types.js";
import { getRandomIndex } from "../utils/utils.js";
import { WalletManager } from "./wallet-manager.js";

export const TOKENS = {
	APT: "APT",
	lzUSDC: "lzUSDC",
	lzUSDT: "lzUSDT",
	lzWETH: "lzWETH",
	stAPT: "stAPT",
	tAPT: "tAPT",
} as const;

export class TokenManager {
	static #tokens: TokensDataType = {
		[TOKENS.APT]: {
			name: "Aptos Coin",
			chainId: 1,
			decimals: 8,
			address: "0x1::aptos_coin::AptosCoin",
			minMaxPercent: [10, 20], // percents or empty for full amount
		},
		[TOKENS.lzUSDC]: {
			name: "LayerZero - USD Coin",
			chainId: 1,
			decimals: 6,
			address:
				"0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
			minMaxPercent: [50, 75], // percents or empty for full amount
		},
		[TOKENS.lzUSDT]: {
			name: "LayerZero - Tether USD",
			chainId: 1,
			decimals: 6,
			address:
				"0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
			minMaxPercent: [50, 75], // percents or empty for full amount
		},
		[TOKENS.lzWETH]: {
			name: "LayerZero - Wrapped Ether",
			chainId: 1,
			decimals: 6,
			address:
				"0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
			minMaxPercent: [50, 75], // percents or empty for full amount
		},
		[TOKENS.stAPT]: {
			name: "Ditto Staked Aptos",
			chainId: 1,
			decimals: 8,
			address:
				"0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos",
			minMaxPercent: [50, 75], // percents or empty for full amount
		},
		[TOKENS.tAPT]: {
			name: "Tortuga Staked APT",
			chainId: 1,
			decimals: 8,
			address:
				"0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin",
			minMaxPercent: [50, 75], // percents or empty for full amount
		},
	};

	public static getAddress(token: TokensType) {
		const address = TokenManager.#tokens[token].address;
		if (!address) throw new Error(`Token ${token} address not found`);
		return address;
	}

	public static async getBalance(token: TokensType) {
		const address = this.getAddress(token);
		const resource = (await WalletManager.getAccountResource(
			address,
		)) as MoveCoinResource;
		return resource.data.coin.value;
	}

	public static async getBalances() {
		const balances: Partial<Record<TokensType, number>> = {};

		const resources =
			(await WalletManager.getAccountResources()) as MoveCoinResource[];

		for (const token in this.#tokens) {
			const address = this.getAddress(token as TokensType);
			const moveStructTag = `0x1::coin::CoinStore<${address}>`;

			resources.forEach((r) =>
				r.type === moveStructTag
					? (balances[token as TokensType] = +r.data.coin.value)
					: null,
			);
		}

		return balances as Record<TokensType, number>;
	}

	public static getMinMaxConfig(token: TokensType) {
		const minMax = TokenManager.#tokens[token].minMaxPercent;
		return minMax;
	}

	public static async getRandomTokenPair(
		excludedTokens: Set<TokensType>,
		onlyWithBalance = false,
	): Promise<[TokensType, TokensType, Record<TokensType, number>]> {
		const balances = await this.getBalances();

		const balancesArr = (
			Object.entries(balances) as [TokensType, number][]
		).filter((arr) => !excludedTokens.has(arr[0]));

		let randIndex = getRandomIndex(0, balancesArr.length);
		const token1 = balancesArr.splice(randIndex, 1)[0][0];
		randIndex = getRandomIndex(0, balancesArr.length);
		const token2 = onlyWithBalance
			? balancesArr[randIndex][0]
			: Object.values(TOKENS)[randIndex];

		return [token1, token2, balances];
	}

	public static async registerToken(token: TokensType) {
		const moveFunction = "0x1::managed_coin::register";
		const type_arguments = [TokenManager.getAddress(token)];
		const _arguments: string[] = [];
		const txPayload = {
			function: moveFunction,
			type_arguments: type_arguments,
			arguments: _arguments,
		};

		await WalletManager.sendTransaction(txPayload);
	}
}
