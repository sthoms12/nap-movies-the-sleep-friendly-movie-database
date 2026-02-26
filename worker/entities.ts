import { IndexedEntity } from "./core-utils";
import type { Submission } from "@shared/types";
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