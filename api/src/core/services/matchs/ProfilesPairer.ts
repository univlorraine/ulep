import { Profile } from 'src/core/models/profile';
import { IMatchScorer } from './MatchScorer';

type Preferences = {
  scores: Map<number, number>;
  preferences: number[];
};

export class ProfilesPairer {
  // Mapping from each proposer index to its preferences
  private proposerPreferences: Map<number, Preferences>;
  // Mapping from each acceptor index to its preferences
  private acceptorPreferences: Map<number, Preferences>;

  constructor(
    private readonly proposers: Profile[],
    private readonly acceptors: Profile[],
    private readonly matchScorer: IMatchScorer,
  ) {
    this.proposerPreferences = this.generatePreferences(
      this.proposers,
      this.acceptors,
    );
    this.acceptorPreferences = this.generatePreferences(
      this.acceptors,
      this.proposers,
    );
  }

  /*
   * This function generates the preferences of group 1 profiles
   * with profiles in group 2. The preferences are sorted by score.
   */
  private generatePreferences(
    group1: Profile[],
    group2: Profile[],
  ): Map<number, Preferences> {
    const preferences = new Map();

    group1.forEach((profile1, index1) => {
      const scores = new Map();
      // Compute the score for each profile in group 2 and sort them by score
      const preference = group2
        .map((profile2, index2) => {
          const score = this.matchScorer.computeMatchScore(profile1, profile2);
          scores.set(index2, score.total);

          return { score: score.total, index: index2 };
        })
        .sort((a, b) => b.score - a.score)
        .map((item) => item.index);

      preferences.set(index1, { scores: scores, preferences: preference });
    });

    return preferences;
  }

  findStablePairs(): { proposer: Profile; acceptor: Profile; score: number }[] {
    // The number of pairs to match
    const n = Math.min(this.proposers.length, this.acceptors.length);

    const freeProposers = Array.from({ length: n }, (_, i) => i);
    const nextAcceptorChoice = new Array(n).fill(0);
    const proposerMatch = new Array(n).fill(null);
    const acceptorMatch = new Array(n).fill(null);

    while (freeProposers.length > 0) {
      const proposerIndex = freeProposers[0];
      const acceptorIndex =
        this.proposerPreferences.get(proposerIndex).preferences[
          nextAcceptorChoice[proposerIndex]
        ];

      // If the chosen acceptor is free match the proposer and acceptor
      if (acceptorMatch[acceptorIndex] === null) {
        proposerMatch[proposerIndex] = acceptorIndex;
        acceptorMatch[acceptorIndex] = proposerIndex;
        nextAcceptorChoice[proposerIndex]++;
        // Remove the proposer from the list of free proposers
        freeProposers.shift();
      } else {
        // If the chosen acceptor is not free find the rankings of the proposer
        // and the current match
        const currentProposerIndex = acceptorMatch[acceptorIndex];

        const proposerRanking = this.acceptorPreferences
          .get(acceptorIndex)
          .preferences.findIndex((x) => x === proposerIndex);

        const currentProposerRanking = this.acceptorPreferences
          .get(acceptorIndex)
          .preferences.findIndex((x) => x === currentProposerIndex);

        // If the proposer is more preferred than the current match
        // rematch the proposer and acceptor
        if (proposerRanking < currentProposerRanking) {
          proposerMatch[proposerIndex] = acceptorIndex;
          acceptorMatch[acceptorIndex] = proposerIndex;
          nextAcceptorChoice[proposerIndex]++;
          // Remove the proposer from the list of free proposers
          freeProposers.shift();
          // Add the current match back to the list of free proposers
          freeProposers.unshift(currentProposerIndex);
        } else {
          // If the proposer is less preferred, just move on to the next choice
          nextAcceptorChoice[proposerIndex]++;
        }
      }
    }

    // Return the matches with their scores
    return proposerMatch.map((acceptorIndex, proposerIndex) => {
      const score = this.proposerPreferences
        .get(proposerIndex)
        .scores.get(acceptorIndex);

      return {
        proposer: this.proposers[proposerIndex],
        acceptor: this.acceptors[acceptorIndex],
        score: score,
      };
    });
  }
}
