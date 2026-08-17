sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (MessageToast, Fragment) {
    "use strict";

    var _oUploadDialog;
    var _oFileUploader;
    var _aExcelData = [];
    var _pFileReadPromise = null;

    function _getFileFromEvent(oEvent) {

        var aFiles = oEvent.getParameter("files");
        if (aFiles && aFiles.length > 0) {
            return aFiles[0];
        }

        var oControl = oEvent.getSource();
        if (oControl) {
            var oDomInput = oControl.$() && oControl.$().find("input[type='file']")[0];
            if (oDomInput && oDomInput.files && oDomInput.files.length > 0) {
                return oDomInput.files[0];
            }
        }

        return null;
    }

    var oFragmentController = {

        onFileChange: function (oEvent) {

            console.log("[onFileChange] FIRED. source id:", oEvent.getSource() && oEvent.getSource().getId());

            var oFile = _getFileFromEvent(oEvent);

            console.log("[onFileChange] resolved file:", oFile);

            _aExcelData = [];

            if (!oFile) {
                MessageToast.show("Please select an Excel file");
                _pFileReadPromise = null;
                return;
            }

            console.log("[onFileChange] name/size:", oFile.name, oFile.size);

            _pFileReadPromise = new Promise(function (resolve, reject) {

                var reader = new FileReader();

                reader.onload = function (e) {

                    try {

                        var data = new Uint8Array(e.target.result);

                        var workbook = XLSX.read(data, {
                            type: "array",
                            cellDates: true
                        });

                        console.log("[onFileChange] sheets:", workbook.SheetNames);

                        var sheetName = workbook.SheetNames[0];

                        if (!sheetName) {
                            throw new Error("No sheets found in workbook");
                        }

                        var sheet = workbook.Sheets[sheetName];

                        _aExcelData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                        console.log("[onFileChange] parsed rows:", _aExcelData.length, _aExcelData);

                        MessageToast.show(_aExcelData.length + " records loaded");

                        resolve();

                    } catch (err) {

                        console.error("[onFileChange] parse error:", err);

                        MessageToast.show("Invalid Excel file");

                        _aExcelData = [];

                        reject(err);
                    }
                };

                reader.onerror = function (err) {

                    console.error("[onFileChange] FileReader error:", err);

                    MessageToast.show("Could not read the selected file");

                    _aExcelData = [];

                    reject(err);
                };

                reader.readAsArrayBuffer(oFile);
            });
        },

        onCloseUploadDialog: function () {

            if (_oUploadDialog) {
                _oUploadDialog.close();
            }
        },

        onConfirmUpload: async function () {

            console.log("[onConfirmUpload] fired. Waiting on file promise:", !!_pFileReadPromise);

            if (_pFileReadPromise) {
                try {
                    await _pFileReadPromise;
                } catch (e) {
                    return;
                }
            }

            console.log("[onConfirmUpload] _aExcelData length at confirm time:", _aExcelData.length);

            if (!_aExcelData || _aExcelData.length === 0) {
                MessageToast.show("Please select an Excel file");
                return;
            }

            try {

                var oModel = _oUploadDialog.getModel();

                for (const row of _aExcelData) {

                    var oContext = oModel.bindList("/Employees").create({
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
                        final_payment_status: row["Final Payment Status"] === true ||
                                              row["Final Payment Status"] === "TRUE" ||
                                              row["Final Payment Status"] === "true",
                        status: row["Status"] || "Active"
                    });

                    await oContext.created();
                }

                MessageToast.show("Employees uploaded successfully");

                _aExcelData = [];
                _pFileReadPromise = null;

                _oUploadDialog.close();

                oModel.refresh();

            } catch (e) {

                console.error(e);

                MessageToast.show("Upload failed: " + (e.message || "Unknown error"));
            }
        }
    };

    return {

        onUploadExcel: async function () {

            var oView = this._view;

            if (!_oUploadDialog) {

                _oUploadDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "employee.ext.fragment.UploadExcel",
                    controller: oFragmentController
                });

                oView.addDependent(_oUploadDialog);

                // Programmatic binding — bypasses XML change="" entirely,
                // so it works regardless of any fragment caching issue.
                _oFileUploader = sap.ui.core.Fragment.byId(oView.getId(), "excelUploader");

                console.log("[onUploadExcel] FileUploader control found:", _oFileUploader);

                if (_oFileUploader) {
                    _oFileUploader.attachChange(oFragmentController.onFileChange, oFragmentController);
                } else {
                    console.error("[onUploadExcel] Could not find control with id 'excelUploader' — check the fragment's FileUploader id matches.");
                }
            }

            _aExcelData = [];
            _pFileReadPromise = null;

            _oUploadDialog.open();
        }
    };
});