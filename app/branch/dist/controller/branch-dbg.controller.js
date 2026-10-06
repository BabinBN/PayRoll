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
        onPressDeleteBranch: async function () {
            const oTable = this.byId("tableBranches");
            const aSelectedItems = oTable.getSelectedItems();

            console.log("Selected:", aSelectedItems.length);

            if (!aSelectedItems.length) {
                MessageToast.show("Please select a branch");
                return;
            }

            const oModel = this.getOwnerComponent().getModel();
            const aFailed = [];

            for (const oItem of aSelectedItems) {
                const oJsonContext = oItem.getBindingContext("branchesMdl");
                const oBranch = oJsonContext.getObject();
                const sID = oBranch.ID;

                try {
                    if (!sID) {
                        throw new Error("Missing ID on selected branch");
                    }

                    console.log("Deleting Branch:", sID);

                    // NOTE: wrap sID in quotes only if the key is Edm.String/Guid.
                    // If ID is Edm.Int32/Int64, remove the quotes below.
                    const oBinding = oModel.bindContext(`/Branchs('${sID}')`);
                    const oODataContext = oBinding.getBoundContext();

                    console.log("OData Path:", oODataContext.getPath());

                    await oODataContext.delete("$direct");

                    console.log("DELETE completed:", sID);

                } catch (error) {
                    console.error("DELETE ERROR for", sID, ":", error);
                    aFailed.push({ id: sID, message: error.message || String(error) });
                }
            }

            // Always refresh, even on partial failure, so the table reflects reality
            try {
                await this.advancedFilter();
            } catch (refreshError) {
                console.error("REFRESH ERROR after delete:", refreshError);
            }

            oTable.removeSelections(true);

            if (aFailed.length === 0) {
                MessageToast.show("Branch(es) deleted successfully");
            } else if (aFailed.length === aSelectedItems.length) {
                MessageBox.error(
                    `Delete failed for all ${aFailed.length} branch(es). First error: ${aFailed[0].message}`
                );
            } else {
                MessageBox.warning(
                    `${aSelectedItems.length - aFailed.length} deleted, ${aFailed.length} failed.\n` +
                    aFailed.map(f => `- ${f.id}: ${f.message}`).join("\n")
                );
            }
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
                "update-branchs",
                {
                    ID: oBranch.ID,
                    layout: "MidColumnFullScreen"
                }
            );
        },

    }
    );
}
);
