import { IndexedEntity } from "./core-utils";
import type { Submission, Vote } from "@shared/types";
export class SubmissionEntity extends IndexedEntity<Submission> {
  static readonly entityName = "submission";
  static readonly indexName = "submissions";
  static readonly initialState: Submission = {
    id: "",
    title: "",
    year: 0,
    reason: "",
    status: "pending",
    createdAt: 0
  };
}
export class VoteEntity extends IndexedEntity<Vote> {
  static readonly entityName = "vote";
  static readonly indexName = "votes";
  static readonly initialState: Vote = {
    id: "",
    movieId: "",
    type: "nap",
    createdAt: 0
  };
}