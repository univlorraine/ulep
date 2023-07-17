type occurence = 'UNVAVAILABLE' | 'AVAILABLE' | 'VERY_AVAILABLE';

class Availability {
    constructor(private _occurence: occurence, private _note?: string, private _isPrivate?: boolean) {}

    set note(note: string) {
        this._note = note;
    }

    get occurence() {
        return this._occurence;
    }

    set occurence(occurence: occurence) {
        this._occurence = occurence;
    }

    set isPrivate(isPrivate: boolean) {
        this._isPrivate = isPrivate;
    }
}

export const getInitialAviability = () => new Availability('VERY_AVAILABLE');

export default Availability;
