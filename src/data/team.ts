export interface TeamMember {
	name: string;
	role: string;
	twitter?: string;
	discord?: string;
	image?: string;
}

// Team members data
export const teamMembers: TeamMember[] = [
	{
		name: "m3aus",
		role: "Developer & Artist",
		twitter: "https://x.com/m3aus",
		image: "/team/m3aus.jpg",
	},
	{
		name: "Acapella",
		role: "Head of Marketing",
		twitter: "https://x.com/justmeowens_",
		image: "/team/acapella.jpg",
	},
	{
		name: "Bima",
		role: "Head of Brand Strategy",
		twitter: "https://x.com/Bimadesage",
		image: "/team/bima.jpg",
	},
	{
		name: "Kerstin",
		role: "Merch Shop Operator",
		twitter: "https://x.com/Kerstin682",
		image: "/team/kerstin.jpg",
	},
	{
		name: "Franklin",
		role: "Project Ambassador",
		twitter: "https://twitter.com/big_franklin01",
		image: "/team/franklin.jpg",
	},
	{
		name: "TM",
		role: "Discord Moderator",
		twitter: "https://x.com/tm401z",
		image: "/team/tm.jpg",
	},
];

export function getTeamMembers(): TeamMember[] {
	return teamMembers;
}
