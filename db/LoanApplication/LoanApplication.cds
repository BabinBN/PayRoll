namespace LoanApplication;

using {cuid,managed} from '@sap/cds/common';

entity loan_application : cuid, managed {
        payroll_period           : Integer;
        date                     : Date;
        currency                 : String(50);
        disbursal_method         : Integer;
        remarks                  : String(250);
        status                   : Integer;
        wage_type_id             : Integer;
        name                     : Integer;
        wage_type_category_id    : Integer;
        payment_mode             : Integer;
        loan_application_details : Composition of many loan_application_detail
                                       on loan_application_details.loan_application = $self;
}

entity loan_application_detail : cuid, managed {
        employee_id            : Integer;
        loan_code              : Integer;
        loan_amount            : Double;
        disbursal_date         : Date;
        repayment_start_date   : Date;
        repayment_installments : Integer;
        remarks                : String(100);
        wage_type_id           : Integer;
        loan_application       : Association to one loan_application;
}
