namespace HolidayCalendar;

using {
    managed,
    cuid
} from '@sap/cds/common';


entity holiday_calendar : cuid, managed {
    leave_calendar_id        : String(100);
    calendar_name            : String(100);
    status                   : String(50);
    holiday_calendar_dt :Composition of many holiday_calendar_details on holiday_calendar_dt.holiday_calendar = $self;
}


entity holiday_calendar_details : cuid, managed {
    holiday_calendar : Association to holiday_calendar;
    holiday_name : String(100);
    from_date    : Date;
    to_date      : Date;
    optional     : Boolean;
    status       : String(50);
}
