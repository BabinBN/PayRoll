package customer.payroll.Handlers;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

@Component
@ServiceName("Employee")
public class EmployeeHandler implements EventHandler {
    @SuppressWarnings("unused")
    @Before(event = CqnService.EVENT_CREATE, entity = "Employee.Employees")
    public void onCreateEmployee(CdsCreateEventContext context) {

        Map<String, Object> data = context.getCqn().entries().get(0);

        String empCode = (String) data.get("emp_code");
        Integer companyId = data.get("company_id") != null
                ? ((Number) data.get("company_id")).intValue()
                : null;

        String externalEmpId = (String) data.get("external_emp_id");
        String firstName = (String) data.get("first_name");
        String middleName = (String) data.get("middle_name");
        String lastName = (String) data.get("last_name");
        String gender = (String) data.get("gender");
        String maritalStatus = (String) data.get("marital_status");
        String dob = String.valueOf(data.get("dob"));
        String email = (String) data.get("email");
        String mobile = (String) data.get("mobile");
        String nationality = (String) data.get("nationality");
        String timeProcess = (String) data.get("time_process");

        Integer payrollPeriodId = data.get("payroll_period_id") != null
                ? ((Number) data.get("payroll_period_id")).intValue()
                : null;

        String joinedDate = String.valueOf(data.get("joined_date"));

        Integer employmentStatusId = data.get("employment_status_id") != null
                ? ((Number) data.get("employment_status_id")).intValue()
                : null;

        Boolean finalPaymentStatus = (Boolean) data.get("final_payment_status");

        String status = (String) data.get("status");

        if (empCode == null || empCode.isBlank()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    "Employee Code is mandatory");
        }

        if (firstName == null || firstName.isBlank()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    "First Name is mandatory");
        }

        if (email == null || email.isBlank()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    "Email is mandatory");
        }

        if (status == null || status.isBlank()) {
            data.put("status", "Active");
        }

        if (finalPaymentStatus == null) {
            data.put("final_payment_status", false);
        }
    }
}