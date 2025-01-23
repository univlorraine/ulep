import University from './University';

class Edito {
    constructor(
        public id: string,
        public content: string,
        public university: University,
        public image?: string
    ) {}
}

export default Edito;
