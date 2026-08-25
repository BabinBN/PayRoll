sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"holidaycalender/test/integration/pages/holiday_calendarList.gen",
	"holidaycalender/test/integration/pages/holiday_calendarObjectPage.gen",
	"holidaycalender/test/integration/pages/holiday_calendar_detailsObjectPage.gen"
], function (JourneyRunner, holiday_calendarListGenerated, holiday_calendarObjectPageGenerated, holiday_calendar_detailsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('holidaycalender') + '/test/flpSandbox.html#holidaycalender-tile',
        pages: {
			onTheholiday_calendarListGenerated: holiday_calendarListGenerated,
			onTheholiday_calendarObjectPageGenerated: holiday_calendarObjectPageGenerated,
			onTheholiday_calendar_detailsObjectPageGenerated: holiday_calendar_detailsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

