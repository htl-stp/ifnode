import crypto from "crypto";
import fs from "fs";
import path from "path";

export function hash(content: string) {
    return crypto.createHash("sha256").update(content).digest("hex");
}

const BASE = "https://ifnode.htlstp.ac.at/";

export function toAbsolute(src: string) {
    return new URL(src, BASE).href;
}