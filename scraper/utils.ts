import crypto from "crypto";
import fs from "fs";
import path from "path";

export function hash(content: string) {
    return crypto.createHash("sha256").update(content).digest("hex");
}