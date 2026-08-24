sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, History, JSONModel, Fragment) {
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
        }
    });
});
