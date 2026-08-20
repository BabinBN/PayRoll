using Employee as service from '../../srv/employee-service';
using from '../../db/Employess/Employees';

annotate service.Employees with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
         
            {
                $Type : 'UI.DataField',
                Label : 'time_process',
                Value : time_process,
            },
            {
                $Type : 'UI.DataField',
                Label : 'payroll_period_id',
                Value : payroll_period_id,
            }
          
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Time Process & PayRoll Details',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'JOB DETAILS',
            ID : 'JOBDETAILS',
            Target : '@UI.FieldGroup#JOBDETAILS',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'POSITION DETAILS',
            ID : 'PositionDetails',
            Target : '@UI.FieldGroup#PositionDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'WORK SHIFT DETAILS',
            ID : 'WORKSHIFTDETAILS',
            Target : '@UI.FieldGroup#WORKSHIFTDETAILS',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Bank Details',
            ID : 'BankDetails',
            Target : 'bankDetails/@UI.LineItem#BankDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Additional Information',
            ID : 'AdditionalInformation',
            Target : '@UI.FieldGroup#AdditionalInformation',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : email,
            Label : 'Email',
        },
        {
            $Type : 'UI.DataField',
            Value : emp_code,
            Label : 'Employee Code',
        },
        {
            $Type : 'UI.DataField',
            Value : gender,
            Label : 'Gender',
        },
        {
            $Type : 'UI.DataField',
            Value : time_process,
            Label : 'Time Process',
        },
        {
            $Type : 'UI.DataField',
            Value : mobile,
            Label : 'Mobile',
        },
        {
            $Type : 'UI.DataField',
            Value : joined_date,
            Label : 'Joined Date',
        },
    ],
    UI.Identification : [
        
    ],
    UI.FieldGroup #JOBDETAILS : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : joined_date,
                Label : 'joined_date',
            },
            {
                $Type : 'UI.DataField',
                Value : company_id,
                Label : 'company_id',
            },
            {
                $Type : 'UI.DataField',
                Value : jobDetails.employment_type,
                Label : 'employment_type',
            },
            {
                $Type : 'UI.DataField',
                Value : jobDetails.start_date,
                Label : 'start_date',
            },
            {
                $Type : 'UI.DataField',
                Value : bankDetails.branch,
                Label : 'branch',
            },
            {
                $Type : 'UI.DataField',
                Value : jobDetails.end_date,
                Label : 'end_date',
            },
        ],
    },
    UI.FieldGroup #WORKSHIFTDETAILS : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : workshiftDetails.work_shift_pattern_id,
                Label : 'work_shift_pattern_id',
            },
            {
                $Type : 'UI.DataField',
                Value : workshiftDetails.start_date,
                Label : 'start_date',
            },
            {
                $Type : 'UI.DataField',
                Value : workshiftDetails.leave_calendar_id,
                Label : 'leave_calendar_id',
            },
            {
                $Type : 'UI.DataField',
                Value : workshiftDetails.holiday_calendar_id,
                Label : 'holiday_calendar_id',
            },
        ],
    },
    UI.HeaderInfo : {
        ImageUrl : emp_code,
        TypeName : '',
        TypeNamePlural : '',
        Initials : emp_code,
        TypeImageUrl : 'sap-icon://customer',
        Title : {
            $Type : 'UI.DataField',
            Value : fullname_empcode,
        },
    },
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'EmployeeDetails',
            Target : '@UI.FieldGroup#EmployeeDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'test',
            Target : '@UI.FieldGroup#test',
        },
    ],
    UI.FieldGroup #EmployeeDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataFieldForAnnotation',
                Target : '@Communication.Contact#contact',
                Label : 'Email',
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Target : '@Communication.Contact#contact1',
                Label : 'Phone No',
            },
            {
                $Type : 'UI.DataField',
                Value : dob,
                Label : 'Date of Brith',
            },
            {
                $Type : 'UI.DataField',
                Value : gender,
                Label : 'Gender',
            },
        ],
    },
    Communication.Contact #contact : {
        $Type : 'Communication.ContactType',
        fn : email,
    },
    Communication.Contact #contact1 : {
        $Type : 'Communication.ContactType',
        fn : mobile,
    },
    UI.FieldGroup #test : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : marital_status,
                Label : 'Marital status',
            },
            {
                $Type : 'UI.DataField',
                Value : nationality,
                Label : 'Nationality',
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'Status',
            },
        ],
    },
    UI.FieldGroup #PositionDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : positions.position,
                Label : 'position',
            },
            {
                $Type : 'UI.DataField',
                Value : positions.start_date,
                Label : 'start_date',
            },
            {
                $Type : 'UI.DataField',
                Value : positions.end_date,
                Label : 'end_date',
            },
            {
                $Type : 'UI.DataField',
                Value : positions.grade,
                Label : 'grade',
            },
            {
                $Type : 'UI.DataField',
                Value : positions.is_reporting_head,
                Label : 'is_reporting_head',
            },
            {
                $Type : 'UI.DataField',
                Value : positions.reporting_head,
                Label : 'reporting_head',
            },
        ],
    },
    UI.FieldGroup #AdditionalInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : additionalInformation.wps_personal_no,
                Label : 'wps_personal_no',
            },
            {
                $Type : 'UI.DataField',
                Value : additionalInformation.contract_no,
                Label : 'contract_no',
            },
            {
                $Type : 'UI.DataField',
                Value : additionalInformation.accomodation_type,
                Label : 'accomodation_type',
            },
            {
                $Type : 'UI.DataField',
                Value : additionalInformation.contract_type,
                Label : 'contract_type',
            },
            {
                $Type : 'UI.DataField',
                Value : additionalInformation.doctrine,
                Label : 'doctrine',
            },
            {
                $Type : 'UI.DataField',
                Value : additionalInformation.sponsor_name,
                Label : 'sponsor_name',
            },
            {
                $Type : 'UI.DataField',
                Value : additionalInformation.emirates_id,
                Label : 'emirates_id',
            },
        ],
    },
    UI.SelectionFields : [
        emp_code,
        joined_date,
        external_emp_id,
        status_ID,
        additionalInformation.emp_type_ID,
    ],
);

annotate service.EmployeeBankDetails with @(
    UI.LineItem #BankDetails : [
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.account_no,
            Label : 'account_no',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.account_name,
            Label : 'account_name',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.iban_no,
            Label : 'iban_no',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.payment_mode,
            Label : 'payment_mode',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.bank_key,
            Label : 'bank_key',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.bank_name,
            Label : 'bank_name',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.branch,
            Label : 'branch',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.reference,
            Label : 'reference',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.bankDetails.status,
            Label : 'status',
        },
    ]
);

annotate service.Employees with {
    emp_code @(
        Common.Label : 'Employee Code',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Employees',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : emp_code,
                    ValueListProperty : 'emp_code',
                },
            ],
            Label : 'employee code',
        },
        Common.ValueListWithFixedValues : false,
        )
};

annotate service.Employees with {
    joined_date @Common.Label : 'Joined Date'
};

annotate service.Employees with {
    status @(
        Common.Label : 'Status',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Status',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Status',
        },
        Common.ValueListWithFixedValues : true,
        )
};

annotate service.EmployeeJobDetails with {
    employment_type @(
        Common.Label : 'Employee Type',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'EmployeeJobDetails',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : employment_type,
                    ValueListProperty : 'employment_type',
                },
            ],
            Label : 'Employee Type',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.Employees with {
    external_emp_id @Common.Label : 'Employee External Code'
};

annotate service.Status with {
    ID @(
        Common.Text : Name_status,
        Common.Text.@UI.TextArrangement : #TextOnly,
)};

annotate service.EmployeeAdditionalInformation with {
    emp_type @(
        Common.Label : 'Employee Type',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'EmploymentTypes',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : emp_type_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Employee Type',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.EmploymentTypes with {
    ID @(
        Common.Text : employeement_Type_Name,
        Common.Text.@UI.TextArrangement : #TextOnly,
)};

