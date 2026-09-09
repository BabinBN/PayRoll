sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Token",
], (Controller,
    JSONModel,
    Fragment,
    MessageBox,
    MessageToast,
    Token
) => {
    "use strict";

    return Controller.extend("branch.controller.branch", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            // this.oModel = this.oOwnerComponent.getModel();
            this.advancedFilter();
            this.setEmptyModel();
        },
        onPressCreateBranch: function () {

            this.oRouter.navTo(
                "addedit-branchs",
                {
                    layout: "MidColumnFullScreen"
                }
            );
        },

        // Empty Model
        setEmptyModel: function () {
            let advancedFilterMdl = {
                id: null,
                name: null,
                company_id: null,
                location: null,
                created_by: null,
                created_on: null,
                modified_by: null,
                modified_on: null,
                status: null,
                description: null
            }

            let master = {
                companydt:
                    [
                        { id: 1, name: "ABC" },
                        { id: 2, name: "XYZ" }
                    ],
                statusdt:
                    [
                        { value: 1, description: "Active" },
                        { value: 2, description: "InActive" }
                    ],
                Locationdt:
                    [
                        { id: 1, location: "Dubai" },
                        { id: 2, location: "Oman" }
                    ]
            }

            this.getView().setModel(new JSONModel(master), "masterMdl")
            this.getView().setModel(new JSONModel(advancedFilterMdl), "branchesMdl");
        },

        // Error
        errorPopoverParams: function () {
            //IDs for Error message
            this.popoverBtn = this.getView().byId("btn_Location");

            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel('errors');
            this._pageId = this.getView().byId("page_AddEditLocation");
            this.formId = this.getView().byId("pt_form");
            Validators.removeValueState(this.formId, this.eMdl);
            // this.eMdl.setData([]);
            this._mViewSettingsDialogs = {};
            this.errorData = []
        },


        advancedFilter: async function () {
            try {
                const oModel =
                    this.getOwnerComponent().getModel();
                const oListBinding = oModel.bindList("/Branchs");

                const aContexts = await oListBinding.requestContexts();

                const aBranches = aContexts.map(function (oContext) { return oContext.getObject(); });

                this.getView().setModel(new JSONModel(aBranches), "branchesMdl")
            } catch (ex) {

            }
        },
        onListItemPress: function (oEvent) {

            const oItem = oEvent.getSource();

            const oContext =
                oItem.getBindingContext("branchesMdl");

            const oBranch =
                oContext.getObject();

            console.log("Selected Branch:", oBranch);

            this.oRouter.navTo(
                "addedit-branchs",
                {
                    branchId: oBranch.id,
                    layout: "MidColumnFullScreen"
                }
            );
        },

    }
    );
}
);
