export interface EventTeam {
  Id: string,
  Name: string
};

export interface EventTeamMember extends EventTeam {}

export type GetTeamMembersResponse = {
  Count: number;
  Member: EventTeamMember[];
}