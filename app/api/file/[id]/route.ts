import { readFile } from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  const filePath = path.join(process.cwd(), "uploads", id);
  try {
    const file = await readFile(filePath);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(file);
  } catch (error) {
    res.status(404).json({ error: "File not found" });
  }
}
