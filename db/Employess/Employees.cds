namespace Employees;

using {
    managed,
    cuid
} from '@sap/cds/common';

using {Enumerators as empty} from '../Enumerators/Enumerators';


entity EmployeeAdditionalInformation : cuid, managed {
    accomodation_type  : String(100);
    account_iban_no    : String(100);
    contract_no        : String(100);
    contract_type      : String(100);
    doctrine           : String(100);
    emirates_id        : String(100);
    emp_type           : Association to one empty.employeement_Type;
    first_name_arabic  : String(100);
    last_name_arabic   : String(100);
    logo_base_64       : LargeString;
    logo_path          : String(300);
    middle_name_arabic : String(100);
    payroll_lock       : Integer;
    profile            : String(300);
    profile_picture    : LargeBinary;
    sponsor_name       : String(100);
    unified_no         : Integer;
    wps_personal_no    : Integer;
    employee           : Association to one Employees;
}

entity EmployeeBankDetails : cuid, managed {
    account_name : String(100);
    account_no   : String(100);
    account_type : Integer;
    allocation   : String(100);
    bank_key     : Integer;
    bank_name    : String(100);
    branch       : String(100);
    iban_no      : String(100);
    payment_mode : Integer;
    reference    : String(100);
    status       : Association to one Status;
    employee     : Association to one Employees;
}

entity EmployeeJobDetails : cuid, managed {
    employment_type : Association to one empty.employeement_Type;
    end_date        : Date;
    start_date      : Date;
    status          : Association to one Status;
    employee        : Association to one Employees;
}

entity EmployeePositions : cuid, managed {
    end_date          : Date;
    grade             : Integer;
    is_reporting_head : Integer;
    position          : String(100);
    position_id       : String(100);
    reporting_head    : Integer;
    start_date        : Date;
    status            : Association to one Status;
    employee          : Association to one Employees;
}

entity EmployeeWorkshiftDetails : cuid, managed {
    end_date              : Date;
    holiday_calendar_id   : Integer;
    leave_calendar_id     : Integer;
    start_date            : Date;
    status                : Association to one Status;
    work_shift_pattern_id : Integer;
    employee              : Association to one Employees;
}

entity Employees : cuid, managed {
    company_id            : Integer;
    dob                   : Date;
    email                 : String(255);
    emp_code              : String(50);
    employment_status_id  : Integer;
    external_emp_id       : String(100);
    final_payment_status  : Boolean;
    first_name            : String(100);
    fullname_empcode      : String(300) = concat(
        concat(
            concat(
                concat(
                    first_name, ' '
                ), middle_name
            ), ' '
        ), concat(
            concat(
                last_name, ' - '
            ), emp_code
        )
    );
    gender                : String(20);
    joined_date           : Date;
    last_name             : String(100);
    marital_status        : String(20);
    middle_name           : String(100);
    mobile                : String(30);
    nationality           : String(100);
    payroll_period_id     : Integer;
    status                : Association to one Status;
    time_process          : String(50);
    additionalInformation : Composition of one EmployeeAdditionalInformation
                                on additionalInformation.employee = $self;
    bankDetails           : Composition of many EmployeeBankDetails
                                on bankDetails.employee = $self;
    jobDetails            : Composition of one EmployeeJobDetails
                                on jobDetails.employee = $self;
    positions             : Composition of one EmployeePositions
                                on positions.employee = $self;
    workshiftDetails      : Composition of one EmployeeWorkshiftDetails
                                on workshiftDetails.employee = $self;

    leave:Association to many EmployeeLeaves on leave.employee=$self;
}


// type Status : String enum {
//     Active   = '1';
//     Inactive = '2';
// }

@cds.persistence.name: 'EMPLOYEES_STATUS'
entity Status {
    key ID          : Integer;
        Name_status : String(20);
}


entity EmployeeLeaves:cuid,managed {

        employee:Association to one Employees;
        company_id                 : Integer;
        type                       : String(100);
        request_status              : String(50);
        leave_definitions_id       : Integer;

        from_date                  : Date;
        to_date                    : Date;
        actual_from_date           : Date;
        actual_to_date             : Date;

        from_date_type             : String(50);
        to_date_type               : String(50);

        return_date                : Date;
        return_from_actual         : Date;

        pay_run                    : Boolean;

        sandwich_week_off_days     : Decimal(15,3);
        sandwich_holiday_days      : Decimal(15,3);
        final_no_of_leave_days     : Decimal(15,3);

        sandwich_prior_holiday    : Decimal(15,3);
        sandwich_prior_week_off   : Decimal(15,3);
        sandwich_post_holiday     : Decimal(15,3);
        sandwich_post_week_off    : Decimal(15,3);

        half_day_leave_days        : Decimal(15,3);

        status                     : String(50);

        leave_calendar_id          : Integer;
        leave_calendar_year_detail_id : Integer;

        comments                   : LargeString;
        reject_reason              : LargeString;

        file_name                  : String(255);
        file_path                  : String(500);
        file_type                  : String(100);

        future_leave_count         : Decimal(15,3);
        future_leave_year          : Integer;

        is_paid                    : Boolean;
}