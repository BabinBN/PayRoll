sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (ControllerExtension, MessageToast, Fragment) {
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
		onQuestionChange: function (oEvent) {
			const sQuestion = oEvent.getParameter("value").trim();

			this._pDialog.then(function (oDialog) {

				oDialog.getBeginButton().setEnabled(sQuestion.length > 0);

			});
		},
		onSendQuestion: async function () {

			const oDialog = await this._pDialog;

			const oView = this.base.getView();

			const oQuestionInput = oView.byId("questionInput");

			const sQuestion = oQuestionInput.getValue().trim();

			if (!sQuestion) {
				MessageToast.show("Please enter a question");
				return;
			}

			try {

				oView.byId("answerText")
					.setText("Thinking...");

				const oModel = this.base.getView().getModel("aiModel");

				const oAction = oModel.bindContext("/askAI(...)");

				oAction.setParameter(
					"question",
					sQuestion
				);

				await oAction.execute();

				const oResult = oAction.getBoundContext();

				const oResponse = await oResult.requestObject();

				console.log("CAP response:", oResponse);

				oView.byId("answerText")
					.setText(
						oResponse.value || "No response received."
					);

			} catch (error) {

				console.error("AI Error:", error);

				oView.byId("answerText")
					.setText(
						"Sorry, something went wrong."
					);
			}
		}
	});
});
