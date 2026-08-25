using {Department as Dep} from '../db/Department/Deparment';

@path: '/service/Department'


service DepartmentService {
    @odata.draft.enabled
    entity Department as projection on Dep.Department;

}
