import CreateUniversity from './create';
import EditUniversity from './edit';
import UniversityList from './list';
import UniversityShow from './show';
import {default as AdminEditUniversity} from './admin/edit';
import {default as AdminUniversityShow} from './admin/show';

export default {
    edit: EditUniversity,
    create: CreateUniversity,
    list: UniversityList,
    show: UniversityShow,
    admin: {
        edit: AdminEditUniversity,
        show: AdminUniversityShow,
    }
};
