import { Suspense } from "react";
import type { metadata, musics } from "./types";
import { Data } from "./Data";
export default function App({ data }: { data: Promise<{ data: musics; meta: metadata }> }) {
	return (
		<>
			<h1>Polarischord consts</h1>
			<Suspense fallback={<span>loading...</span>}>
				<Data data={data} />
			</Suspense>
		</>
	);
}
