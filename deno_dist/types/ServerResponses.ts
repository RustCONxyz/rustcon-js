export interface GenericMessage {

    Message: string;

    Identifier: number;

    Type: string;

    Stacktrace: string;

}

export interface ServerInfo {

    Hostname: string;

    MaxPlayers: number;

    Players: number;

    Queued: number;

    Joining: number;

    EntityCount: number;

    GameTime: string;

    Uptime: number;

    Map: string;

    Framerate: number;

    Memory: number;

    MemoryUsageSystem: number;

    Collections: number;

    NetworkIn: number;

    NetworkOut: number;

    Restarting: boolean;

    SaveCreatedTime: string;

    Version: number;

    Protocol: string;

}

export interface PlayerInfo {

    SteamID: string;

    OwnerSteamID: string;

    DisplayName: string;

    Ping: number;

    Address: string;

    ConnectedSeconds: number;

    VoiationLevel: number;

    CurrentLevel: number;

    UnspentXp: number;

    Health: number;

}
