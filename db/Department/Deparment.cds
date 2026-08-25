namespace Department;

using {
    managed,
    cuid
} from '@sap/cds/common';

using {Employees as emp} from '../Employess/Employees';

entity Department : cuid, managed {
    name        : String(30);
    company_i   : Integer;
    location_id : Integer;
    branch_id   : Integer;
    status      : Association to one emp.Status;
}
