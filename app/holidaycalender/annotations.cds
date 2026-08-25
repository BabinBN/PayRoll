using HolidayService as service from '../../srv/holiday-service';
annotate service.holiday_calendar with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'leave_calendar_id',
                Value : leave_calendar_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'calendar_name',
                Value : calendar_name,
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
            Target : '@UI.FieldGroup#GeneratedGroup',
            Label : 'Holiday Header',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'HolidayDetails',
            Target : 'holiday_calendar_dt/@UI.LineItem#HolidayDetails',
            Label : 'Holiday Details',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'leave_calendar_id',
            Value : leave_calendar_id,
        },
        {
            $Type : 'UI.DataField',
            Label : 'calendar_name',
            Value : calendar_name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'status',
            Value : status,
        },
    ],
    UI.SelectionFields : [
        calendar_name,
    ],
    UI.HeaderInfo : {
        TypeName : 'Holiday Calendar',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : calendar_name,
        },
    },
);

annotate service.holiday_calendar with {
    calendar_name @Common.Label : 'calendar_name'
};

annotate service.holiday_calendar_details with @(
    UI.LineItem #HolidayDetails : [
        {
            $Type : 'UI.DataField',
            Value : holiday_name,
            Label : 'Holiday Name',
        },
        {
            $Type : 'UI.DataField',
            Value : from_date,
            Label : 'From Date',
        },
        {
            $Type : 'UI.DataField',
            Value : to_date,
            Label : 'To Date',
        },
    ]
);

