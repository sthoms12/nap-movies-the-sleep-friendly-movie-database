import { IndexedEntity } from "./core-utils";
import type { Movie, Submission } from "@shared/types";
import { INITIAL_MOVIES } from "@shared/mock-data";
export class MovieEntity extends IndexedEntity<Movie> {
  static readonly entityName = "movie";
  static readonly indexName = "movies";
  static readonly initialState: Movie = {
    id: "",
    title: "",
    year: 0,
    status: "active",
    votesNap: 0,
    votesEngaging: 0,
    tags: []
  };
  static seedData = INITIAL_MOVIES;
  async addVote(type: 'nap' | 'engaging'): Promise<Movie> {
    return this.mutate(s => {
      if (type === 'nap') return { ...s, votesNap: s.votesNap + 1 };
      return { ...s, votesEngaging: s.votesEngaging + 1 };
    });
  }
}
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