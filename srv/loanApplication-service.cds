using { LoanApplication As Loan } from '../db/LoanApplication/LoanApplication';

@path : '/service/LoanApplication'
service LoanApplicationsrv
{
    @cds.redirection.target
    @odata.draft.enabled
    entity LoanApplications as
        projection on Loan.loan_application;
}

annotate LoanApplicationsrv with @requires :
[
    'authenticated-user'
];
