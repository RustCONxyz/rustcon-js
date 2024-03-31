import PlayersManager from "../managers/Players";
import type { PlayerInfo } from "../types/ServerResponses";

export default class Player {

    /**
     * Player name
     * @type {string}
     */
    public name: string;

    /**
     * Player Steam ID
     * @type {string}
     */
    public steamId: string;

    /**
     * Player IP address
     * @type {string}
     */
    public ipAddress: string;

    /**
     * Player ping
     * @type {number}
     */
    public ping: number;

    /**
     * Player health
     * @type {number}
     */
    public health: number;

    /**
     * Player connected time (seconds)
     * @type {number}
     */
    public connectedTime: number;

    private playersManager: PlayersManager;

    constructor(player: PlayerInfo, playersManager: PlayersManager) {

        this.name = player.DisplayName;

        this.steamId = player.SteamID;

        this.ipAddress = player.Address;

        this.ping = player.Ping;

        this.health = player.Health;

        this.connectedTime = player.ConnectedSeconds;

        this.playersManager = playersManager;

    }

    /**
     * Kick player
     * @param {string} reason
     * @example
     * player.kick();
     * player.kick("You're a bad player!");
     */
    public async kick(reason?: string) {

        await this.playersManager.kickPlayer(this.steamId, reason);

    }

    /**
     * Ban player
     * @param {string} reason
     * @example
     * player.ban();
     * player.ban("You're a bad player!");
     */
    public async ban(reason?: string) {

        await this.playersManager.banPlayer(this.steamId, reason);

    }

}
