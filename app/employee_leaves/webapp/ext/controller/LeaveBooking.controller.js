sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, History, JSONModel, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("employeeleaves.ext.controller.LeaveBooking", {

        onInit: function () {
            console.log("LeaveBooking controller successfully initialized!");

            // 1. Listen for when this view route becomes active
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("LeaveBooking").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            console.log("LeaveBooking page route active. Initializing data structures...");

            // 2. Initialize Master Data Model for Dropdown entries
            var oMasterData = {
                leave_booking_type: [
                    { value: "1", description: "On Duty Application" },
                    { value: "2", description: "Leave Application" }
                ]
            };
            var oMasterModel = new JSONModel(oMasterData);
            this.getView().setModel(oMasterModel, "masterDataMdl");

            // 3. Create a clean default row item template structure
            var aDefaultRows = [
                {
                    emp_code: "",
                    employee_id: null,
                    type: "", // Defaults empty so booking combo box works
                    emp_code_state: "None",
                    emp_code_stateText: "",
                    type_state: "None",
                    leaveDetails: [
                        {
                            leave_type: "",
                            from_date: null,
                            from_date_type: "",
                            to_date: null,
                            to_date_type: ""
                        }
                    ]
                }
            ];

            // 4. Initialize Core Booking Form Model
            var oBookingModel = new JSONModel(aDefaultRows);
            this.getView().setModel(oBookingModel, "leaveBookingMdl");
            this.getAllEmployees();
        },

        valueHelpDialogEmployee: function () {
            // Safely grab the view instance directly from this controller scope
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "employeeleaves.ext.fragment.SelectEmployee",
                    controller: this,
                }).then(
                    function (oDialog) {
                        oView.addDependent(oDialog);
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

        onCloseUploadDialog: function () {
            if (this._pDialog) {
                this._pDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
        },
        valueHelpEmployeeClose: function () {
            if (this._pDialog) {
                this._pDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
        },

        // Handler to append a new item row layout block dynamically
        onPressAddRowHeader: function () {
            var oModel = this.getView().getModel("leaveBookingMdl");
            var aData = oModel.getData();

            aData.push({
                emp_code: "",
                employee_id: null,
                type: "",
                emp_code_state: "None",
                leaveDetails: [{ leave_type: "", from_date: null, to_date: null }]
            });

            oModel.refresh();
        },
        selectedEmpData: function () {

            var oModel = this.getView().getModel("leaveBookingMdl");
            var aData = oModel.getData();

            var oTable = this.getView().byId("table_SelectEmp");
            var aSelectedItems = oTable.getSelectedItems();

            // No employee selected
            if (!aSelectedItems || aSelectedItems.length === 0) {
                MessageToast.show("Please select at least one employee");
                return;
            }

            // Get selected Employees from employeeListMdl
            var aSelectedEmployees = aSelectedItems.map(function (oItem) {

                return oItem
                    .getBindingContext("employeeListMdl")
                    .getObject();

            });

            console.log("Selected Employees:", aSelectedEmployees);

            var aDuplicateEmployees = [];

            aSelectedEmployees.forEach(function (oEmployee) {

                console.log("Selected Employee:", oEmployee);

                /*
                 * Your CAP fields:
                 *
                 * ID
                 * emp_code
                 * company_id
                 * gender
                 */

                var sEmployeeId = oEmployee.ID;
                var sEmployeeCode = oEmployee.emp_code;
                var iCompanyId = oEmployee.company_id;
                var sGender = oEmployee.gender;

                // Check duplicate
                var bExists = aData.some(function (oRow) {

                    return oRow.employee_id === sEmployeeId;

                });

                if (bExists) {

                    aDuplicateEmployees.push(sEmployeeCode);

                    return;
                }

                // Find existing empty row
                var oEmptyRow = aData.find(function (oRow) {

                    return !oRow.employee_id;

                });

                var oTargetRow = oEmptyRow;

                // If no empty row exists, create one
                if (!oTargetRow) {

                    oTargetRow = {
                        employee_id: null,
                        emp_code: null,
                        company_id: null,
                        employee_gender: null,
                        type: null,
                        leaveDefinitionsList: [],
                        leaveDetails: []
                    };

                    aData.push(oTargetRow);
                }

                // Fill employee information
                oTargetRow.employee_id = sEmployeeId;
                oTargetRow.emp_code = sEmployeeCode;
                oTargetRow.company_id = iCompanyId;

                // Convert gender
                oTargetRow.employee_gender =
                    sGender === "M" ? 2 :
                        sGender === "F" ? 3 :
                            sGender === "T" ? 4 :
                                null;

                // Create leave detail
                oTargetRow.leaveDetails = [
                    {
                        id: null,

                        employee_id: sEmployeeId,
                        emp_code: sEmployeeCode,
                        company_id: iCompanyId,

                        type: null,
                        request_status: 2,
                        leave_definitions_id: null,

                        from_date: null,
                        to_date: null,

                        from_date_type: null,
                        to_date_type: null,

                        remarks: null,

                        return_date: null,
                        return_from_actual: null,

                        pay_run: null,

                        available_quota: null,

                        sandwich_week_off_days: null,
                        sandwich_holiday_days: null,

                        sandwich_prior_holiday: null,
                        sandwich_prior_weekoff: null,

                        sandwich_post_weekoff: null,
                        sandwich_post_holiday: null,

                        half_day_leave_days: null,
                        final_no_of_leave_days: null,

                        created_by: null,
                        created_on: new Date(),

                        modified_by: null,
                        modified_on: null,

                        status: null,

                        leaveDefinitionsList: oTargetRow.leaveDefinitionsList,

                        enable_return_date: false,
                        enable_payr_run: false,

                        is_annual_leave: 0,
                        leave_booking_status: 1,

                        error_code: 1,
                        error_description: null
                    }
                ];

            }.bind(this));

            // Refresh model
            oModel.refresh(true);

            // Show duplicate employees
            if (aDuplicateEmployees.length > 0) {

                MessageToast.show(
                    aDuplicateEmployees.join(", ") +
                    " already exists"
                );
            }

            // Close employee dialog
            this.valueHelpEmployeeClose();
        },

        // Handles standard back navigation returning to your List Report table
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("EmployeeLeavesList", {}, true);
            }
        },

        handleClose: function () {
            this.onNavBack();
        },
        getAllEmployees: async function () {
            try {
                var oODataModel = this.getOwnerComponent().getModel();

                var oListBinding = oODataModel.bindList(
                    "/Employees",
                    null,
                    null,
                    null,
                    {
                        $expand: "status"
                    }
                );

                var aContexts = await oListBinding.requestContexts();

                var aEmployees = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });

                console.log("Employees:", aEmployees);

                var oEmployeeModel = new JSONModel(aEmployees);

                this.getView().setModel(
                    oEmployeeModel,
                    "employeeListMdl"
                );

            } catch (oError) {
                console.error("Error fetching employees:", oError);
            }
        },
    });
});
