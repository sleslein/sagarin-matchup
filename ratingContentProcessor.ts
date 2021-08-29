export function isAdvLine(text: string): boolean {
    return text.indexOf('HOME ADVANTAGE=[') > -1;
}

const teams = ['Tampa Bay Buccaneers', 'Kansas City Chiefs']

export function isTeamLine(text: string, teamList: string[]): boolean {
    const teamName = text.substring(5,29).trimEnd();
    return teamList.includes(teamName);
}