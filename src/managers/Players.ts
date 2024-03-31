import Player from "../structures/Player";
import { isValidSteamId } from "../utils/validators";
import type Client from "../client/Client";
import type { PlayerInfo } from "../types/ServerResponses";

export default class PlayersManager {

    private client: Client;

    constructor(client: Client) {

        this.client = client;

    }

    /**
     * Get all connected players
     * @returns {Promise<Player[]>}
     */
    public async getAll(): Promise<Player[]> {

        const response = await this.client.sendCommand("playerlist");

        const playerList = JSON.parse(response.content) as PlayerInfo[];

        return playerList.map((player) => new Player(player, this));

    }

    /**
     * Get a player by their Steam ID
     * @param {(number|string)} steamId
     * @returns {Promise<(Player|null)>}
     */
    public async get(steamId: number | string): Promise<Player | null> {

        if (!isValidSteamId(steamId)) {

            throw new Error("Invalid Steam ID");

        }

        const allPlayers = await this.getAll();

        return allPlayers.find((player) => player.steamId === steamId) || null;

    }

    /**
     * Kick a player
     * @param {(number|string)} steamId
     * @param {string} reason
     * @returns {Promise<void>}
     */
    public async kickPlayer(steamId: number | string, reason?: string): Promise<void> {

        if (!isValidSteamId(steamId)) {

            throw new Error("Invalid Steam ID");

        }

        await this.client.sendCommand(`kick ${steamId} ${reason}`);

    }

    /**
     * Ban a player
     * @param {(number|string)} steamId
     * @param {string} reason
     * @returns {Promise<void>}
     */
    public async banPlayer(steamId: number | string, reason?: string): Promise<void> {

        if (!isValidSteamId(steamId)) {

            throw new Error("Invalid Steam ID");

        }

        await this.client.sendCommand(`ban ${steamId} ${reason}`);

    }

    /**
     * Unban a player
     * @param {(number|string)} steamId
     * @returns {Promise<void>}
     */
    public async unbanPlayer(steamId: number | string): Promise<void> {

        if (!isValidSteamId(steamId)) {

            throw new Error("Invalid Steam ID");

        }

        await this.client.sendCommand(`unban ${steamId}`);

    }

}
