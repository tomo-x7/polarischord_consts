import { ReactNode, Suspense } from "react";
import type { metadata, musics } from "./types";
import { Data } from "./Data";
export default function App({ data }: { data: Promise<{ data: musics; meta: metadata }> }) {
	return (
		<>
			<h1 className="text-3xl">ポラリスコード定数一覧</h1>
			<Suspense fallback={<span>loading...</span>}>
				<Data data={data} />
			</Suspense>
			<Footer />
			<button
				type="button"
				style={{ border: "solid black 3px", boxShadow: "1px 1px 4px 0px black", transition: "box-shadow .1s" }}
				className="fixed bottom-4 right-4 bg-white rounded-full h-16 w-16 sp:shadow-none hover:!shadow-none"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				↑
			</button>
		</>
	);
}

function Link({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a className="text-[#00E] underline" target="_blank" rel="noopener noreferrer" href={href}>
			{children}
		</a>
	);
}

function Footer() {
	return (
		<footer className="sticky top-full bg-gray-500 text-black mt-4 pt-2">
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
