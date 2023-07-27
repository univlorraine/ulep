import Question from '../domain/entities/Question';

interface QuestionCommand {
    question: string;
    answer: boolean;
}

export const quizzCommandToDomain = (command: QuestionCommand[]) => {
    return command.map((question) => new Question(question.question, question.answer));
};

export default QuestionCommand;
