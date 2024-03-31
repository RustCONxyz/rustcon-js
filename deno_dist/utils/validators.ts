import ConnectionOptions from "../types/ConnectionOptions.ts";

export function validateConnectionOptions(options: ConnectionOptions): string | null {

    if (!options.ip) {

        return "IP is required";

    }

    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(options.ip)) {

        return "Invalid IP Address";

    }

    if (options.port && (isNaN(options.port) || options.port < 1 || options.port > 65535)) {

        return "Invalid Port";

    }

    if (!options.password || options.password === "") {

        return "Password is required";

    }

    return null;

}

export function isValidSteamId(steamId: string | number): boolean {

    if (!steamId) {

        return false;

    }

    if (typeof steamId === "string") {

        steamId = Number(steamId);

    }

    if (isNaN(steamId)) {

        return false;

    }

    return steamId > 76561190000000000;

}
