sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function (
        Controller,
        JSONModel,
        MessageBox,
        MessageToast
    ) {
        "use strict";

        return Controller.extend(
            "department.controller.AddEditDepartments",
            {

                // =====================================================
                // INIT
                // =====================================================

                onInit: function () {

                    this.oRouter =
                        this.getOwnerComponent().getRouter();

                    this.initialMdl();

                    this.loadDropdownData();

                    this.registerpageIds();

                },


                // =====================================================
                // INITIAL DEPARTMENT MODEL
                // =====================================================

                initialMdl: function () {

                    const obj = {

                        id: null,

                        name: "",

                        company_id: null,

                        location_id: null,

                        branch_id: null,

                        status: null,

                        external_id: null,

                        created_by: 1,

                        created_on: null,

                        modified_by: null,

                        modified_on: null

                    };

                    this.getView().setModel(
                        new JSONModel(obj),
                        "departmentMdl"
                    );

                },


                // =====================================================
                // MANUAL DROPDOWN DATA
                // =====================================================

                loadDropdownData: function () {

                    // -------------------------------------------------
                    // COMPANY
                    // -------------------------------------------------

                    const aCompanies = [

                        {
                            id: 1,
                            name: "ABC Company"
                        },

                        {
                            id: 2,
                            name: "XYZ Company"
                        },

                        {
                            id: 3,
                            name: "Test Company"
                        }

                    ];

                    this.getView().setModel(
                        new JSONModel(aCompanies),
                        "companyMdl"
                    );


                    // -------------------------------------------------
                    // LOCATION
                    // -------------------------------------------------

                    const aLocations = [

                        {
                            id: 1,
                            location: "Bangalore"
                        },

                        {
                            id: 2,
                            location: "Chennai"
                        },

                        {
                            id: 3,
                            location: "Mumbai"
                        },

                        {
                            id: 4,
                            location: "Hyderabad"
                        }

                    ];

                    this.getView().setModel(
                        new JSONModel(aLocations),
                        "locationsMdl"
                    );


                    // -------------------------------------------------
                    // BRANCH
                    // -------------------------------------------------

                    const aBranches = [

                        {
                            id: 1,
                            name: "Main Branch"
                        },

                        {
                            id: 2,
                            name: "Electronic City"
                        },

                        {
                            id: 3,
                            name: "Whitefield"
                        },

                        {
                            id: 4,
                            name: "MG Road"
                        }

                    ];

                    this.getView().setModel(
                        new JSONModel(aBranches),
                        "branchesModel"
                    );


                    // -------------------------------------------------
                    // STATUS
                    // -------------------------------------------------

                    const aStatus = [

                        {
                            value: "ACTIVE",
                            description: "Active"
                        },

                        {
                            value: "INACTIVE",
                            description: "Inactive"
                        }

                    ];

                    this.getView().setModel(
                        new JSONModel({
                            status: aStatus
                        }),
                        "masterDataMdl"
                    );


                    // -------------------------------------------------
                    // EXTERNAL ID
                    // -------------------------------------------------

                    const aExternalIds = [

                        {
                            externalCode: "FIN",
                            name: "Finance"
                        },

                        {
                            externalCode: "HR",
                            name: "Human Resources"
                        },

                        {
                            externalCode: "IT",
                            name: "Information Technology"
                        },

                        {
                            externalCode: "ADMIN",
                            name: "Administration"
                        }

                    ];

                    this.getView().setModel(
                        new JSONModel(aExternalIds),
                        "departmentMasterMdl"
                    );

                },


                // =====================================================
                // REGISTER CONTROLS
                // =====================================================

                registerpageIds: function () {

                    this.name =
                        this.getView().byId("ip_name");

                    this.company =
                        this.getView().byId("cb_company");

                    this.status =
                        this.getView().byId("cb_status");

                    this.location =
                        this.getView().byId("cb_location");

                    this.branch =
                        this.getView().byId("cb_branch");

                },


                // =====================================================
                // COMPANY CHANGE
                // =====================================================

                changeCompany: function (oEvent) {

                    const oModel =
                        this.getView()
                            .getModel("departmentMdl");

                    const companyId =
                        oEvent.getSource()
                            .getSelectedKey();

                    oModel.setProperty(
                        "/company_id",
                        companyId
                    );

                    console.log(
                        "Selected Company:",
                        companyId
                    );

                    // Clear dependent values
                    oModel.setProperty(
                        "/location_id",
                        null
                    );

                    oModel.setProperty(
                        "/branch_id",
                        null
                    );

                },


                // =====================================================
                // LOCATION CHANGE
                // =====================================================

                changeLocation: function (oEvent) {

                    const oModel =
                        this.getView()
                            .getModel("departmentMdl");

                    const locationId =
                        oEvent.getSource()
                            .getSelectedKey();

                    oModel.setProperty(
                        "/location_id",
                        locationId
                    );

                    console.log(
                        "Selected Location:",
                        locationId
                    );

                },


                // =====================================================
                // STATUS CHANGE
                // =====================================================

                changeStatus: function (oEvent) {

                    const oModel =
                        this.getView()
                            .getModel("departmentMdl");

                    const status =
                        oEvent.getSource()
                            .getSelectedKey();

                    oModel.setProperty(
                        "/status",
                        status
                    );

                    console.log(
                        "Selected Status:",
                        status
                    );

                },


                // =====================================================
                // SAVE
                // =====================================================

                onPressSave: function () {

                    this.createDepartments(1);

                },


                // =====================================================
                // SAVE & CLOSE
                // =====================================================

                onPressSaveClose: function () {

                    this.createDepartments(2);

                },


                createDepartments: async function () {

                    try {

                        const oModel =
                            this.getOwnerComponent().getModel();

                        const data =
                            this.getView()
                                .getModel("departmentMdl")
                                .getData();

                        const oListBinding =
                            oModel.bindList("/Department");

                        const oContext =
                            oListBinding.create({

                                name: data.name,

                                // CDS field is company_i
                                company_i:
                                    Number(data.company_id),

                                location_id:
                                    Number(data.location_id),

                                branch_id:
                                    Number(data.branch_id),

                                status_ID:
                                    Number(data.status)

                            });

                        await oContext.created();

                        MessageToast.show(
                            "Department saved successfully"
                        );

                        this.oRouter.navTo("departments");

                    } catch (error) {

                        console.error(
                            "Department save error:",
                            error
                        );

                        MessageBox.error(
                            error.message ||
                            "Failed to save Department"
                        );
                    }
                },

                // =====================================================
                // CLOSE
                // =====================================================

                handleClose: function () {

                    this.oRouter.navTo(
                        "departments"
                    );

                },


                onPressClose: function () {

                    this.oRouter.navTo(
                        "departments"
                    );

                },


                // =====================================================
                // EXIT
                // =====================================================

                onExit: function () {

                    if (this.oRouter) {

                        this.oRouter
                            .getRoute("departments-post")
                            ?.detachPatternMatched(
                                this._onCreateRouteMatched,
                                this
                            );

                        this.oRouter
                            .getRoute("departments-edit")
                            ?.detachPatternMatched(
                                this._onEditRouteMatched,
                                this
                            );

                    }

                }

            }
        );
    }
);