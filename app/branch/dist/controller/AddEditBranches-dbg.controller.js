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

    return Controller.extend("branch.controller.AddEditBranches", {

        onInit: function () {

            this.BranchMdl();
            this.oRouter = this.getOwnerComponent().getRouter();

            this.oRouter
                .getRoute("update-branchs")
                .attachPatternMatched(this._onUpdateRouteMatched, this);
        },
        _onUpdateRouteMatched: async function (oEvent) {

            const oArguments = oEvent.getParameter("arguments");

            this.sID = oArguments.ID;

            console.log("Branch ID:", this.sID);

            await this.fetchByBranch(this.sID);
        },
        fetchByBranch: async function (ID) {

            try {

                const oModel = this.getOwnerComponent().getModel();

                const oBinding = oModel.bindContext(
                    `/Branchs(${ID})`
                );

                const oBranch = await oBinding.requestObject();

                console.log("Branch:", oBranch);

                this.getView().setModel(
                    new JSONModel(oBranch),
                    "branchesMdl"
                );

            } catch (error) {

                console.error("Error fetching branch:", error);

            }
        },
        BranchMdl: function () {
            let branch = {
                company_id: null,
                name: null,
                description: null,
                status: null,
                location: null
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


            this.getView().setModel(new JSONModel(branch), "branchesMdl")
        },

        onPressSave: async function () {
            try {

                const oModel = this.getOwnerComponent().getModel();

                const oData = this.getView()
                    .getModel("branchesMdl")
                    .getData();

                // ==========================================
                // UPDATE EXISTING BRANCH
                // ==========================================
                if (this.sID) {

                    console.log("Updating Branch:", this.sID);

                    const oBinding = oModel.bindContext(
                        `/Branchs(${this.sID})`
                    );

                    const oContext = oBinding.getBoundContext();

                    await oBinding.requestObject();

                    oContext.setProperty("company_id", Number(oData.company_id));

                    oContext.setProperty("name", oData.name);

                    oContext.setProperty("description", oData.description);

                    oContext.setProperty("status_ID", Number(oData.status_ID));

                    oContext.setProperty("location", Number(oData.location));

                    // Send PATCH request
                    await oModel.submitBatch("$auto");

                    MessageToast.show(
                        "Branch updated successfully"
                    );

                    console.log(
                        "Branch updated successfully"
                    );

                    return;
                }


                // ==========================================
                // CREATE NEW BRANCH
                // ==========================================

                console.log("Creating new Branch");

                const payload = {
                    company_id: Number(oData.company_id),
                    name: oData.name,
                    description: oData.description,
                    status_ID: Number(oData.status_ID),
                    location: Number(oData.location)
                };

                console.log("Payload:", payload);

                const oListBinding = oModel.bindList("/Branchs");

                const oContext = oListBinding.create(payload);

                await oContext.created();

                MessageToast.show(
                    "Branch created successfully"
                );

                console.log(
                    "Branch created successfully"
                );

            } catch (oError) {

                console.error(
                    "Save Branch Error:",
                    oError
                );

                MessageBox.error(
                    "Failed to save branch: " +
                    oError.message
                );
            }
        }

    })
});