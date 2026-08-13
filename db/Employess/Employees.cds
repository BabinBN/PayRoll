namespace Employees;

using {managed,cuid } from '@sap/cds/common';

entity Employees : managed,cuid {

    emp_code              : String(50);
    company_id            : Integer;
    external_emp_id       : String(100);
    first_name            : String(100);
    middle_name           : String(100);
    last_name             : String(100);
    gender                : String(20);
    marital_status        : String(20);
    dob                   : Date;
    email                 : String(255);
    mobile                : String(30);
    nationality           : String(100);
    time_process          : String(50);
    payroll_period_id     : Integer;
    joined_date           : Date;
    employment_status_id  : Integer;
    final_payment_status  : Boolean;
    status                : String(20);
}
