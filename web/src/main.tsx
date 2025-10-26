import "./index.tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import type { Metadata, Musics } from "./types.ts";

async function getData() {
	const lsMetaStr = localStorage.getItem("meta");
	const lsDataStr = localStorage.getItem("data");
	const remotemeta = await fetch("/data/metadata.json").then((r) => r.json() as Promise<Metadata>);
	if (lsMetaStr && lsDataStr) {
		const lsMeta: Metadata = JSON.parse(lsMetaStr);
		if (lsMeta.hash === remotemeta.hash) {
			console.log("cache");
			return { data: JSON.parse(lsDataStr) as Musics, meta: remotemeta };
		}
	}
	const data = await fetch("/data/data.json").then((r) => r.json() as Promise<Musics>);
	localStorage.setItem("meta", JSON.stringify(remotemeta));
	localStorage.setItem("data", JSON.stringify(data));
	console.log("get");
	return { data: data, meta: remotemeta };
}
const dataPromise = getData();
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App data={dataPromise} />
	</StrictMode>,
);
