import Question from '../domain/entities/Question';

interface QuestionCommand {
    id: string;
    answer: boolean;
    value: string;
}

export const quizzCommandToDomain = (command: QuestionCommand[]) => {
    return command.map((question) => new Question(question.id, question.value, question.answer));
};

export default QuestionCommand;
