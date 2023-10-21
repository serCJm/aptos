
import { AptosAccount, AptosClient, HexString } from 'aptos';

export class WalletManager {
    static #rpcUrl = "https://rpc.ankr.com/http/aptos/v1"
    static #name: string;
    static #account: AptosAccount | null = null;
    static #client: AptosClient | null = null;
    static #address: HexString | null = null;

    static get walletName(): string {
        if (!this.#name) throw new Error("Wallet not initialized");
        return this.#name;
    }

    static get account(): AptosAccount {
        if (!this.#account) throw new Error("Aptos account not initialized");
        return this.#account;
    }

    static get client(): AptosClient {
        if (!this.#client) throw new Error("Aptos client not initialized");
        return this.#client;
    }

    static get address(): HexString {
        if (!this.#address) throw new Error("Wallet not initialized");
        return this.#address;
    }

    public static init(name: string, privateKey: string): void {
        try {
            this.#name = name;
            this.#account = new AptosAccount(new HexString(privateKey).toUint8Array());
            this.#client = new AptosClient(this.#rpcUrl);
            this.#address = this.#account.address();
        } catch (error) {
            console.log('Wrong private keys are entered or there are no funds on the wallet: ');
        }
    }
}