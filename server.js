import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 一覧
app.get("/api/reserve", (req, res) => res.json(loadData()));

// 新規登録
app.post("/api/reserve", (req, res) => {
  const data = loadData();
  data.push(req.body);
  saveData(data);
  res.json({ message: "登録しました" });
});

// 編集
app.put("/api/reserve/:index", (req, res) => {
  const data = loadData();
  const idx = Number(req.params.index);
  if (!data[idx]) return res.status(404).json({ error: "該当なし" });
  data[idx] = { ...data[idx], ...req.body };
  saveData(data);
  res.json({ message: "更新しました" });
});

// 削除
app.delete("/api/reserve/:index", (req, res) => {
  const data = loadData();
  const idx = Number(req.params.index);
  if (!data[idx]) return res.status(404).json({ error: "該当なし" });
  data.splice(idx, 1);
  saveData(data);
  res.json({ message: "削除しました" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
