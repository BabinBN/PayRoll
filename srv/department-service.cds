using {Department as Dep} from '../db/Department/Deparment';
using {Employees as Emp} from '../db/Employess/Employees';
@path: '/service/Department'


service DepartmentService {
    @odata.draft.enabled
    entity Department as projection on Dep.Department;

     @readonly
    entity Status as projection on Emp.Status;

}
