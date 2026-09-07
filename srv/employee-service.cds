using {Employees as Emp} from '../db/Employess/Employees';
using {Enumerators as enum} from '../db/Enumerators/Enumerators';


@path    : '/service/Empdt'
@requires: 'authenticated-user'
service Employee {
    @cds.redirection.target
    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            to   : 'EmployeeViewer'
        },
        {
            grant: '*',
            to   : 'EmployeeAdmin'
        }
    ]
    entity Employees       as
        projection on Emp.Employees {
            *,
            virtual statusCriticality : Integer
        };

    type EmployeeInput : {
        emp_code             : String;
        company_id           : Integer;
        external_emp_id      : String;
        first_name           : String;
        middle_name          : String;
        last_name            : String;
        gender               : String;
        marital_status       : String;
        dob                  : Date;
        email                : String;
        mobile               : String;
        nationality          : String;
        time_process         : String;
        payroll_period_id    : Integer;
        joined_date          : Date;
        employment_status_id : Integer;
        final_payment_status : Boolean;
        status_ID            : Integer;
    }

    // action bulkCreateEmployees(payloads: array of EmployeeInput) returns array of Employees;

    @requires: 'EmployeeAdmin'
    action bulkCreateEmployees(payloads: array of EmployeeInput);


    @readonly
    @cds.redirection.target
    // @requires: 'EmployeeViewer'
    entity Status          as projection on Emp.Status;

    // @requires: 'EmployeeViewer'
    @readonly
    @cds.redirection.target
    entity EmploymentTypes as projection on enum.employeement_Type;

    // @odata.draft.enabled
    // @requires: 'EmployeeViewer'
    entity EmployeeLeaves  as projection on Emp.EmployeeLeaves;
}

// annotate Employee with @requires :
// [
//     'authenticated-user'
// ];

// annotate Employee.Employees with @Capabilities: {Insertable: false};

annotate Employee.Employees with @(
    UI.CreateHidden                           : true,
    Capabilities.InsertRestrictions.Insertable: true
);
