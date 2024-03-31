import { ServerInfo as ServerServerInfo } from "../types/ServerResponses";

export default class ServerInfo {

    /**
     * Server hostname
     * @type {string}
     */
    public hostname: string;

    /**
     * 
     * @type {number}
     */
    public players: number;

    /**
     * 
     * @type {number}
     */
    public maxPlayers: number;

    /**
     * 
     * @type {number}
     */
    public queuedPlayers: number;

    /**
     * 
     * @type {number}
     */
    public joiningPlayers: number;

    /**
     * Server entity count
     * @type {number}
     */
    public entityCount: number;

    /**
     * Server game time
     * @type {string}
     */
    public gameTime: string;

    /**
     * Server uptime (seconds)
     * @type {number}
     */
    public uptime: number;

    /**
     * Server map type
     * @type {string}
     */
    public map: string;

    /**
     * Server framerate
     * @type {number}
     */
    public framerate: number;

    /**
     * Server memory usage
     * @type {number}
     */
    public memory: number;

    /**
     * System memory usage
     * @type {number}
     */
    public memoryUsageSystem: number;

    /**
     * 
     * @type {number}
     */
    public collections: number;

    /**
     * Server network in (bytes)
     * @type {number}
     */
    public networkIn: number;

    /**
     * Server network out (bytes)
     * @type {number}
     */
    public networkOut: number;

    /**
     * Is the server restarting
     * @type {boolean}
     */
    public restarting: boolean;

    /**
     * Server save created time
     * @type {string}
     */
    public saveCreatedTime: string;

    /**
     * Server version
     * @type {number}
     */
    public version: number;
    
    /**
     * Server protocol
     * @type {string}
     */
    public protocol: string;
    
    constructor(serverInfo: ServerServerInfo) {

        this.hostname = serverInfo.Hostname;

        this.players = serverInfo.Players;

        this.maxPlayers = serverInfo.MaxPlayers;

        this.queuedPlayers = serverInfo.Queued;

        this.joiningPlayers = serverInfo.Joining;

        this.entityCount = serverInfo.EntityCount;

        this.gameTime = serverInfo.GameTime;

        this.uptime = serverInfo.Uptime;

        this.map = serverInfo.Map;

        this.framerate = serverInfo.Framerate;

        this.memory = serverInfo.Memory;

        this.memoryUsageSystem = serverInfo.MemoryUsageSystem;

        this.collections = serverInfo.Collections;

        this.networkIn = serverInfo.NetworkIn;

        this.networkOut = serverInfo.NetworkOut;

        this.restarting = serverInfo.Restarting;

        this.saveCreatedTime = serverInfo.SaveCreatedTime;

        this.version = serverInfo.Version;

        this.protocol = serverInfo.Protocol;

    }

    /**
     * Check if the server is full
     * @returns {boolean}
     */
    public isFull(): boolean {

        return this.players >= this.maxPlayers;

    }

    /**
     * Check if the server has a queue
     * @returns {boolean}
     */
    public hasQueue(): boolean {

        return this.queuedPlayers > 0;

    }

    /**
     * Check if the server has players joining
     * @returns {boolean}
     */
    public hasPlayersJoining(): boolean {

        return this.joiningPlayers > 0;

    }

}
