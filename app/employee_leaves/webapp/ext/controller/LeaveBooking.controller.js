sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend(
        "employeeleaves.ext.controller.LeaveBooking",
        {

            onInit: function () {
                // Initialize booking model here
            },

            onPressAddRowHeader: function () {
                MessageToast.show("Add Employee");
            },

            onPressRemoveRowHeader: function () {
                MessageToast.show("Delete Employee");
            },

            onPressAddRowItem: function () {
                MessageToast.show("Add booking row");
            },

            onPressRemoveRowItem: function () {
                MessageToast.show("Remove booking row");
            },

            onSaveAndClose: function () {
                MessageToast.show("Saving...");
            },

            onClose: function () {
                window.history.back();
            },

            onNavBack: function () {
                window.history.back();
            },

            onUpload: function () {
                MessageToast.show("Upload");
            }

        }
    );
});