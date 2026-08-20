using Employee as service from '../../srv/employee-service';
annotate service.EmployeeLeaves with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'company_id',
                Value : company_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'type',
                Value : type,
            },
            {
                $Type : 'UI.DataField',
                Label : 'request_status',
                Value : request_status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'leave_definitions_id',
                Value : leave_definitions_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'from_date',
                Value : from_date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'to_date',
                Value : to_date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'actual_from_date',
                Value : actual_from_date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'actual_to_date',
                Value : actual_to_date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'from_date_type',
                Value : from_date_type,
            },
            {
                $Type : 'UI.DataField',
                Label : 'to_date_type',
                Value : to_date_type,
            },
            {
                $Type : 'UI.DataField',
                Label : 'return_date',
                Value : return_date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'return_from_actual',
                Value : return_from_actual,
            },
            {
                $Type : 'UI.DataField',
                Label : 'pay_run',
                Value : pay_run,
            },
            {
                $Type : 'UI.DataField',
                Label : 'sandwich_week_off_days',
                Value : sandwich_week_off_days,
            },
            {
                $Type : 'UI.DataField',
                Label : 'sandwich_holiday_days',
                Value : sandwich_holiday_days,
            },
            {
                $Type : 'UI.DataField',
                Label : 'final_no_of_leave_days',
                Value : final_no_of_leave_days,
            },
            {
                $Type : 'UI.DataField',
                Label : 'sandwich_prior_holiday',
                Value : sandwich_prior_holiday,
            },
            {
                $Type : 'UI.DataField',
                Label : 'sandwich_prior_week_off',
                Value : sandwich_prior_week_off,
            },
            {
                $Type : 'UI.DataField',
                Label : 'sandwich_post_holiday',
                Value : sandwich_post_holiday,
            },
            {
                $Type : 'UI.DataField',
                Label : 'sandwich_post_week_off',
                Value : sandwich_post_week_off,
            },
            {
                $Type : 'UI.DataField',
                Label : 'half_day_leave_days',
                Value : half_day_leave_days,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'leave_calendar_id',
                Value : leave_calendar_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'leave_calendar_year_detail_id',
                Value : leave_calendar_year_detail_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'comments',
                Value : comments,
            },
            {
                $Type : 'UI.DataField',
                Label : 'reject_reason',
                Value : reject_reason,
            },
            {
                $Type : 'UI.DataField',
                Label : 'file_name',
                Value : file_name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'file_path',
                Value : file_path,
            },
            {
                $Type : 'UI.DataField',
                Label : 'file_type',
                Value : file_type,
            },
            {
                $Type : 'UI.DataField',
                Label : 'future_leave_count',
                Value : future_leave_count,
            },
            {
                $Type : 'UI.DataField',
                Label : 'future_leave_year',
                Value : future_leave_year,
            },
            {
                $Type : 'UI.DataField',
                Label : 'is_paid',
                Value : is_paid,
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
            Label : 'company_id',
            Value : company_id,
        },
        {
            $Type : 'UI.DataField',
            Label : 'type',
            Value : type,
        },
        {
            $Type : 'UI.DataField',
            Label : 'request_status',
            Value : request_status,
        },
        {
            $Type : 'UI.DataField',
            Label : 'leave_definitions_id',
            Value : leave_definitions_id,
        },
        {
            $Type : 'UI.DataField',
            Label : 'from_date',
            Value : from_date,
        },
    ],
);

annotate service.EmployeeLeaves with {
    employee @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Employees',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : employee_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'company_id',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'dob',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'email',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'emp_code',
            },
        ],
    }
};

