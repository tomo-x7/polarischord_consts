import { type ReactNode, Suspense, useEffect, useState } from "react";
import type { filterAlgo, searchAlgo, metadata, musics, sortData } from "./types";
import { Data } from "./Data";
import type {} from "./sortAlgo";
import { Sort } from "./Sort";
import { Search } from "./Search";

export default function App({ data }: { data: Promise<{ data: musics; meta: metadata }> }) {
	const [sort, setsort] = useState<sortData>({ algo: "name", reverse: false });
	const [filter, setFilter] = useState<filterAlgo>();
	const [searchAlgo, setSearchAlgo] = useState<searchAlgo>();
	return (
		<>
			<h1 className="text-3xl">ポラリスコード定数一覧</h1>
			<main className="tablet:px-3">
				<Search algo={searchAlgo} setAlgo={setSearchAlgo} />
				<Sort setSort={setsort} now={sort} canSort={searchAlgo?.canSort} />
				<Suspense fallback={<span>loading...</span>}>
					<Data data={data} sort={sort} filter={filter} search={searchAlgo} />
				</Suspense>
			</main>
			<Footer />
			<GoTop />
		</>
	);
}

function Link({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a className="text-[#00B] underline" target="_blank" rel="noopener noreferrer" href={href}>
			{children}
		</a>
	);
}

function GoTop() {
	const [scrollY, setScrollY] = useState(0);
	useEffect(() => {
		const listener = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", listener, { passive: true });
		return () => window.removeEventListener("scroll", listener);
	}, []);
	return (
		<button
			type="button"
			style={{
				boxShadow: "1px 1px 4px 0px black",
				transition: "box-shadow .1s, opacity .3s",
				opacity: scrollY < 30 ? 0 : 1,
			}}
			className="fixed bottom-4 right-4 text-4xl bg-blue-400 rounded-full h-14 w-14 sp:shadow-none hover:!shadow-none"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
		>
			↑
		</button>
	);
}

function Footer() {
	return (
		<footer className="sticky top-full bg-gray-400 text-black mt-4 pt-2">
			<div>
				developed by{" "}
				<Link href="https://bsky.app/profile/did:plc:qcwvyds5tixmcwkwrg3hxgxd/">@tomo-x.bsky.social</Link>
			</div>
			<div>
				ソースコードは
				<Link href="https://github.com/tomo-x7/polarischord_consts">Github</Link>で公開しています
			</div>
			<div>
				データ収集: Discordサーバー
				<Link href="https://discord.gg/p7vtPNUAbC">ポラリスコードの会</Link>
			</div>
		</footer>
	);
}
