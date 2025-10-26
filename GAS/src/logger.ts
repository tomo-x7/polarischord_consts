import { formatForLog } from "../../shared/formatter";

const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK");
function webhook(payload: object) {
	if (!WEBHOOK_URL) {
		console.error("WEBHOOK_URL is not set");
		return;
	}
	const res = UrlFetchApp.fetch(WEBHOOK_URL, {
		method: "post",
		contentType: "application/json",
		payload: JSON.stringify(payload),
		muteHttpExceptions: true,
	});
	const status = res.getResponseCode();
	if (status < 200 || status >= 300) {
		console.error(`Failed to send webhook: ${status}`);
		console.error(res.getContentText());
	}
}

export const logger = {
	log: (msg: string) => {
		console.log(`[INFO] ${msg}`);
	},
	error: (msg: string) => {
		console.error(`[ERROR] ${msg}`);
	},
	fatal: (msg: unknown) => {
		const formatted = formatForLog(msg);
		console.error(`[FATAL] ${formatted}`);
		webhook({
			content: `<@1111261400157929482>`,
			embeds: [
				{
					title: "Fatal Error",
					color: 0xff0000,
					description: `\`\`\`${formatted}\`\`\``,
					timestamp: new Date().toISOString(),
				},
			],
		});
	},
	skipped: () => {
		webhook({
			embeds: [
				{
					title: "deploy skipped",
					color: 0xffff00,
					timestamp: new Date().toISOString(),
				},
			],
		});
	},
};
