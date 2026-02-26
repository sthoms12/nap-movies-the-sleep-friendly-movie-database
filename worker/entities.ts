import { IndexedEntity } from "./core-utils";
import type { Submission } from "@shared/types";
// NOTE: Movie Index is now driven by static /public/movies.json
// MovieEntity is retired to ensure 100% reliability of the Top 50 list.
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