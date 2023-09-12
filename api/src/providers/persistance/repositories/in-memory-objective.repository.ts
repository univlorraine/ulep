import { LearningObjective } from 'src/core/models';
import { LearningObjectiveRepository } from 'src/core/ports/objective.repository';

export class InMemoryLearningObjectiveRepository
  implements LearningObjectiveRepository
{
  #objectives: LearningObjective[] = [];

  init(objectives: LearningObjective[]) {
    this.#objectives = objectives;
  }

  reset() {
    this.#objectives = [];
  }

  create(instance: LearningObjective): Promise<LearningObjective> {
    this.#objectives.push(instance);

    return Promise.resolve(instance);
  }

  ofId(id: string): Promise<LearningObjective> {
    const index = this.#objectives.findIndex(
      (objective) => objective.id === id,
    );

    if (index === -1) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.#objectives[index]);
  }

  ofName(name: string): Promise<LearningObjective> {
    const index = this.#objectives.findIndex(
      (objective) => objective.name.content === name,
    );

    if (index === -1) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.#objectives[index]);
  }

  all(): Promise<LearningObjective[]> {
    return Promise.resolve(this.#objectives);
  }

  delete(id: string): Promise<void> {
    const index = this.#objectives.findIndex(
      (objective) => objective.id === id,
    );

    if (index !== -1) {
      this.#objectives.splice(index, 1);
    }

    return Promise.resolve();
  }

  update(updatedInstance: LearningObjective): Promise<LearningObjective> {
    const index = this.#objectives.findIndex(
      (obj) => obj.id === updatedInstance.id,
    );

    if (index === -1) {
      return Promise.reject(null);
    }

    this.#objectives[index] = updatedInstance;

    return Promise.resolve(updatedInstance);
  }
}
