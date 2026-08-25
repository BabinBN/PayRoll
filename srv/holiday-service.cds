using {HolidayCalendar as holiday} from '../db/Holiday Calendar/Holiday Calendar';

@path: '/service/Holiday'


service HolidayService {
    @cds.redirection.target
    @odata.draft.enabled
    entity holiday_calendar as projection on holiday.holiday_calendar;
}