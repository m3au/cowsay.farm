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
		name: "Franklin",
		role: "Project Ambassador",
		twitter: "https://twitter.com/big_franklin01",
		image: "/team/franklin.jpg",
	},
];

export function getTeamMembers(): TeamMember[] {
	return teamMembers;
}
