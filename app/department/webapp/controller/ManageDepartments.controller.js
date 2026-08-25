sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,
    JSONModel
) {
    "use strict";

    return Controller.extend("department.controller.ManageDepartments", {

        // =========================================================
        // INIT
        // =========================================================

        onInit: function () {

            this.oRouter = this.getOwnerComponent().getRouter();

            // Controls
            this.tableId = this.byId("tableDepartments");
            this._company = this.byId("cb_Company");
            this.branch = this.byId("cb_branch");
            this.location = this.byId("cb_location");

            // Validation model
            this.eMdl = new JSONModel([]);

            // Page ID if required by Validators
            this._pageId = "department";

            // Initialize models
            // this.setEmptyModel();

            // // Load companies
            // this.getCompanies();
        },

        // =========================================================
        // EMPTY MODELS
        // =========================================================

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

        // =========================================================
        // CLEAR FILTERS
        // =========================================================

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

        // =========================================================
        // GET COMPANIES
        // =========================================================

        getCompanies: async function () {

            try {

                this._company.setBusy(true);

                var path =
                    URLConstants.URL.companies_for_select;

                var response =
                    await this.restMethodGet(path);

                console.log("Companies response:", response);

                if (!Array.isArray(response)) {
                    response = [];
                }

                // Only Active companies
                var aCompanies = response.filter(function (oCompany) {
                    return oCompany.status === 0;
                });

                this.getView()
                    .getModel("companyMdl")
                    .setData(aCompanies);

                // If only one company exists
                if (aCompanies.length === 1) {

                    var oCompany = aCompanies[0];

                    this.getView()
                        .getModel("advancedFilterMdl")
                        .setProperty(
                            "/company_id",
                            oCompany.id
                        );

                    this.getView()
                        .getModel("advancedFilterMdl")
                        .setProperty(
                            "/system_id",
                            oCompany.system_id
                        );

                    this._company.setSelectedKey(
                        oCompany.id
                    );

                    // Load dependent data
                    await this.getBranches(oCompany.id);
                    await this.fetchLocation(oCompany.id);

                    // Load departments
                    await this.advancedFilter();
                }

            } catch (error) {

                console.error(
                    "getCompanies error:",
                    error
                );

                this.errorHandling(error);

            } finally {

                this._company.setBusy(false);
            }
        },

        // =========================================================
        // COMPANY CHANGE
        // =========================================================

        onChangeCompany: async function (oEvent) {

            try {

                var oComboBox = oEvent.getSource();

                var companyId =
                    oComboBox.getSelectedKey();

                console.log(
                    "Selected Company ID:",
                    companyId
                );

                var oFilterModel =
                    this.getView()
                        .getModel("advancedFilterMdl");

                // Set company
                oFilterModel.setProperty(
                    "/company_id",
                    companyId
                );

                // Clear dependent selections
                oFilterModel.setProperty(
                    "/location_id",
                    null
                );

                oFilterModel.setProperty(
                    "/branch_id",
                    null
                );

                // Find company
                var aCompanies =
                    this.getView()
                        .getModel("companyMdl")
                        .getData();

                var oSelectedCompany =
                    aCompanies.find(function (oCompany) {

                        return String(oCompany.id) ===
                            String(companyId);
                    });

                console.log(
                    "Selected Company:",
                    oSelectedCompany
                );

                // Set system ID
                oFilterModel.setProperty(
                    "/system_id",
                    oSelectedCompany
                        ? oSelectedCompany.system_id
                        : null
                );

                // Load branches
                await this.getBranches(companyId);

                // Load locations
                await this.fetchLocation(companyId);

            } catch (error) {

                console.error(
                    "onChangeCompany error:",
                    error
                );

                this.errorHandling(error);
            }
        },

        // =========================================================
        // GET BRANCHES
        // =========================================================

        getBranches: async function (companyId) {

            try {

                this.branch.setBusy(true);

                if (!companyId) {

                    this.getView()
                        .getModel("branchesModel")
                        .setData([]);

                    return;
                }

                var path =
                    URLConstants.URL.branches_by_company_id
                        .replace(
                            "{companyId}",
                            companyId
                        );

                console.log(
                    "Branches URL:",
                    path
                );

                var response =
                    await this.restMethodGet(path);

                console.log(
                    "Branches response:",
                    response
                );

                if (!Array.isArray(response)) {
                    response = [];
                }

                this.getView()
                    .getModel("branchesModel")
                    .setData(response);

            } catch (error) {

                console.error(
                    "getBranches error:",
                    error
                );

                this.errorHandling(error);

            } finally {

                this.branch.setBusy(false);
            }
        },

        // =========================================================
        // GET LOCATIONS
        // =========================================================

        fetchLocation: async function (companyId) {

            try {

                this.location.setBusy(true);

                if (!companyId) {

                    this.getView()
                        .getModel("locationsMdl")
                        .setData([]);

                    return;
                }

                var oFilterModel =
                    this.getView()
                        .getModel("advancedFilterMdl");

                var oData = {

                    company_id: companyId,
                    page_number: 1,
                    page_size: 1000

                };

                console.log(
                    "Location payload:",
                    oData
                );

                var path =
                    URLConstants.URL.get_location;

                var response =
                    await this.restMethodPost(
                        path,
                        oData
                    );

                console.log(
                    "Location response:",
                    response
                );

                if (!Array.isArray(response)) {
                    response = [];
                }

                this.getView()
                    .getModel("locationsMdl")
                    .setData(response);

            } catch (error) {

                console.error(
                    "fetchLocation error:",
                    error
                );

                this.errorHandling(error);

            } finally {

                this.location.setBusy(false);
            }
        },

        // =========================================================
        // FILTER
        // =========================================================

        advancedFilter: async function () {

            try {

                this.tableId.setBusy(true);

                /*
                 * Validation
                 *
                 * Keep this only if your project already has
                 * Validators.filterBarValidation().
                 */

                if (
                    typeof Validators !== "undefined" &&
                    Validators.filterBarValidation
                ) {

                    Validators.filterBarValidation(
                        this.formId,
                        this.eMdl,
                        this._pageId
                    );
                }

                var aValidationErrors =
                    this.eMdl.getData();

                if (
                    aValidationErrors &&
                    aValidationErrors.length > 0
                ) {

                    this.errorHandling();
                    return;
                }

                var oFilterModel =
                    this.getView()
                        .getModel("advancedFilterMdl");

                var oData =
                    Object.assign(
                        {},
                        oFilterModel.getData()
                    );

                // Pagination
                oData.page_number = 1;
                oData.page_size = 1000;

                // Map name to backend field
                if (oData.name) {
                    oData.department_name =
                        oData.name;
                }

                console.log(
                    "Payload sent to backend:",
                    oData
                );

                var path =
                    URLConstants.URL.departments_all;

                var response =
                    await this.restMethodPost(
                        path,
                        oData
                    );

                console.log(
                    "Department response:",
                    response
                );

                if (!Array.isArray(response)) {
                    response = [];
                }

                // =================================================
                // Company / Branch / Location names
                // =================================================

                var aCompanies =
                    this.getView()
                        .getModel("companyMdl")
                        .getData();

                var aBranches =
                    this.getView()
                        .getModel("branchesModel")
                        .getData();

                var aLocations =
                    this.getView()
                        .getModel("locationsMdl")
                        .getData();

                response.forEach(function (oDepartment) {

                    var oCompany =
                        aCompanies.find(function (oItem) {

                            return String(oItem.id) ===
                                String(
                                    oDepartment.company_id
                                );
                        });

                    var oBranch =
                        aBranches.find(function (oItem) {

                            return String(oItem.id) ===
                                String(
                                    oDepartment.branch_id
                                );
                        });

                    var oLocation =
                        aLocations.find(function (oItem) {

                            return String(oItem.id) ===
                                String(
                                    oDepartment.location_id
                                );
                        });

                    oDepartment.company_name =
                        oCompany
                            ? oCompany.name
                            : "";

                    oDepartment.branch_name =
                        oBranch
                            ? oBranch.name
                            : "";

                    oDepartment.location_name =
                        oLocation
                            ? oLocation.location
                            : "";
                });

                // Set table data
                this.getView()
                    .getModel("gradesMdl")
                    .setData(response);

            } catch (error) {

                console.error(
                    "advancedFilter error:",
                    error
                );

                this.errorHandling(error);

            } finally {

                this.tableId.setBusy(false);
            }
        },

        // =========================================================
        // EXPORT
        // =========================================================

        createColumnConfig: function () {

            return [

                {
                    label: "Name",
                    property: "name",
                    width: 25
                },

                {
                    label: "Company",
                    property: "company_name",
                    width: 25
                },

                {
                    label: "Branch",
                    property: "branch_name",
                    width: 25
                },

                {
                    label: "Status",
                    property: "status",
                    width: 25
                }

            ];
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

            var oContext =
                oEvent.getSource()
                    .getBindingContext("gradesMdl");

            if (!oContext) {
                return;
            }

            var oDepartment =
                oContext.getObject();

            console.log(
                "Selected department:",
                oDepartment
            );

            this.oRouter.navTo(
                "departments-update",
                {
                    layout: "MidColumnFullScreen",
                    ID: oDepartment.id
                }
            );
        }

    });
});