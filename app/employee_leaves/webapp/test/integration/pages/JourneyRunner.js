sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"employeeleaves/test/integration/pages/EmployeeLeavesList.gen",
	"employeeleaves/test/integration/pages/EmployeeLeavesObjectPage.gen"
], function (JourneyRunner, EmployeeLeavesListGenerated, EmployeeLeavesObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('employeeleaves') + '/test/flpSandbox.html#employeeleaves-tile',
        pages: {
			onTheEmployeeLeavesListGenerated: EmployeeLeavesListGenerated,
			onTheEmployeeLeavesObjectPageGenerated: EmployeeLeavesObjectPageGenerated
        },
        async: true
    });

    return runner;
});

