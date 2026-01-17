export type RoadmapEventStatus = "completed" | "in_progress" | "planned" | "backlog";

export interface RoadmapEvent {
	date: string; // ISO date string (YYYY-MM-DD)
	title: string;
	description?: string;
	status: RoadmapEventStatus;
	epoch?: "Genesis" | "Flywheel" | "Protocol";
}

// Roadmap events - mix of completed achievements and planned milestones
export const roadmapEvents: RoadmapEvent[] = [
	// Completed achievements (from git history)
	{
		date: "2026-01-09",
		title: "Token Launch",
		description: "Token creation on Pump.fun → PumpSwap migration",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-09",
		title: "3-Year Vesting Lock",
		description: "On-chain 3-year vesting lock for creator allocation (200M tokens)",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-13",
		title: "Genesis NFT Collection",
		description: "Genesis Collection page and NFT gallery created",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-14",
		title: "Revenue Distribution System",
		description: "Revenue distribution percentages updated (40% buyback, 30% burn, 30% treasury)",
		status: "completed",
		epoch: "Flywheel",
	},
	{
		date: "2026-01-15",
		title: "Dev Buyback Summary",
		description: "Dev buyback summary section added to token page",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-15",
		title: "Twitter Community",
		description: "Twitter community link added to about and token pages",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-16",
		title: "Token Holders Page",
		description: "Token holders page created for Genesis airdrop",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-16",
		title: "Burn Summary",
		description: "Burn summary section added to token page",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-17",
		title: "Team Page",
		description: "Team page created with team members and profile pictures",
		status: "completed",
		epoch: "Genesis",
	},
	{
		date: "2026-01-17",
		title: "Scroll Functionality",
		description: "Scroll functionality and section IDs added to token page",
		status: "completed",
		epoch: "Genesis",
	},
	// Planned milestones
	{
		date: "2026-02-01",
		title: "LinkedIn Page",
		description: "Create LinkedIn profile page",
		status: "backlog",
		epoch: "Genesis",
	},
	{
		date: "2026-02-15",
		title: "Genesis NFT Batch Preview",
		description: "Genesis NFT batch preview and teasers",
		status: "in_progress",
		epoch: "Genesis",
	},
	{
		date: "2026-03-01",
		title: "Merch Shop Launch",
		description: "Merchandise shop launch with quote-themed apparel",
		status: "planned",
		epoch: "Flywheel",
	},
	{
		date: "2026-03-15",
		title: "NFT Minting System",
		description: "NFT minting and auction mechanism deployment (Metaplex on Solana)",
		status: "planned",
		epoch: "Flywheel",
	},
	{
		date: "2026-04-01",
		title: "Automated Buyback Script",
		description: "Automated buyback script deployment",
		status: "planned",
		epoch: "Protocol",
	},
	{
		date: "2026-06-01",
		title: "Airdrop System",
		description: "Airdrop system: periodic $COWSAYS token distributions to NFT holders",
		status: "planned",
		epoch: "Protocol",
	},
];

export function getRoadmapEvents(): RoadmapEvent[] {
	return roadmapEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getEventsByMonth(): Map<string, RoadmapEvent[]> {
	const events = getRoadmapEvents();
	const byMonth = new Map<string, RoadmapEvent[]>();

	events.forEach((event) => {
		const date = new Date(event.date);
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		
		if (!byMonth.has(monthKey)) {
			byMonth.set(monthKey, []);
		}
		byMonth.get(monthKey)!.push(event);
	});

	return byMonth;
}
