using { Employees As Emp } from '../db/Employess/Employees';

@path : '/service/Empdt'
service Employee
{
    @cds.redirection.target
    @odata.draft.enabled
    entity Employees as
        projection on Emp.Employees;
}

// annotate Employee with @requires :
// [
//     'authenticated-user'
// ];

