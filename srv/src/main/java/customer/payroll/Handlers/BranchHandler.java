package customer.payroll.Handlers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import cds.gen.bh.Branch;
import cds.gen.bh.Branch_;
import cds.gen.branchservice.Branchs_;

@Component
@ServiceName("BranchService")
public class BranchHandler implements EventHandler {

    @Autowired
    private PersistenceService db;

    @On(event = CqnService.EVENT_CREATE, entity = Branchs_.CDS_NAME)
    public void onCreateBranch(CdsCreateEventContext context) {

        // System.out.println("CREATE BRANCH JAVA TRIGGERED");

        // CqnInsert insert = context.getCqn().asInsert();

        // System.out.println("CQN = " + insert);

        // Map<String, Object> payload = insert.entries().get(0);

        // System.out.println("PAYLOAD = " + payload);

        // Branch newBranch = Branch.create();

        // newBranch.setCompanyId(
        //         (Integer) payload.get(Branch.COMPANY_ID));

        // newBranch.setName(
        //         (String) payload.get(Branch.NAME));

        // newBranch.setDescription(
        //         (String) payload.get(Branch.DESCRIPTION));

        // newBranch.setLocation(
        //         (Integer) payload.get(Branch.LOCATION));

        // newBranch.setStatusId(
        //         (Integer) payload.get(Branch.STATUS_ID));

        // // INSERT
        // Result result = db.run(
        //         Insert.into(Branch_.class)
        //                 .entry(newBranch)
        // );

        // System.out.println("Branch inserted");
        // System.out.println("INSERT RESULT = " + result);

        // // Give CAP the result of the CREATE operation
        // context.setResult(result);
    }
}

