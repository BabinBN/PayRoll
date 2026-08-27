sap.ui.define(
  [
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
  ],
  function (ControllerExtension, MessageToast, Fragment) {
    "use strict";

    return ControllerExtension.extend(
      "employee.ext.controller.ListReportExt",
      {
        _pDialog: null,
        _file: null,

        override: {
          onInit: function () {
            var oView = this.base.getView();

            oView.attachEventOnce(
              "modelContextChange",
              function () {
                setTimeout(
                  function () {
                    var oButton = null;

                    oView.findAggregatedObjects(true, function (oControl) {
                      if (
                        oControl.isA &&
                        oControl.isA("sap.m.Button") &&
                        oControl.getText &&
                        oControl.getText() === "Upload Excel"
                      ) {
                        oButton = oControl;
                        return true;
                      }
                      return false;
                    });

                    if (oButton) {
                      oButton.attachPress(this.onUploadExcel, this);
                    } else {
                      console.warn(
                        "[ListReportExt] Upload Excel button still not found."
                      );
                    }
                  }.bind(this),
                  500
                );
              }.bind(this)
            );
          },
        },

        onUploadExcel: function () {
          if (!this._pDialog) {
            this._pDialog = Fragment.load({
              id: this.base.getView().getId(),
              name: "employee.ext.fragment.UploadExcel",
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

        onCloseUploadDialog: function () {
          if (this._pDialog) {
            this._pDialog.then(function (oDialog) {
              oDialog.close();
            });
          }
        },

        onFileChange: function (oEvent) {
          var aFiles = oEvent.getParameter("files");
          var sViewId = this.base.getView().getId();

          if (!aFiles || aFiles.length === 0) {
            this._file = null;

            this._pDialog.then(function (oDialog) {
              var oUploadButton = oDialog.getBeginButton();
              if (oUploadButton) {
                oUploadButton.setEnabled(false);
              }

              var oStatus = sap.ui.core.Fragment.byId(sViewId, "uploadStatusText");
              if (oStatus) {
                oStatus.setText("No file selected");
                oStatus.setIcon("sap-icon://document");
                oStatus.setState("None");
              }
            });

            MessageToast.show("Please select an Excel file.");
            return;
          }

          this._file = aFiles[0];

          console.log(
            "[onFileChange] File selected:",
            this._file.name,
            this._file.size
          );

          this._pDialog.then(function (oDialog) {
            var oUploadButton = oDialog.getBeginButton();
            if (oUploadButton) {
              oUploadButton.setEnabled(true);
            }

            var oStatus = sap.ui.core.Fragment.byId(sViewId, "uploadStatusText");
            if (oStatus) {
              var sSizeKb = (this._file.size / 1024).toFixed(1) + " KB";
              oStatus.setText(this._file.name + " (" + sSizeKb + ")");
              oStatus.setIcon("sap-icon://accept");
              oStatus.setState("Success");
            }
          }.bind(this));

          MessageToast.show(
            "File '" + this._file.name + "' is ready for upload."
          );
        },

        onUploadPress: function () {
          if (!this._file) {
            MessageToast.show("Please select an Excel file first.");
            return;
          }

          var oReader = new FileReader();

          oReader.onload = function (e) {
            try {
              var data = new Uint8Array(e.target.result);

              var workbook = XLSX.read(data, {
                type: "array",
                cellDates: true,
              });

              console.log("[onUploadPress] Sheets:", workbook.SheetNames);

              var sheetName = workbook.SheetNames[0];

              if (!sheetName) {
                throw new Error("No sheets found in workbook.");
              }

              var oSheet = workbook.Sheets[sheetName];

              var aExcelData = XLSX.utils.sheet_to_json(oSheet, {
                defval: "",
              });

              console.log(
                "[onUploadPress] Parsed rows:",
                aExcelData.length,
                aExcelData
              );

              if (aExcelData.length === 0) {
                MessageToast.show("No data found in the Excel file.");
                return;
              }

              this._callOdataService(aExcelData);
            } catch (error) {
              console.error("[onUploadPress] Excel parse error:", error);

              MessageToast.show(
                "Error reading Excel file: " + error.message
              );
            }
          }.bind(this);

          oReader.onerror = function (error) {
            console.error("[onUploadPress] FileReader error:", error);
            MessageToast.show("Could not read the selected file.");
          };

          oReader.readAsArrayBuffer(this._file);
        },

        _callOdataService: function (aExcelData) {
          try {
            var oModel = this.base.getView().getModel();

            if (!oModel) {
              throw new Error("OData model not found.");
            }

            var oListBinding = oModel.bindList("/Employees");

            if (!oListBinding) {
              throw new Error("Could not create ListBinding for /Employees.");
            }

            aExcelData.forEach(function (row) {
              var oPayload = {
                emp_code: row["Employee Code"] || "",
                company_id: Number(row["Company ID"]) || 0,
                external_emp_id: row["External Employee ID"] || "",
                first_name: row["First Name"] || "",
                middle_name: row["Middle Name"] || "",
                last_name: row["Last Name"] || "",
                gender: row["Gender"] || "",
                marital_status: row["Marital Status"] || "",
                dob: row["DOB"] || null,
                email: row["Email"] || "",
                mobile: row["Mobile"] || "",
                nationality: row["Nationality"] || "",
                time_process: row["Time Process"] || "",
                payroll_period_id: Number(row["Payroll Period ID"]) || 0,
                joined_date: row["Joined Date"] || null,
                employment_status_id: Number(row["Employment Status ID"]) || 0,
                final_payment_status:
                  row["Final Payment Status"] === true ||
                  row["Final Payment Status"] === "TRUE" ||
                  row["Final Payment Status"] === "true",
                status: row["Status"] || "Active",
              };

              console.log("[_callOdataService] Creating:", oPayload);

              oListBinding.create(oPayload);
            });

            MessageToast.show(
              "Uploading " + aExcelData.length + " employees..."
            );

            oModel
              .submitBatch("$auto")
              .then(
                function () {
                  MessageToast.show("Employees uploaded successfully.");
                  this.base.getExtensionAPI().refresh();
                  this._file = null;
                  this.onCloseUploadDialog();
                }.bind(this)
              )
              .catch(function (oError) {
                console.error("[_callOdataService] Upload error:", oError);

                MessageToast.show(
                  "Error during upload: " +
                  (oError.message || "Unknown error")
                );
              });
          } catch (error) {
            console.error("[_callOdataService] Processing error:", error);
            MessageToast.show("Error processing data: " + error.message);
          }
        },
      }
    );
  }
);