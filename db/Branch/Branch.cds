namespace bh;

using {
    managed,
    cuid
} from '@sap/cds/common';
using {Employees.Status as Status} from '../Employess/Employees';

entity Branch : cuid, managed {
    company_id  : Integer;
    name        : String(30);
    description : String(50);
    status : Association to one Status;
    location    :Integer;

}
