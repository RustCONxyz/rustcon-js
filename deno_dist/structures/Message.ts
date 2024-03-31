import { GenericMessage } from "../types/ServerResponses.ts";

export default class Message {

    public content: string;

    public identifier: number;

    public type: string;

    public stacktrace: string;

    constructor(messageData: GenericMessage) {

        this.content = messageData.Message;

        this.identifier = messageData.Identifier;

        this.type = messageData.Type;

        this.stacktrace = messageData.Stacktrace;

    }

}
