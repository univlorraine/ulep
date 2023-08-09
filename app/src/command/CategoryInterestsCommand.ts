import CategoryInterests, { Interest } from '../domain/entities/CategoryInterests';

interface CategoryInterestsCommand {
    id: string;
    name: string;
    interests: { id: string; name: string }[];
}

export const categoryInterestsCommandToDomain = (command: CategoryInterestsCommand) => {
    return new CategoryInterests(
        command.id,
        command.name,
        command.interests.map((interest) => new Interest(interest.id, interest.name))
    );
};

export default CategoryInterestsCommand;
