using {Employees as Emp} from '../db/Employess/Employees';
using {Enumerators as enum} from '../db/Enumerators/Enumerators';


@path: '/service/Empdt'
service Employee {
    @cds.redirection.target
    @odata.draft.enabled
    entity Employees       as projection on Emp.Employees;

    @readonly
    entity Status          as projection on Emp.Status;

    @readonly
    entity EmploymentTypes as projection on enum.employeement_Type;
    
    @odata.draft.enabled
    entity EmployeeLeaves as projection on Emp.EmployeeLeaves;
}

// annotate Employee with @requires :
// [
//     'authenticated-user'
// ];

annotate Employee.Employees with @Capabilities: {
    Insertable: false
};
