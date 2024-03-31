import ServerInfo from "../structures/ServerInfo.ts";
import { isValidSteamId } from "../utils/validators.ts";
import type Client from "../client/Client.ts";

export default class ServerManager {

    private client: Client;

    constructor(client: Client) {

        this.client = client;

    }

    /**
     * Get the server info
     * @returns {Promise<ServerInfo>}
     */
    public async getInfo(): Promise<ServerInfo> {

        const response = await this.client.sendCommand("serverinfo");

        const serverInfo = new ServerInfo(JSON.parse(response.content));

        return serverInfo;

    }

    /**
     * Save the server
     * @returns {Promise<void>}
     */
    public async save() {

        await this.client.sendCommand("save");

    }

    /**
     * Save the server configuration
     * @returns {Promise<void>}
     */
    public async writeCFG() {

        await this.client.sendCommand("writecfg");

    }

    /**
     * Restart the server
     * @param {string} reason
     * @param {number} duration
     * @returns {Promise<void>}
     */
    public async restart(reason: string, duration: number) {

        await this.client.sendCommand(`restart ${reason} ${duration}`);

    }

    /**
     * Shutdown the server
     * @param {string} reason
     * @param {number} duration
     * @returns {Promise<void>}
     */
    public async shutdown(reason: string, duration: number) {

        await this.client.sendCommand(`shutdown ${reason} ${duration}`);

    }

    /**
     * Add a moderator to the server
     * @param {(number|string)} steamId
     * @param {string} name
     * @param {string} reason
     * @param {boolean} save
     * @returns {Promise<void>}
     */
    public async addModerator(steamId: string, name?: string, reason?: string, save: boolean = true) {

        if (!isValidSteamId(steamId)) {

            throw new Error("Invalid Steam ID");

        }

        await this.client.sendCommand(`moderatorid ${steamId} ${name} ${reason}`);

        if (save) {

            await this.writeCFG();

        }

    }

    /**
     * Add an owner to the server
     * @param {(number|string)} steamId
     * @param {string} name
     * @param {string} reason
     * @param {boolean} save
     * @returns {Promise<void>}
     */
    public async addOwner(steamId: string, name?: string, reason?: string, save: boolean = true) {

        if (!isValidSteamId(steamId)) {

            throw new Error("Invalid Steam ID");

        }

        await this.client.sendCommand(`ownerid ${steamId} ${name} ${reason}`);

        if (save) {

            await this.writeCFG();

        }

    }

}
