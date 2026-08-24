sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        onBookLeave: function (oBindingContext, aSelectedContexts) {
            console.log("Book Leave button clicked successfully!");

            var oRouter = null;

            if (this.routing && typeof this.routing.navigateToRoute === "function") {
                oRouter = this.routing;
            } else if (this.base && this.base.getExtensionAPI) {
                oRouter = this.base.getExtensionAPI().routing;
            } else if (this.getExtensionAPI) {
                oRouter = this.getExtensionAPI().routing;
            }

            if (oRouter) {
                console.log("Routing engine located. Navigating...");
                oRouter.navigateToRoute("LeaveBooking", {});
            } else {
                console.error("Critical: Could not resolve Fiori Elements routing structure.", this);
                MessageToast.show("Navigation failed: Routing engine not found.");
            }
        }
    };
});
