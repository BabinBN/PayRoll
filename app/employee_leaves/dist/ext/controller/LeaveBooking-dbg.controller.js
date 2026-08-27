sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (
    Controller,
    History,
    JSONModel,
    Fragment,
    MessageToast
) {
    "use strict";

    return Controller.extend(
        "employeeleaves.ext.controller.LeaveBooking",
        {

            // =====================================================
            // INIT
            // =====================================================

            onInit: function () {

                console.log("LeaveBooking controller initialized");

                // -------------------------------------------------
                // MASTER DATA MODEL
                // -------------------------------------------------

                var oMasterData = {

                    leave_booking_type: [
                        {
                            value: "1",
                            description: "On Duty Application"
                        },
                        {
                            value: "2",
                            description: "Leave Application"
                        }
                    ],

                    leave_day_type: [
                        {
                            value: "1",
                            description: "Full Day"
                        },
                        {
                            value: "2",
                            description: "First Half"
                        },
                        {
                            value: "3",
                            description: "Second Half"
                        }
                    ],

                    leaveDefinitionsList: [
                        {
                            id: "1",
                            name: "Annual Leave"
                        },
                        {
                            id: "2",
                            name: "Sick Leave"
                        },
                        {
                            id: "3",
                            name: "Casual Leave"
                        },
                        {
                            id: "4",
                            name: "Permission"
                        }
                    ],

                    payoll_run_type: [
                        {
                            value: "1",
                            description: "Yes"
                        },
                        {
                            value: "0",
                            description: "No"
                        }
                    ]
                };

                this.getView().setModel(
                    new JSONModel(oMasterData),
                    "masterDataMdl"
                );


                // -------------------------------------------------
                // BOOKING MODEL
                // -------------------------------------------------

                var aDefaultRows = [
                    this._createEmptyEmployeeRow()
                ];

                this.getView().setModel(
                    new JSONModel(aDefaultRows),
                    "leaveBookingMdl"
                );


                // Verify model
                console.log(
                    "leaveBookingMdl:",
                    this.getView().getModel("leaveBookingMdl")
                );


                // -------------------------------------------------
                // ROUTER
                // -------------------------------------------------

                var oRouter =
                    this.getOwnerComponent().getRouter();

                var oRoute =
                    oRouter.getRoute("LeaveBooking");

                if (oRoute) {

                    oRoute.attachPatternMatched(
                        this._onRouteMatched,
                        this
                    );
                }


                // -------------------------------------------------
                // LOAD EMPLOYEES
                // -------------------------------------------------

                this.getAllEmployees();
            },


            // =====================================================
            // CREATE EMPTY EMPLOYEE ROW
            // =====================================================

            _createEmptyEmployeeRow: function () {

                return {

                    employee_id: null,

                    emp_code: "",

                    company_id: null,

                    employee_gender: null,

                    type: "",

                    emp_code_state: "None",

                    emp_code_stateText: "",

                    type_state: "None",

                    leaveDetails: [
                        this._createEmptyLeaveRow()
                    ],

                    attendanceDetails: [
                        this._createEmptyAttendanceRow()
                    ]
                };
            },


            // =====================================================
            // CREATE EMPTY LEAVE ROW
            // =====================================================

            _createEmptyLeaveRow: function () {

                return {

                    leave_definitions_id: "",

                    from_date: null,

                    from_date_type: "",

                    to_date: null,

                    to_date_type: "",

                    return_date: null,

                    payroll_run: "",

                    remarks: "",

                    error_code: 1
                };
            },


            // =====================================================
            // CREATE EMPTY ATTENDANCE ROW
            // =====================================================

            _createEmptyAttendanceRow: function () {

                return {

                    leave_definitions_id: null,

                    from_date: null,

                    from_date_type: "",

                    to_date: null,

                    to_date_type: "",

                    remarks: "",

                    error_code: 1
                };
            },


            // =====================================================
            // ROUTE MATCHED
            // =====================================================

            _onRouteMatched: function () {

                console.log(
                    "LeaveBooking route matched"
                );

                // Make sure model still exists
                var oBookingModel =
                    this.getView().getModel(
                        "leaveBookingMdl"
                    );

                if (!oBookingModel) {

                    console.error(
                        "leaveBookingMdl not found after route matched"
                    );

                    this.getView().setModel(
                        new JSONModel([
                            this._createEmptyEmployeeRow()
                        ]),
                        "leaveBookingMdl"
                    );
                }
            },


            // =====================================================
            // GET ALL EMPLOYEES
            // =====================================================

            getAllEmployees: async function () {

                try {

                    var oODataModel =
                        this.getOwnerComponent().getModel();

                    console.log(
                        "OData Model:",
                        oODataModel
                    );

                    if (!oODataModel) {

                        console.error(
                            "Default OData model not found"
                        );

                        MessageToast.show(
                            "OData model not available"
                        );

                        return;
                    }


                    var oListBinding =
                        oODataModel.bindList(
                            "/Employees",
                            null,
                            null,
                            null,
                            {
                                $expand: "status"
                            }
                        );


                    var aContexts =
                        await oListBinding.requestContexts();


                    var aEmployees =
                        aContexts.map(
                            function (oContext) {

                                return oContext.getObject();

                            }
                        );


                    console.log(
                        "Employees from CAP:",
                        aEmployees
                    );


                    var oEmployeeModel =
                        new JSONModel(aEmployees);


                    this.getView().setModel(
                        oEmployeeModel,
                        "employeeListMdl"
                    );


                    console.log(
                        "employeeListMdl created"
                    );

                } catch (oError) {

                    console.error(
                        "Error fetching Employees:",
                        oError
                    );

                    MessageToast.show(
                        "Failed to load employees"
                    );
                }
            },


            // =====================================================
            // EMPLOYEE VALUE HELP
            // =====================================================

            valueHelpDialogEmployee: function () {

                var oView = this.getView();

                if (!this._pDialog) {

                    this._pDialog =
                        Fragment.load({

                            id: oView.getId(),

                            name:
                                "employeeleaves.ext.fragment.SelectEmployee",

                            controller: this

                        }).then(

                            function (oDialog) {

                                oView.addDependent(
                                    oDialog
                                );

                                return oDialog;
                            }.bind(this)
                        );
                }


                this._pDialog.then(

                    function (oDialog) {

                        oDialog.open();

                    }.bind(this)
                );
            },


            // =====================================================
            // CLOSE EMPLOYEE VALUE HELP
            // =====================================================

            valueHelpEmployeeClose: function () {

                if (!this._pDialog) {
                    return;
                }

                this._pDialog.then(

                    function (oDialog) {

                        oDialog.close();

                    }
                );
            },


            // =====================================================
            // SELECT EMPLOYEE
            // =====================================================

            selectedEmpData: function () {

                var oModel =
                    this.getView().getModel(
                        "leaveBookingMdl"
                    );

                if (!oModel) {

                    MessageToast.show(
                        "Booking model not available"
                    );

                    return;
                }


                var aData =
                    oModel.getData();


                var oTable =
                    this.getView().byId(
                        "table_SelectEmp"
                    );


                if (!oTable) {

                    console.error(
                        "Employee selection table not found"
                    );

                    return;
                }


                var aSelectedItems =
                    oTable.getSelectedItems();


                if (
                    !aSelectedItems ||
                    aSelectedItems.length === 0
                ) {

                    MessageToast.show(
                        "Please select at least one employee"
                    );

                    return;
                }


                var aSelectedEmployees =
                    aSelectedItems.map(

                        function (oItem) {

                            return oItem
                                .getBindingContext(
                                    "employeeListMdl"
                                )
                                .getObject();

                        }
                    );


                aSelectedEmployees.forEach(

                    function (oEmployee) {

                        var sEmployeeId =
                            oEmployee.ID;

                        var sEmployeeCode =
                            oEmployee.emp_code;

                        var iCompanyId =
                            oEmployee.company_id;


                        // Find empty row
                        var oTargetRow =
                            aData.find(

                                function (oRow) {

                                    return !oRow.employee_id;

                                }
                            );


                        // If no empty row exists
                        if (!oTargetRow) {

                            oTargetRow =
                                this._createEmptyEmployeeRow();

                            aData.push(
                                oTargetRow
                            );
                        }


                        // Employee information
                        oTargetRow.employee_id =
                            sEmployeeId;

                        oTargetRow.emp_code =
                            sEmployeeCode;

                        oTargetRow.company_id =
                            iCompanyId;


                        oTargetRow.employee_gender =
                            oEmployee.gender === "M"
                                ? 2
                                : oEmployee.gender === "F"
                                    ? 3
                                    : oEmployee.gender === "T"
                                        ? 4
                                        : null;


                        // Reset child data
                        oTargetRow.leaveDetails = [
                            this._createEmptyLeaveRow()
                        ];

                        oTargetRow.attendanceDetails = [
                            this._createEmptyAttendanceRow()
                        ];

                    }.bind(this)
                );


                oModel.setData(
                    aData
                );

                oModel.refresh(true);


                console.log(
                    "Updated Booking Model:",
                    oModel.getData()
                );


                this.valueHelpEmployeeClose();
            },


            bulkPostLeave: async function () {

                try {

                    var oBookingModel =
                        this.getView().getModel("leaveBookingMdl");

                    if (!oBookingModel) {
                        MessageToast.show("Booking model not available");
                        return;
                    }

                    var aEmployees =
                        oBookingModel.getData();

                    if (!aEmployees || aEmployees.length === 0) {
                        MessageToast.show("Please add at least one employee");
                        return;
                    }


                    var oODataModel =
                        this.getOwnerComponent().getModel();

                    if (!oODataModel) {
                        MessageToast.show("OData model not available");
                        return;
                    }


                    // Dedicated batch group for Save
                    var oLeaveListBinding =
                        oODataModel.bindList(
                            "/EmployeeLeaves",
                            null,
                            null,
                            null,
                            {
                                $$updateGroupId: "leaveSaveGroup"
                            }
                        );


                    // =====================================================
                    // CREATE RECORDS
                    // =====================================================

                    for (var i = 0; i < aEmployees.length; i++) {

                        var oEmployee =
                            aEmployees[i];


                        if (!oEmployee.employee_id) {

                            MessageToast.show(
                                "Please select employee for row " +
                                (i + 1)
                            );

                            return;
                        }


                        // =================================================
                        // LEAVE
                        // =================================================

                        if (oEmployee.type === "2") {

                            var aLeaveDetails =
                                oEmployee.leaveDetails || [];


                            for (
                                var j = 0;
                                j < aLeaveDetails.length;
                                j++
                            ) {

                                var oLeave =
                                    aLeaveDetails[j];


                                if (!oLeave.leave_definitions_id) {

                                    MessageToast.show(
                                        "Please select Leave Type for " +
                                        oEmployee.emp_code
                                    );

                                    return;
                                }


                                if (!oLeave.from_date) {

                                    MessageToast.show(
                                        "Please select From Date for " +
                                        oEmployee.emp_code
                                    );

                                    return;
                                }


                                if (!oLeave.to_date) {

                                    MessageToast.show(
                                        "Please select To Date for " +
                                        oEmployee.emp_code
                                    );

                                    return;
                                }


                                var oPayload = {

                                    employee_ID:
                                        oEmployee.employee_id,

                                    company_id:
                                        oEmployee.company_id,

                                    type: "2",

                                    request_status: "2",

                                    leave_definitions_id:
                                        Number(
                                            oLeave.leave_definitions_id
                                        ),

                                    from_date:
                                        oLeave.from_date,

                                    to_date:
                                        oLeave.to_date,

                                    from_date_type:
                                        oLeave.from_date_type || null,

                                    to_date_type:
                                        oLeave.to_date_type || null,

                                    return_date:
                                        oLeave.return_date || null,

                                    pay_run:
                                        oLeave.payroll_run === "1",

                                    comments:
                                        oLeave.remarks || null,

                                    status: "1"
                                };


                                console.log(
                                    "CREATE EmployeeLeaves:",
                                    oPayload
                                );


                                oLeaveListBinding.create(
                                    oPayload
                                );
                            }
                        }


                        // =================================================
                        // ON DUTY
                        // =================================================

                        else if (oEmployee.type === "1") {

                            var aAttendanceDetails =
                                oEmployee.attendanceDetails || [];


                            for (
                                var k = 0;
                                k < aAttendanceDetails.length;
                                k++
                            ) {

                                var oAttendance =
                                    aAttendanceDetails[k];

                                if (!oAttendance.leave_definitions_id) {

                                    MessageToast.show(
                                        "Please select Attendance Type for " +
                                        oEmployee.emp_code
                                    );

                                    return;
                                }

                                if (!oAttendance.from_date) {

                                    MessageToast.show(
                                        "Please select From Date for " +
                                        oEmployee.emp_code
                                    );

                                    return;
                                }


                                if (!oAttendance.to_date) {

                                    MessageToast.show(
                                        "Please select To Date for " +
                                        oEmployee.emp_code
                                    );

                                    return;
                                }


                                var oDutyPayload = {

                                    employee_ID:
                                        oEmployee.employee_id,

                                    company_id:
                                        oEmployee.company_id,

                                    type: "1",

                                    request_status: "2",

                                    leave_definitions_id:
                                        Number(
                                            oAttendance.leave_definitions_id
                                        ),

                                    from_date:
                                        oAttendance.from_date,

                                    to_date:
                                        oAttendance.to_date,

                                    from_date_type:
                                        oAttendance.from_date_type || null,

                                    to_date_type:
                                        oAttendance.to_date_type || null,

                                    comments:
                                        oAttendance.remarks || null,

                                    status: "1"
                                };

                                console.log(
                                    "CREATE On Duty:",
                                    oDutyPayload
                                );


                                oLeaveListBinding.create(
                                    oDutyPayload
                                );
                            }
                        }

                        else {

                            MessageToast.show(
                                "Please select Booking Type for " +
                                oEmployee.emp_code
                            );

                            return;
                        }
                    }

                    console.log(
                        "Submitting leaveSaveGroup..."
                    );


                    await oODataModel.submitBatch(
                        "leaveSaveGroup"
                    );


                    console.log(
                        "Save successful"
                    );


                    MessageToast.show(
                        "Leave booking saved successfully"
                    );
                    this.resetBookingScreen();

                    this.onNavBack();


                } catch (oError) {

                    console.error(
                        "Save failed:",
                        oError
                    );

                    console.error(
                        "Message:",
                        oError.message
                    );

                    console.error(
                        "Cause:",
                        oError.cause
                    );


                    MessageToast.show(
                        "Failed to save leave booking"
                    );
                }
            },

            resetBookingScreen: function () {

                var oBookingModel =
                    this.getView().getModel("leaveBookingMdl");

                if (!oBookingModel) {
                    return;
                }

                oBookingModel.setData([
                    this._createEmptyEmployeeRow()
                ]);

                oBookingModel.refresh(true);

                console.log("Leave booking screen reset");
            },

            onPressAddRowHeader: function () {

                var oModel =
                    this.getView().getModel(
                        "leaveBookingMdl"
                    );


                if (!oModel) {

                    MessageToast.show(
                        "Booking model not available"
                    );

                    return;
                }


                var aData =
                    oModel.getData();


                aData.push(
                    this._createEmptyEmployeeRow()
                );


                oModel.setData(
                    aData
                );

                oModel.refresh(true);
            },


            // =====================================================
            // BOOKING TYPE CHANGE
            // =====================================================

            onChangeBookingType: function (oEvent) {

                var oComboBox =
                    oEvent.getSource();


                var sSelectedKey =
                    oComboBox.getSelectedKey();


                console.log(
                    "Booking Type:",
                    sSelectedKey
                );


                var oContext =
                    oComboBox.getBindingContext(
                        "leaveBookingMdl"
                    );


                if (!oContext) {
                    return;
                }


                var oModel =
                    oContext.getModel();


                var sPath =
                    oContext.getPath();


                if (sSelectedKey === "1") {

                    oModel.setProperty(
                        sPath + "/attendanceDetails",
                        [
                            this._createEmptyAttendanceRow()
                        ]
                    );


                    oModel.setProperty(
                        sPath + "/leaveDetails",
                        []
                    );

                } else if (
                    sSelectedKey === "2"
                ) {

                    oModel.setProperty(
                        sPath + "/leaveDetails",
                        [
                            this._createEmptyLeaveRow()
                        ]
                    );


                    oModel.setProperty(
                        sPath + "/attendanceDetails",
                        []
                    );
                }
            },


            // =====================================================
            // ADD CHILD ROW
            // =====================================================

            onPressAddRowItem: function (oEvent) {

                var oButton =
                    oEvent.getSource();


                var oContext =
                    oButton.getBindingContext(
                        "leaveBookingMdl"
                    );


                if (!oContext) {
                    return;
                }


                var oModel =
                    oContext.getModel();


                var sPath =
                    oContext.getPath();


                var oRow =
                    oContext.getObject();


                // -------------------------------------------------
                // ON DUTY
                // -------------------------------------------------

                if (
                    oRow.type === "1"
                ) {

                    var aAttendance =
                        oModel.getProperty(
                            sPath +
                            "/attendanceDetails"
                        ) || [];


                    aAttendance.push(
                        this._createEmptyAttendanceRow()
                    );


                    oModel.setProperty(
                        sPath +
                        "/attendanceDetails",
                        aAttendance
                    );
                }


                // -------------------------------------------------
                // LEAVE
                // -------------------------------------------------

                else if (
                    oRow.type === "2"
                ) {

                    var aLeave =
                        oModel.getProperty(
                            sPath +
                            "/leaveDetails"
                        ) || [];


                    aLeave.push(
                        this._createEmptyLeaveRow()
                    );


                    oModel.setProperty(
                        sPath +
                        "/leaveDetails",
                        aLeave
                    );
                }


                else {

                    MessageToast.show(
                        "Please select Booking Type first"
                    );
                }
            },


            // =====================================================
            // REMOVE EMPLOYEE ROW
            // =====================================================

            onPressRemoveRowHeader: function (oEvent) {

                var oButton =
                    oEvent.getSource();


                var oContext =
                    oButton.getBindingContext(
                        "leaveBookingMdl"
                    );


                if (!oContext) {
                    return;
                }


                var sPath =
                    oContext.getPath();


                var iIndex =
                    parseInt(
                        sPath.split("/").pop(),
                        10
                    );


                var oModel =
                    oContext.getModel();


                var aData =
                    oModel.getData();


                if (
                    aData.length === 1
                ) {

                    MessageToast.show(
                        "At least one employee row is required"
                    );

                    return;
                }


                aData.splice(
                    iIndex,
                    1
                );


                oModel.setData(
                    aData
                );

                oModel.refresh(true);
            },


            // =====================================================
            // REMOVE CHILD ROW
            // =====================================================

            onPressRemoveRowItem: function (oEvent) {

                var oButton =
                    oEvent.getSource();


                var oContext =
                    oButton.getBindingContext(
                        "leaveBookingMdl"
                    );


                if (!oContext) {
                    return;
                }


                var sPath =
                    oContext.getPath();


                console.log(
                    "Removing item:",
                    oContext.getObject()
                );


                // Example path:
                // /0/leaveDetails/1
                // /0/attendanceDetails/1

                var aPath =
                    sPath.split("/");


                if (
                    aPath.length < 4
                ) {
                    return;
                }


                var iEmployeeIndex =
                    parseInt(
                        aPath[1],
                        10
                    );


                var sDetailType =
                    aPath[2];


                var iDetailIndex =
                    parseInt(
                        aPath[3],
                        10
                    );


                var oModel =
                    this.getView().getModel(
                        "leaveBookingMdl"
                    );


                var aDetails =
                    oModel.getProperty(
                        "/" +
                        iEmployeeIndex +
                        "/" +
                        sDetailType
                    );


                if (
                    !aDetails ||
                    aDetails.length <= 1
                ) {

                    MessageToast.show(
                        "At least one detail row is required"
                    );

                    return;
                }


                aDetails.splice(
                    iDetailIndex,
                    1
                );


                oModel.setProperty(
                    "/" +
                    iEmployeeIndex +
                    "/" +
                    sDetailType,
                    aDetails
                );
            },


            // =====================================================
            // LEAVE TYPE CHANGE
            // =====================================================

            onChangeLeaveType: function (oEvent) {

                var sKey =
                    oEvent.getSource()
                        .getSelectedKey();


                console.log(
                    "Selected Attendance / Leave Type:",
                    sKey
                );
            },


            // =====================================================
            // DATE CHANGE
            // =====================================================

            onChangeDate: function (oEvent) {

                var oDatePicker =
                    oEvent.getSource();


                console.log(
                    "Selected Date:",
                    oDatePicker.getValue()
                );
            },


            // =====================================================
            // VALIDATION
            // =====================================================

            selectedRowValidation: function (oEvent) {

                console.log(
                    "Validation changed:",
                    oEvent.getSource()
                );
            },


            // =====================================================
            // SAVE
            // =====================================================

            onSave: function () {

                var oModel =
                    this.getView().getModel(
                        "leaveBookingMdl"
                    );


                if (!oModel) {

                    MessageToast.show(
                        "Booking model not available"
                    );

                    return;
                }


                var aData =
                    oModel.getData();


                console.log(
                    "Leave Booking Data:",
                    aData
                );


                MessageToast.show(
                    "Leave booking data prepared"
                );
            },


            // =====================================================
            // NAVIGATION BACK
            // =====================================================

            onNavBack: function () {

                var oHistory =
                    History.getInstance();


                var sPreviousHash =
                    oHistory.getPreviousHash();


                if (
                    sPreviousHash !== undefined
                ) {

                    window.history.go(-1);

                } else {

                    this
                        .getOwnerComponent()
                        .getRouter()
                        .navTo(
                            "EmployeeLeavesList",
                            {},
                            true
                        );
                }
            },


            // =====================================================
            // CLOSE
            // =====================================================

            handleClose: function () {

                this.onNavBack();

            }

        }
    );
});