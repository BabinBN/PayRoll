namespace Enumerators;
// using {
//     managed,
//     cuid
// } from '@sap/cds/common';


@cds.persistence.name:'ENUMERATORS_EMPLOYEEMENT_TYPE'
entity employeement_Type {
    key ID                     : Integer;
    employeement_Type_Name     : String(20);
}
