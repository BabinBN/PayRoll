using {Employees as Emp} from '../db/Employess/Employees';
using {Enumerators as enum} from '../db/Enumerators/Enumerators';


@path: '/service/Empdt'
@requires: 'authenticated-user'
service Employee {
    @cds.redirection.target
    @odata.draft.enabled
    // @restrict: [
    //     {
    //         grant: 'READ',
    //         to   : 'EmployeeViewer'
    //     },
    //     {
    //         grant: '*',
    //         to   : 'EmployeeAdmin'
    //     }
    // ]
    entity Employees       as projection on Emp.Employees;

    @readonly
    // @requires: 'EmployeeViewer'
    entity Status          as projection on Emp.Status;

    @readonly
    // @requires: 'EmployeeViewer'
    entity EmploymentTypes as projection on enum.employeement_Type;

    // @odata.draft.enabled
    // @requires: 'EmployeeViewer'
    entity EmployeeLeaves  as projection on Emp.EmployeeLeaves;
}

// annotate Employee with @requires :
// [
//     'authenticated-user'
// ];

annotate Employee.Employees with @Capabilities: {Insertable: false};
