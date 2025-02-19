export function Loading() {
	return (
		<div className="max-w-full w-[700px] tablet:w-auto">
			{new Array(10).fill(0).map((_, i) => (
				<LoadingElem bg={i % 2 === 0 ? "#fff" : "#f3f3f3"} key={i.toString()} />
			))}
		</div>
	);
}

export function LoadingElem({ bg }: { bg: string }) {
	return (
		<>
			<div
				className="p-1 max-w-full flex justify-between gap-3 tablet:flex-col sp:gap-0"
				style={{ backgroundColor: bg }}
			>
				<div className="overflow-hidden">
					<div className="text-xl sp:text-base whitespace-nowrap overflow-hidden text-ellipsis text-transparent">
						{"loading"}
					</div>
					<div className="text-sm sp:text-xs whitespace-nowrap overflow-hidden text-ellipsis text-transparent">
						{"loading"}
					</div>
				</div>
				<div className="flex flex-shrink-0 justify-between flex-row gap-4 items-center sp:px-4">
					{["-", "-", "-", "-"].map((n, i) => (
						<div
							className="w-10 h-10 rounded-full flex justify-center items-center sp:text-xs sp:w-7 sp:h-7 bg-slate-200"
							key={i.toString()}
						/>
					))}
				</div>
			</div>
		</>
	);
}
