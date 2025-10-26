import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "child_process";

async function main() {
	// カレントディレクトリを保存してから移動
	const lastPwd = process.cwd();
	process.chdir(path.join(import.meta.dirname));
	// 一応秘匿情報
	const deployId = (await fs.readFile(path.join(import.meta.dirname, ".deploy"), "utf-8")).trim();
	// ビルド
	execSync("pnpm run build", { stdio: "inherit" });
	// ビルド結果からバージョンを生成
	const appJs = await fs.readFile(path.join(import.meta.dirname, "dist", "app.js"), "utf-8");
	const hash = createHash("sha256").update(appJs).digest("hex");
	const dayStr = new Date()
		.toLocaleDateString("ja-JP", { year: "2-digit", month: "2-digit", day: "2-digit" })
		.replace(/\//g, "-");
	const version = `${dayStr}-${hash.slice(0, 8)}`;
	console.log(`Deploy Version: ${version}`);
	// リモートと同期
	execSync("clasp push -f", { stdio: "inherit" });
	// デプロイ
	execSync(`clasp update-deployment ${deployId}`, { stdio: "inherit" });
	// カレントディレクトリを復元
	process.chdir(lastPwd);
}

main();
