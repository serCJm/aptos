import { ORDER } from "./src/types.js";

export const GLOBAL_CONFIG = {
    PREVENT_SENDING_MAX_ETHER: false, // prevents from swapping entire eth balance if forget to provide amount in settings
    MINMAX_WALLET_WAIT_TIME: [60 * 30, 60 * 60], // seconds
    MINMAX_MODULES_WAIT_TIME: [60 * 3, 60 * 7], // seconds
    ORDER: ORDER.RANDOM,
};
