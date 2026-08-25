sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("syncdata.controller.Sync_Data", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("RouteSync_Data").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this.getAllSyncErpData();
        },
        getAllSyncErpData: async function () {
            try {
                var that = this;
                this._pageId.setBusy(true);
                let requestPath = URLConstants.URL.sync_erp_data_get_post;
                let response = await this.restMethodGet(requestPath);
                response.forEach(ele => [ele.date, ele.time] = that.formatter.convertDateandTime(ele.synced_date).split(" "));

                this.getView().setModel(new JSONModel(response), "Sync");
                this._pageId.setBusy(false);
            } catch (error) {
                this._pageId.setBusy(false);
                this.errorHandling(error);
            }
        },
        onPressSyncData: async function (oEvent) {
            var that = this;
            try {
                let requestData = oEvent?.getSource()?.getBindingContext("Sync")?.getObject();
                let selectedIndex = Number(oEvent.getSource().sId.split("-").pop());
                let syncMdl = this.getView().getModel("Sync");
                if (requestData) {
                    this.errorMessagePopoverClose()//Error popover close
                    oEvent.getSource().setBusy(true);
                    var requestPath = URLConstants.URL.sync_erp_data_get_post;
                    requestData.synced_date = new Date().toISOString();
                    let response = await this.restMethodPost(requestPath, requestData);
                    MessageToast.show(response.object_name + " " + this.getResourceBundle("sync_synceddMsg"));
                    syncMdl.getData()[selectedIndex] = response;
                    syncMdl.refresh();
                    oEvent.getSource().setBusy(false);
                }
            } catch (error) {
                oEvent.getSource().setBusy(false);
                this.errorHandling(error);
            }
        },
    });
});