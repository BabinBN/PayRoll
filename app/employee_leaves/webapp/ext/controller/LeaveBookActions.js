sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/m/Dialog",
    "sap/m/MessageToast"
], function (XMLView, Dialog, MessageToast) {
    "use strict";

    return {

        onBookLeave: function (oContext, aSelectedContexts) {

            XMLView.create({
                id: "LeaveBookingView",
                viewName: "employeeleaves.ext.view.LeaveBooking"
            }).then(function (oView) {

                var oDialog = new Dialog({
                    contentWidth: "90%",
                    contentHeight: "80%",
                    resizable: true,
                    draggable: true,
                    content: [oView],
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });

                if (oView.getController() && oView.getController().setDialog) {
                    oView.getController().setDialog(oDialog);
                }

                oDialog.open();

            }).catch(function (oError) {

                console.error("Failed to load LeaveBooking view:", oError);
                MessageToast.show("Failed to open Leave Booking");

            });
        }

    };
});