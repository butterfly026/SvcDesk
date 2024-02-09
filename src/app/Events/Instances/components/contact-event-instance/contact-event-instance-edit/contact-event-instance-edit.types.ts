import { EventInstance } from "src/app/Events/Instances/models";

export type EditContactEventInstance = {
  ContactCode: string;
  eventInstance: EventInstance
}