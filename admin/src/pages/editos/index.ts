import EditoEdit from './edit';
import EditoList from './list';
import ManagerEditEdito from './manager/edit';

export default {
    list: EditoList,
    edit: EditoEdit,
    manager: {
        edit: ManagerEditEdito,
    },
};
