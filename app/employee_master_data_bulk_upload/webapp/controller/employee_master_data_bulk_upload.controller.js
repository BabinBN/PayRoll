sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend(
        "employeemasterdatabulkupload.controller.employee_master_data_bulk_upload",
        {


            onInit: function () {

                this._file = null;
                this._aExcelData = [];
                this._pXLSXLoaded = null;

                console.log(
                    "Employee Master Data Bulk Upload initialized"
                );

                this._loadXLSXLibrary()
                    .then(function (XLSX) {

                        console.log(
                            "SheetJS successfully loaded:",
                            XLSX
                        );

                    })
                    .catch(function (oError) {

                        console.error(
                            "Excel library could not be loaded:",
                            oError
                        );

                    });
            },

            _loadXLSXLibrary: function () {

                var that = this;
                if (window.XLSX) {

                    console.log(
                        "SheetJS already available."
                    );

                    return Promise.resolve(window.XLSX);
                }
                if (this._pXLSXLoaded) {
                    return this._pXLSXLoaded;
                }

                var sAppUrl = sap.ui.require.toUrl(
                    "employeemasterdatabulkupload"
                );

                var aCandidateUrls = [
                    sAppUrl + "/thirdparty/xlsx.full.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
                ];

                console.log(
                    "SheetJS candidate URLs (in order):",
                    aCandidateUrls
                );

                this._pXLSXLoaded = this._loadFirstWorkingScript(
                    aCandidateUrls,
                    0
                );

                return this._pXLSXLoaded;
            },

            _loadFirstWorkingScript: function (
                aUrls,
                iIndex
            ) {

                var that = this;

                if (iIndex >= aUrls.length) {

                    return Promise.reject(
                        new Error(
                            "Unable to load SheetJS from any of the configured URLs."
                        )
                    );
                }

                var sUrl = aUrls[iIndex];

                return this._loadScript(sUrl)
                    .catch(function (oError) {

                        console.warn(
                            "SheetJS load attempt failed for:",
                            sUrl,
                            oError
                        );

                        // try next candidate
                        return that._loadFirstWorkingScript(
                            aUrls,
                            iIndex + 1
                        );
                    });
            },


            _loadScript: function (sUrl) {

                console.log(
                    "Attempting to load SheetJS from:",
                    sUrl
                );

                return new Promise(
                    function (resolve, reject) {

                        if (window.XLSX) {
                            resolve(window.XLSX);
                            return;
                        }

                        var oScript =
                            document.createElement("script");

                        oScript.type =
                            "text/javascript";

                        oScript.src =
                            sUrl;

                        oScript.onload =
                            function () {

                                if (window.XLSX) {

                                    console.log(
                                        "SheetJS loaded successfully from:",
                                        sUrl
                                    );

                                    resolve(
                                        window.XLSX
                                    );

                                } else {

                                    reject(
                                        new Error(
                                            "Script loaded but window.XLSX is undefined: " +
                                            sUrl
                                        )
                                    );
                                }
                            };

                        oScript.onerror =
                            function () {

                                reject(
                                    new Error(
                                        "Unable to load SheetJS file: " +
                                        sUrl
                                    )
                                );
                            };

                        document.head.appendChild(
                            oScript
                        );
                    }
                );
            },

            handleValueChange: function (oEvent) {

                var oFileUploader =
                    oEvent.getSource();

                var aFiles =
                    oFileUploader.getFocusDomRef()
                        ? oFileUploader
                            .getFocusDomRef()
                            .files
                        : null;

                if (!aFiles || aFiles.length === 0) {

                    this._file = null;

                    MessageToast.show(
                        "Please select an Excel file."
                    );

                    return;
                }

                this._file = aFiles[0];

                console.log(
                    "Selected file:",
                    this._file.name
                );

                console.log(
                    "File type:",
                    this._file.type
                );

                console.log(
                    "File size:",
                    this._file.size
                );

                MessageToast.show(
                    "File selected: " +
                    this._file.name
                );
            },

            handleUploadPress: function () {

                var that = this;

                if (!this._file) {

                    MessageBox.warning(
                        "Please select an Excel file first."
                    );

                    return;
                }

                console.log(
                    "Starting Excel upload..."
                );


                this._loadXLSXLibrary()

                    .then(function (XLSX) {

                        console.log(
                            "SheetJS ready:",
                            XLSX
                        );

                        that._readExcelFile(
                            XLSX
                        );

                    })

                    .catch(function (oError) {

                        console.error(
                            "Excel library could not be loaded:",
                            oError
                        );

                        MessageBox.error(
                            "Excel library could not be loaded.\n\n" +
                            oError.message
                        );
                    });
            },


            _readExcelFile: function (XLSX) {

                var that = this;

                var oReader =
                    new FileReader();

                oReader.onload =
                    function (oEvent) {

                        try {

                            var aData =
                                oEvent.target.result;

                            console.log(
                                "Excel file read successfully."
                            );

                            /*
                             * Read workbook
                             */
                            var oWorkbook =
                                XLSX.read(
                                    aData,
                                    {
                                        type: "array",
                                        cellDates: true
                                    }
                                );

                            console.log(
                                "Workbook:",
                                oWorkbook
                            );

                            if (
                                !oWorkbook.SheetNames ||
                                oWorkbook.SheetNames.length === 0
                            ) {

                                MessageBox.error(
                                    "Excel file does not contain any sheet."
                                );

                                return;
                            }

                            /*
                             * First sheet
                             */
                            var sSheetName =
                                oWorkbook.SheetNames[0];

                            console.log(
                                "Reading sheet:",
                                sSheetName
                            );

                            var oWorksheet =
                                oWorkbook.Sheets[
                                sSheetName
                                ];

                            /*
                             * Convert Excel rows
                             */
                            that._aExcelData =
                                XLSX.utils.sheet_to_json(
                                    oWorksheet,
                                    {
                                        defval: ""
                                    }
                                );

                            console.log(
                                "Excel rows:",
                                that._aExcelData
                            );

                            console.log(
                                "Excel row count:",
                                that._aExcelData.length
                            );

                            if (
                                that._aExcelData.length === 0
                            ) {

                                MessageBox.warning(
                                    "Excel file does not contain any data."
                                );

                                return;
                            }

                            MessageToast.show(
                                that._aExcelData.length +
                                " employee records loaded."
                            );

                            /*
                             * Start validation and database upload
                             */
                            that._validateAndUploadData();

                        } catch (oError) {

                            console.error(
                                "Excel processing error:",
                                oError
                            );

                            MessageBox.error(
                                "Unable to read the Excel file.\n\n" +
                                oError.message
                            );
                        }
                    };

                oReader.onerror =
                    function (oError) {

                        console.error(
                            "FileReader error:",
                            oError
                        );

                        MessageBox.error(
                            "Unable to read the selected file."
                        );
                    };

                /*
                 * XLSX.read with type=array
                 */
                oReader.readAsArrayBuffer(
                    this._file
                );
            },


            /* =========================================================== */
            /* VALIDATE AND UPLOAD                                        */
            /* =========================================================== */

            _validateAndUploadData: function () {

                var that = this;

                var aRows =
                    this._aExcelData;

                if (
                    !aRows ||
                    aRows.length === 0
                ) {

                    MessageBox.warning(
                        "No employee data found."
                    );

                    return;
                }

                console.log(
                    "Validating employee records..."
                );

                var aPayloads = [];
                var aErrors = [];

                aRows.forEach(
                    function (oRow, iIndex) {

                        var iRowNumber =
                            iIndex + 2;

                        try {

                            var oPayload =
                                that._createEmployeePayload(
                                    oRow,
                                    iRowNumber
                                );

                            aPayloads.push(
                                oPayload
                            );

                        } catch (oError) {

                            aErrors.push(
                                {
                                    row: iRowNumber,
                                    message:
                                        oError.message
                                }
                            );
                        }
                    }
                );

                console.log(
                    "Valid payloads:",
                    aPayloads
                );

                console.log(
                    "Validation errors:",
                    aErrors
                );

                if (aErrors.length > 0) {

                    console.error(
                        "Excel validation errors:",
                        aErrors
                    );

                    var sMessage =
                        aErrors
                            .map(function (oError) {

                                return (
                                    "Row " +
                                    oError.row +
                                    ": " +
                                    oError.message
                                );

                            })
                            .join("\n");

                    MessageBox.error(
                        "Validation failed:\n\n" +
                        sMessage
                    );

                    return;
                }

                this._createEmployees(
                    aPayloads
                );
            },

            _createEmployeePayload: function (oRow, iRowNumber) {

                var sEmpCode =
                    this._toString(oRow["Employee Code"]);

                var iCompanyId =
                    this._toInteger(oRow["Company ID"]);

                var sExternalEmpId =
                    this._toString(oRow["External Employee ID"]);

                var sFirstName =
                    this._toString(oRow["First Name"]);

                var sMiddleName =
                    this._toString(oRow["Middle Name"]);

                var sLastName =
                    this._toString(oRow["Last Name"]);

                var sGender =
                    this._toString(oRow["Gender"]);

                var sMaritalStatus =
                    this._toString(oRow["Marital Status"]);

                var dDob =
                    this._toDate(oRow["DOB"]);

                var sEmail =
                    this._toString(oRow["Email"]);

                var sMobile =
                    this._toString(oRow["Mobile"]);

                var sNationality =
                    this._toString(oRow["Nationality"]);

                var sTimeProcess =
                    this._toString(oRow["Time Process"]);

                var iPayrollPeriodId =
                    this._toInteger(oRow["Payroll Period ID"]);

                var dJoinedDate =
                    this._toDate(oRow["Joined Date"]);

                var iEmploymentStatusId =
                    this._toInteger(oRow["Employment Status ID"]);

                var bFinalPaymentStatus =
                    this._toBoolean(oRow["Final Payment Status"]);

                var iStatusId =
                    this._getStatusId(
                        oRow["Status"]
                    );

                if (!sEmpCode) {
                    throw new Error(
                        "Employee Code is mandatory."
                    );
                }

                if (!sFirstName) {
                    throw new Error(
                        "First Name is mandatory."
                    );
                }

                if (!sEmail) {
                    throw new Error(
                        "Email is mandatory."
                    );

                }

                var oPayload = {
                    emp_code: sEmpCode,
                    company_id: iCompanyId,
                    external_emp_id: sExternalEmpId,
                    first_name: sFirstName,
                    middle_name: sMiddleName,
                    last_name: sLastName,
                    gender: sGender,
                    marital_status: sMaritalStatus,
                    dob: dDob,
                    email: sEmail,
                    mobile: sMobile,
                    nationality: sNationality,
                    time_process: sTimeProcess,
                    payroll_period_id: iPayrollPeriodId,
                    joined_date: dJoinedDate,
                    employment_status_id: iEmploymentStatusId,
                    final_payment_status: bFinalPaymentStatus,
                    status_ID: iStatusId
                };

                console.log(
                    "Row " + iRowNumber + " payload:",
                    oPayload
                );

                return oPayload;
            },




            /* =========================================================== */
            /* STATUS                                                       */
            /* =========================================================== */

            _getStatusId: function (vStatus) {

                /*
                 * Your database Status entity uses:
                 *
                 * ID
                 * Name_status
                 *
                 * If Excel contains "Active", we use ID 1.
                 */

                if (
                    vStatus === null ||
                    vStatus === undefined ||
                    vStatus === ""
                ) {

                    return 1;
                }

                if (
                    typeof vStatus === "number"
                ) {

                    return parseInt(
                        vStatus,
                        10
                    );
                }

                var sStatus =
                    String(vStatus)
                        .trim()
                        .toLowerCase();

                if (
                    sStatus === "active"
                ) {

                    return 1;
                }

                if (
                    sStatus === "inactive"
                ) {

                    return 2;
                }

                /*
                 * If Excel contains a numeric
                 * status ID as text.
                 */
                var iStatus =
                    parseInt(
                        sStatus,
                        10
                    );

                if (
                    !isNaN(iStatus)
                ) {

                    return iStatus;
                }

                /*
                 * Default
                 */
                return 1;
            },


            /* =========================================================== */
            /* CREATE EMPLOYEES                                             */
            /* =========================================================== */


            _createEmployees: function (aPayloads) {

                var oModel = this.getView().getModel();

                if (!oModel) {
                    MessageBox.error("OData model is not available.");
                    return;
                }

                if (!aPayloads || aPayloads.length === 0) {
                    MessageBox.warning("No employee records to upload.");
                    return;
                }

                console.log(
                    "Calling bulkCreateEmployees action with:",
                    aPayloads
                );

                // Create CAP OData V4 action binding
                var oAction = oModel.bindContext(
                    "/bulkCreateEmployees(...)"
                );

                // Set action parameter
                oAction.setParameter(
                    "payloads",
                    aPayloads
                );

                // Execute CAP action
                oAction.execute()
                    .then(function () {

                        console.log(
                            "bulkCreateEmployees action executed successfully."
                        );

                        MessageToast.show(
                            aPayloads.length +
                            " employee records uploaded successfully."
                        );

                        this.byId("upload").clear();

                        this._file = null;

                        this._aExcelData = [];

                        oModel.refresh();

                    })
                    .catch(function (oError) {

                        console.error(
                            "bulkCreateEmployees action failed:",
                            oError
                        );

                        MessageBox.error(
                            "Employee upload failed.\n\n" +
                            (oError.message || "Unknown error")
                        );
                    });
            },

            /* =========================================================== */
            /* STRING CONVERSION                                            */
            /* =========================================================== */

            _toString: function (vValue) {

                if (
                    vValue === null ||
                    vValue === undefined
                ) {

                    return "";
                }

                return String(vValue).trim();
            },


            /* =========================================================== */
            /* INTEGER CONVERSION                                           */
            /* =========================================================== */

            _toInteger: function (vValue) {

                if (
                    vValue === null ||
                    vValue === undefined ||
                    vValue === ""
                ) {

                    return null;
                }

                if (
                    typeof vValue === "number"
                ) {

                    if (isNaN(vValue)) {
                        return null;
                    }

                    return Math.trunc(
                        vValue
                    );
                }

                var sValue =
                    String(vValue)
                        .trim();

                if (!sValue) {
                    return null;
                }

                var iValue =
                    parseInt(
                        sValue,
                        10
                    );

                return isNaN(iValue)
                    ? null
                    : iValue;
            },


            /* =========================================================== */
            /* BOOLEAN CONVERSION                                           */
            /* =========================================================== */

            _toBoolean: function (vValue) {

                if (
                    vValue === null ||
                    vValue === undefined ||
                    vValue === ""
                ) {

                    return false;
                }

                if (
                    typeof vValue === "boolean"
                ) {

                    return vValue;
                }

                if (
                    typeof vValue === "number"
                ) {

                    return vValue !== 0;
                }

                var sValue =
                    String(vValue)
                        .trim()
                        .toLowerCase();

                if (
                    sValue === "true" ||
                    sValue === "yes" ||
                    sValue === "y" ||
                    sValue === "1"
                ) {

                    return true;
                }

                return false;
            },


            /* =========================================================== */
            /* DATE CONVERSION                                              */
            /* =========================================================== */

            _toDate: function (vValue) {

                if (
                    vValue === null ||
                    vValue === undefined ||
                    vValue === ""
                ) {

                    return null;
                }

                /*
                 * Excel date object
                 */
                if (
                    vValue instanceof Date
                ) {

                    if (
                        isNaN(
                            vValue.getTime()
                        )
                    ) {

                        return null;
                    }

                    return this._formatDate(
                        vValue
                    );
                }

                /*
                 * Excel serial number
                 */
                if (
                    typeof vValue === "number"
                ) {

                    var oExcelDate =
                        new Date(
                            Date.UTC(
                                1899,
                                11,
                                30
                            )
                        );

                    oExcelDate.setUTCDate(
                        oExcelDate.getUTCDate() +
                        vValue
                    );

                    return this._formatDate(
                        oExcelDate
                    );
                }

                var sValue =
                    String(vValue)
                        .trim();

                /*
                 * yyyy-MM-dd
                 */
                if (
                    /^\d{4}-\d{2}-\d{2}$/.test(
                        sValue
                    )
                ) {

                    return sValue;
                }

                /*
                 * dd/MM/yyyy
                 */
                if (
                    /^\d{2}\/\d{2}\/\d{4}$/.test(
                        sValue
                    )
                ) {

                    var aParts =
                        sValue.split("/");

                    return (
                        aParts[2] +
                        "-" +
                        aParts[1] +
                        "-" +
                        aParts[0]
                    );
                }

                /*
                 * dd.MM.yyyy
                 */
                if (
                    /^\d{2}\.\d{2}\.\d{4}$/.test(
                        sValue
                    )
                ) {

                    var aDotParts =
                        sValue.split(".");

                    return (
                        aDotParts[2] +
                        "-" +
                        aDotParts[1] +
                        "-" +
                        aDotParts[0]
                    );
                }

                /*
                 * Try JavaScript Date
                 */
                var oDate =
                    new Date(sValue);

                if (
                    !isNaN(
                        oDate.getTime()
                    )
                ) {

                    return this._formatDate(
                        oDate
                    );
                }

                return null;
            },


            /* =========================================================== */
            /* FORMAT DATE                                                  */
            /* =========================================================== */

            _formatDate: function (
                oDate
            ) {

                var iYear =
                    oDate.getUTCFullYear();

                var iMonth =
                    oDate.getUTCMonth() + 1;

                var iDay =
                    oDate.getUTCDate();

                return (
                    iYear +
                    "-" +
                    String(iMonth)
                        .padStart(2, "0") +
                    "-" +
                    String(iDay)
                        .padStart(2, "0")
                );
            },


            /* =========================================================== */
            /* ERROR MESSAGE                                                */
            /* =========================================================== */

            _extractErrorMessage: function (
                oError
            ) {

                if (!oError) {

                    return "Unknown error.";
                }

                if (
                    oError.message
                ) {

                    return oError.message;
                }

                if (
                    oError.responseText
                ) {

                    try {

                        var oResponse =
                            JSON.parse(
                                oError.responseText
                            );

                        if (
                            oResponse.error &&
                            oResponse.error.message
                        ) {

                            return oResponse
                                .error
                                .message;
                        }

                    } catch (e) {

                        return oError.responseText;
                    }
                }

                return String(
                    oError
                );
            },


            /* =========================================================== */
            /* MESSAGE POPOVER                                             */
            /* =========================================================== */

            handleMessagePopoverPress: function (
                oEvent
            ) {

                MessageToast.show(
                    "Please check the upload errors."
                );
            }

        }
    );
});