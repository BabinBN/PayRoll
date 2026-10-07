package customer.payroll.Handlers;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class GeminiService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${omniroute.url}")
    private String omniRouteUrl;

    @Value("${omniroute.api-key}")
    private String omniRouteApiKey;

    @Value("${omniroute.model}")
    private String omniRouteModel;

    public GeminiService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public String ask(String question) {

        try {

            if (omniRouteApiKey == null || omniRouteApiKey.isBlank()) {
                throw new RuntimeException("OmniRoute API key is missing");
            }

            String requestBody = objectMapper.writeValueAsString(
                new ChatRequest(
                    omniRouteModel,
                    new Message[] {
                        new Message("user", question)
                    },
                    false
                )
            );

            System.out.println("Calling OmniRoute: " + omniRouteUrl);
            System.out.println("Model: " + omniRouteModel);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(omniRouteUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + omniRouteApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            System.out.println("OmniRoute HTTP Status: "
                    + response.statusCode());

            System.out.println("OmniRoute Response: "
                    + response.body());

            if (response.statusCode() < 200 ||
                response.statusCode() >= 300) {

                throw new RuntimeException(
                    "OmniRoute returned HTTP "
                    + response.statusCode()
                    + ": "
                    + response.body()
                );
            }

            return extractContent(response.body());

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                "Failed to get AI response from OmniRoute",
                e
            );
        }
    }

    private String extractContent(String responseBody)
            throws Exception {

        JsonNode root = objectMapper.readTree(responseBody);

        JsonNode content = root
                .path("choices")
                .path(0)
                .path("message")
                .path("content");

        if (content.isMissingNode() || content.isNull()) {
            throw new RuntimeException(
                "AI response does not contain choices[0].message.content"
            );
        }

        return content.asText();
    }

    private record ChatRequest(
            String model,
            Message[] messages,
            boolean stream
    ) {}

    private record Message(
            String role,
            String content
    ) {}
}