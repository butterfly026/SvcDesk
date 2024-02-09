type ReallocationRequestBodyItem = {
  Id: number;
  Amount: number;
}

export type ReallocationRequestBody = {
  DeleteExisting: boolean;
  Items: ReallocationRequestBodyItem[]
}