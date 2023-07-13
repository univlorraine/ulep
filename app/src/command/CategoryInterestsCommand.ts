import CategoryInterests from '../domain/entities/CategoryInterests';

interface CategoryInterestsCommand {
    id: string;
    name: string;
    interests: string[];
}

export const ategoryInterestsCommandToDomain = (command: CategoryInterestsCommand) => {
    return new CategoryInterests(command.id, command.name, command.interests);
};

export default CategoryInterestsCommand;
