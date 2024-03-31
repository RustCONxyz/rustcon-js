import WebSocket from "ws";
import { EventEmitter } from "node:events";
import ServerManager from "../managers/Server";
import PlayersManager from "../managers/Players";
import Message from "../structures/Message";
import ConnectionOptions from "../types/ConnectionOptions";
import { validateConnectionOptions } from "../utils/validators";

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

    /**
     * Connects to the server
     * @returns {void}
     */
    public connect(): void {

        this.ws = new WebSocket(`ws://${this.connectionOptions.ip}:${this.connectionOptions.port ?? 28016}/${this.connectionOptions.password}`);

        this.ws.on("open", this.onConnection.bind(this));

        this.ws.on("message", this.onMessage.bind(this));

        this.ws.on("error", this.onError.bind(this));

        this.ws.on("close", this.onClose.bind(this));

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
