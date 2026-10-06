sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
	 "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (ControllerExtension,MessageToast,Fragment) {
	'use strict';

	return ControllerExtension.extend('employee.ext.controller.AIHandler', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf employee.ext.controller.AIHandler
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			}
		},
		onAskAI: function () {
			if (!this._pDialog) {
				this._pDialog = Fragment.load({
					id: this.base.getView().getId(),
					name: "employee.ext.fragment.AskAIDialog",
					controller: this,
				}).then(
					function (oDialog) {
						this.base.getView().addDependent(oDialog);
						return oDialog;
					}.bind(this)
				);
			}

			this._pDialog.then(
				function (oDialog) {
					oDialog.open();
					this._file = null;

					var oUploadButton = oDialog.getBeginButton();
					if (oUploadButton) {
						oUploadButton.setEnabled(false);
					}
				}.bind(this)
			);
		},
		onCloseAI: function () {
			if (this._pDialog) {
				this._pDialog.then(function (oDialog) {
					oDialog.close();
				});
			}
		},
		onSendQuestion:function()
		{
			
		}
	});
});
