using Employee as service from '../../srv/employee-service';
annotate service.Employees with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'emp_code',
                Value : emp_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'company_id',
                Value : company_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'external_emp_id',
                Value : external_emp_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'first_name',
                Value : first_name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'middle_name',
                Value : middle_name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'last_name',
                Value : last_name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'gender',
                Value : gender,
            },
            {
                $Type : 'UI.DataField',
                Label : 'marital_status',
                Value : marital_status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'dob',
                Value : dob,
            },
            {
                $Type : 'UI.DataField',
                Label : 'email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'mobile',
                Value : mobile,
            },
            {
                $Type : 'UI.DataField',
                Label : 'nationality',
                Value : nationality,
            },
            {
                $Type : 'UI.DataField',
                Label : 'time_process',
                Value : time_process,
            },
            {
                $Type : 'UI.DataField',
                Label : 'payroll_period_id',
                Value : payroll_period_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'joined_date',
                Value : joined_date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'employment_status_id',
                Value : employment_status_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'final_payment_status',
                Value : final_payment_status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : email,
            Label : 'email',
        },
        {
            $Type : 'UI.DataField',
            Value : emp_code,
            Label : 'emp_code',
        },
        {
            $Type : 'UI.DataField',
            Value : gender,
            Label : 'gender',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'status',
        },
        {
            $Type : 'UI.DataField',
            Value : time_process,
            Label : 'time_process',
        },
        {
            $Type : 'UI.DataField',
            Value : payroll_period_id,
            Label : 'payroll_period_id',
        },
        {
            $Type : 'UI.DataField',
            Value : mobile,
            Label : 'mobile',
        },
        {
            $Type : 'UI.DataField',
            Value : joined_date,
            Label : 'joined_date',
        },
    ],
);

