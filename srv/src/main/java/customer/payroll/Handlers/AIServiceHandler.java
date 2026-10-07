package customer.payroll.Handlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.aiservice.AskAIContext;

@Component
@ServiceName("AIService")
public class AIServiceHandler implements EventHandler {

    @Autowired
    public GeminiService geminiService;
    @On(event = "askAI")
    public void AskAI(AskAIContext context) {

        String question = (String) context.get("question");

        // System.out.println("Question received: " + question);

        // String response = "You asked: " + question;
        String response = geminiService.ask(question);

        context.setResult(response);
    }

}
