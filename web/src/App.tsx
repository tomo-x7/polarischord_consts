import { type ReactNode, Suspense, useEffect, useState } from "react";
import { Data } from "./Data";
import { Filter } from "./Filter";
import { Loading } from "./Loading";
import { Search } from "./Search";
import { Sort } from "./Sort";
import type {} from "./sortAlgo";
import type { filterAlgo, metadata, musics, searchAlgo, sortData } from "./types";

export default function App({ data }: { data: Promise<{ data: musics; meta: metadata }> }) {
	const [sort, setsort] = useState<sortData>({ algo: "name", reverse: false });
	const [filter, setFilter] = useState<filterAlgo>({ fn: defaultFilter });
	const [searchAlgo, setSearchAlgo] = useState<searchAlgo>();
	return (
		<>
			<h1 className="text-3xl tablet:text-[25px]">ポラリスコード譜面定数一覧</h1>
			<main className="tablet:px-3">
				<div className="mt-5 mb-2">
					<Search algo={searchAlgo} setAlgo={setSearchAlgo} />
					<Sort setSort={setsort} now={sort} canSort={searchAlgo?.canSort} />
					<Filter setFilter={setFilter} />
				</div>
				<Suspense fallback={<Loading />}>
					<Data data={data} sort={sort} filterFn={filter} search={searchAlgo} />
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
				<Link href="https://bsky.app/profile/did:plc:qcwvyds5tixmcwkwrg3hxgxd/">@tomo-x.win</Link>
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

const defaultFilter = () => true;
