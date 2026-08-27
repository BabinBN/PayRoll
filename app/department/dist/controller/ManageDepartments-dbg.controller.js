sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,
    JSONModel
) {
    "use strict";

    return Controller.extend("department.controller.ManageDepartments", {

        onInit: function () {

            this.oRouter = this.getOwnerComponent().getRouter();

            // Controls
            this.tableId = this.byId("tableDepartments");
            this._company = this.byId("cb_Company");
            this.branch = this.byId("cb_branch");
            this.location = this.byId("cb_location");

            this.eMdl = new JSONModel([]);

            this._pageId = "department";
            this.setEmptyModel();
            this.getDepartments();

        },

        setEmptyModel: function () {

            var oAdvancedFilter = {
                name: null,
                company_id: null,
                location_id: null,
                branch_id: null,
                status: null,
                system_id: null
            };

            this.getView().setModel(
                new JSONModel(oAdvancedFilter),
                "advancedFilterMdl"
            );

            this.getView().setModel(
                new JSONModel([]),
                "gradesMdl"
            );

            this.getView().setModel(
                new JSONModel([]),
                "companyMdl"
            );

            this.getView().setModel(
                new JSONModel([]),
                "locationsMdl"
            );

            this.getView().setModel(
                new JSONModel([]),
                "branchesModel"
            );

            this.eMdl.setData([]);
        },


        clearAllFilters: function () {

            var oFilterModel =
                this.getView().getModel("advancedFilterMdl");

            oFilterModel.setData({
                name: null,
                company_id: null,
                location_id: null,
                branch_id: null,
                status: null,
                system_id: null
            });

            this.getView()
                .getModel("gradesMdl")
                .setData([]);

            this.getView()
                .getModel("locationsMdl")
                .setData([]);

            this.getView()
                .getModel("branchesModel")
                .setData([]);

            this.eMdl.setData([]);
        },

        getDepartments: async function () {

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

                    return;
                }

                // Bind Department entity
                var oListBinding =
                    oODataModel.bindList(
                        "/Department",
                        null,
                        null,
                        null,
                        {
                            $expand: "status"
                        }
                    );

                // Request records
                var aContexts =
                    await oListBinding.requestContexts();

                // Convert contexts to normal JS objects
                var aDepartments =
                    aContexts.map(function (oContext) {

                        return oContext.getObject();

                    });

                console.log(
                    "Departments from CAP:",
                    aDepartments
                );

                // Store in JSONModel
                var oDepartmentModel =
                    new JSONModel(aDepartments);

                this.getView().setModel(
                    oDepartmentModel,
                    "gradesMdl"
                );

                console.log(
                    "gradesMdl created"
                );

            } catch (oError) {

                console.error(
                    "Error fetching Departments:",
                    oError
                );

            }
        },
        handleExport: function () {

            var aData =
                this.getView()
                    .getModel("gradesMdl")
                    .getData();

            // Do not modify original table model
            var aExportData =
                aData.map(function (oItem) {

                    return {
                        name: oItem.name,
                        company_name: oItem.company_name,
                        branch_name: oItem.branch_name,
                        status:
                            oItem.status === 0
                                ? "Active"
                                : "Inactive"
                    };
                });

            this.onExport(
                this.createColumnConfig(),
                aExportData,
                "Departments"
            );
        },

        // =========================================================
        // CREATE DEPARTMENT
        // =========================================================

        onPressCreateDepartments: function () {

            this.oRouter.navTo(
                "departments-post",
                {
                    layout: "MidColumnFullScreen"
                }
            );
        },

        // =========================================================
        // UPDATE DEPARTMENT
        // =========================================================

        onListItemPress: function (oEvent) {

            const oContext =
                oEvent.getSource()
                    .getBindingContext("gradesMdl");

            if (!oContext) {
                return;
            }

            const oDepartment =
                oContext.getObject();

            console.log(
                "Selected Department:",
                oDepartment
            );

            this.oRouter.navTo(
                "departments-update",
                {
                    ID: oDepartment.ID,

                    IsActiveEntity:
                        String(
                            oDepartment.IsActiveEntity
                        )
                }
            );
        },

    });
});