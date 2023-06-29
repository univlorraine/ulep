export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DomainEvent {}
