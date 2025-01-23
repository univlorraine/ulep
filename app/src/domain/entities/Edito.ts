import University from './University';

class Edito {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public university: University,
        public image?: string
    ) {}
}

export default Edito;
