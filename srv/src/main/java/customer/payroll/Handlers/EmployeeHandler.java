package customer.payroll.Handlers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Insert;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import cds.gen.employee.BulkCreateEmployeesContext;
import cds.gen.employee.EmployeeInput;
import cds.gen.employee.Employees;
import cds.gen.employee.Employees_;

@Component
@ServiceName("Employee")
public class EmployeeHandler implements EventHandler {

    @Autowired
    private PersistenceService db;

    @On(event = "bulkCreateEmployees")
    public void onBulkCreateEmployees(BulkCreateEmployeesContext context) {

        // Payload type is Collection<EmployeeInput>
        Collection<EmployeeInput> payloads = context.getPayloads();

        if (payloads == null || payloads.isEmpty()) {

            throw new ServiceException(
                    ErrorStatuses.BAD_REQUEST,
                    "No employee records provided.");
        }

        List<Employees> toInsert = new ArrayList<>();

        for (EmployeeInput row : payloads) {

            validateRow(row);

            Employees emp = Employees.create();

            emp.setEmpCode(row.getEmpCode());

            emp.setCompanyId(row.getCompanyId());

            emp.setExternalEmpId(row.getExternalEmpId());

            emp.setFirstName(row.getFirstName());

            emp.setMiddleName(row.getMiddleName());

            emp.setLastName(row.getLastName());

            emp.setGender(row.getGender());

            emp.setMaritalStatus(row.getMaritalStatus());

            emp.setDob(row.getDob());

            emp.setEmail(row.getEmail());

            emp.setMobile(row.getMobile());

            emp.setNationality(row.getNationality());

            emp.setTimeProcess(row.getTimeProcess());

            emp.setPayrollPeriodId(row.getPayrollPeriodId());

            emp.setJoinedDate(row.getJoinedDate());

            emp.setEmploymentStatusId(row.getEmploymentStatusId());

            emp.setFinalPaymentStatus(row.getFinalPaymentStatus());

            if (row.getStatusId() != null) {

                emp.setStatusId(
                        row.getStatusId());

            } else {

                emp.setStatusId(1);
            }

            toInsert.add(emp);
        }
        db.run(Insert.into(Employees_.class).entries(toInsert));

        /*
         * Bulk insert into HANA
         */
        // List<Employees> created =
        // db.run(Insert.into(Employees_.class).entries(toInsert)).listOf(Employees.class);

        // /*
        // * Return result
        // */
        // context.setResult(created);

        context.setCompleted();
    }

    private void validateRow(EmployeeInput row) {

        String empCode = row.getEmpCode();

        String firstName = row.getFirstName();

        String email = row.getEmail();

        if (empCode == null ||
                empCode.isBlank()) {

            throw new ServiceException(
                    ErrorStatuses.BAD_REQUEST,
                    "Employee Code is mandatory.");
        }

        if (firstName == null ||
                firstName.isBlank()) {

            throw new ServiceException(
                    ErrorStatuses.BAD_REQUEST,
                    "First Name is mandatory.");
        }

        if (email == null ||
                email.isBlank()) {

            throw new ServiceException(
                    ErrorStatuses.BAD_REQUEST,
                    "Email is mandatory.");
        }
    }

    @After(event = CqnService.EVENT_READ, entity = Employees_.CDS_NAME)
    public void afterReadEmployees(List<Employees> employees) {

        for (Employees employee : employees) {

            Integer statusId = employee.getStatusId();

            if (statusId == null) {
                employee.setStatusCriticality(0);
            } else if (statusId == 1) {
                employee.setStatusCriticality(3); // Green
            } else if (statusId == 2) {
                employee.setStatusCriticality(1); // Red
            } else {
                employee.setStatusCriticality(0); // Neutral
            }
        }
    }
}