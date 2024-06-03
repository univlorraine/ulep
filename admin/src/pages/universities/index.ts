import CreateUniversity from './create';
import EditUniversity from './edit';
import UniversityList from './list';
import AdminEditUniversity from './manager/edit';
import AdminUniversityShow from './manager/show';
import UniversityShow from './show';

export default {
    edit: EditUniversity,
    create: CreateUniversity,
    list: UniversityList,
    show: UniversityShow,
    manager: {
        edit: AdminEditUniversity,
        show: AdminUniversityShow,
    },
};
