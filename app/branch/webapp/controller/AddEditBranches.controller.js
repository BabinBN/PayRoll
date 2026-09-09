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
                const oModel =
                    this.getOwnerComponent().getModel();
                let oData = this.getView().getModel("branchesMdl").getData();

                const payload = {
                    company_id: Number(oData.company_id),
                    name: oData.name,
                    description: oData.description,
                    status_ID: Number(oData.status),
                    location: Number(oData.location)
                };
                console.log("Payload:", payload);
                const oListBinding = oModel.bindList("/Branchs");
                const oContext = oListBinding.create(payload);
                await oContext.created();
                MessageToast.show("Branch created successfully");
                console.log("Branch created successfully");
            } catch (oError) {
                console.error("Create Branch Error:", oError);
                MessageBox.error("Failed to create branch: " + oError.message);
            }
        }

    })
});