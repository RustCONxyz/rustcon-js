import { WebSocket } from "npm:unws@0.2.4";
import { EventEmitter } from "npm:events@3.3.0";
import ServerManager from "../managers/Server.ts";
import PlayersManager from "../managers/Players.ts";
import Message from "../structures/Message.ts";
import ConnectionOptions from "../types/ConnectionOptions.ts";
import { validateConnectionOptions } from "../utils/validators.ts";

interface ClientEvents {
    "connected": () => void;
    "message": (message: Message) => void;
    "error": (error: any) => void;
    "disconnected": () => void;
}

export default class Client extends EventEmitter {

    public ws: WebSocket | null;

    public server: ServerManager;

    public players: PlayersManager;

    private connectionOptions: ConnectionOptions;

    private pendingCommands: Map<number, Function>;

    constructor(options: ConnectionOptions) {

        super();

        const validationResult = validateConnectionOptions(options);

        if (validationResult) {

            throw new Error(`Invalid Connection Options: ${validationResult}`);

        }

        this.ws = null;

        this.server = new ServerManager(this);

        this.players = new PlayersManager(this);

        this.connectionOptions = options;

        this.pendingCommands = new Map<number, (value: Message | PromiseLike<Message>) => void>();

    }

    public on<K extends keyof ClientEvents>(e: K, listener: ClientEvents[K]): this {

        return super.on(e, listener);

    }

    /**
     * Connects to the server
     * @returns {void}
     */
    public connect(): void {

        this.ws = new WebSocket(`ws://${this.connectionOptions.ip}:${this.connectionOptions.port ?? 28016}/${this.connectionOptions.password}`);

        this.ws.onopen = this.onConnection.bind(this);

        this.ws.onmessage = (data) => this.onMessage(data.data);

        this.ws.onerror = this.onError.bind(this);

        this.ws.onclose = this.onClose.bind(this);

    }

    /**
     * Sends a command to the server
     * @param {string} command - The command to be sent
     * @returns {Promise<Message>}
     */
    public sendCommand(command: string): Promise<Message> {

        return new Promise((resolve, reject) => {

            if (this.ws && this.ws.readyState === WebSocket.OPEN) {

                const identifier = this.generateIdentifier();

                this.ws.send(JSON.stringify({

                    Identifier: identifier,

                    Message: command,

                    Name: "RCON"

                }));

                this.pendingCommands.set(identifier, resolve);

                setTimeout(() => {

                    if (this.pendingCommands.has(identifier)) {

                        this.pendingCommands.delete(identifier);

                        reject("Command Timed Out");

                    }

                }, 5000);

            } else {

                reject("Not connected to server");

            }

        });

    }

    /**
     * Disconnects from the server
     * @returns {void}
     */
    public disconnect(): void {

        if (this.ws) {

            this.ws.close();

        } else {

            throw new Error("Not connected to server");

        }

    }

    private onConnection() {

        this.emit("connected");

    }

    private onMessage(data: string) {

        const message = new Message(JSON.parse(data));

        const pendingCommand = this.pendingCommands.get(message.identifier);

        if (pendingCommand) {

            pendingCommand(message);

            this.pendingCommands.delete(message.identifier);

        } else {

            this.emit("message", message);

        }

    }

    private onError(error: any) {

        this.emit("error", error);

    }

    private onClose() {

        this.ws = null;

        this.pendingCommands.clear();

        this.emit("disconnected");

    }

    private generateIdentifier(): number {

        // Generates a random number between 10 and 1000
        const randomNumber = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

        if (this.pendingCommands.has(randomNumber)) {

            return this.generateIdentifier();

        }

        return randomNumber;

    }

}
