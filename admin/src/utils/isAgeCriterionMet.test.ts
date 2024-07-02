import isAgeCriterionMet from './isAgeCriterionMet';

describe('isAgeCriterionMet', () => {
    it('User age is 15 and tandem age is 12, the result should be true', () => {
        expect(isAgeCriterionMet(15, 12)).toBe(true);
    });
    it('User age is 10 and tandem age is 20, the result should be false', () => {
        expect(isAgeCriterionMet(10, 20)).toBe(false);
    });
    it('User age is 30 and tandem age is 20, the result should be true', () => {
        expect(isAgeCriterionMet(30, 20)).toBe(true);
    });
    it('User age is 30 and tandem age is 19, the result should be false', () => {
        expect(isAgeCriterionMet(30, 19)).toBe(false);
    });
    it('User age is 50 and tandem age is 39, the result should be false', () => {
        expect(isAgeCriterionMet(50, 39)).toBe(false);
    });
    it('User age is 50 and tandem age is 40, the result should be true', () => {
        expect(isAgeCriterionMet(50, 40)).toBe(true);
    });
    it('User age is 50 and tandem age is 70, the result should be true', () => {
        expect(isAgeCriterionMet(50, 70)).toBe(true);
    });
});
