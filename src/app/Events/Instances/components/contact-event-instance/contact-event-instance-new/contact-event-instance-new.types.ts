import { EventTeam } from "../../../models";

export type ScheduleStatus = {
  id: number;
  name: string;
}

// Converted EventDefinitionReason to make keys lowerCase
export type LcEventDefinitionReason = {
  id: number;
  reason: {
    id: string;
    reason: string;
    enabled: true,
    createdBy: string;
    created: Date;
    lastupdated: Date;
    updatedby: string;
  },
  createdby: string;
  created: Date;
  lastupdated: Date;
  updatedby: string;
}

// Converted EventDefinition to make keys lowerCase
export type LcEventDefinition = {
  id: number,
  type: string,
  code: string,
  name: string,
  categoryid: string,
  category: string,
  schedulable: string,
  teamMemberschedulable: string,
  reschedulable: boolean,
  documentuploads: boolean,
  teams: EventTeam[],
  defaultnote: string
}