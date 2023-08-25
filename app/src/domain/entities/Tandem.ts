import Language from './Language';
import Profile from './Profile';

class Tandem {
    constructor(public id: string, public language: Language, public status: TandemStatus, public partner?: Profile) {}
}

export default Tandem;
