package com.mycompany;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import java.time.Duration;

public class ChatSimulation extends Simulation {

    // 1. HTTP 기본 설정
    private HttpProtocolBuilder httpProtocol = http
            .baseUrl("http://localhost:8080")
            .acceptHeader("text/event-stream")
            .userAgentHeader("Gatling Java Tester");

    // 2. 시나리오 데이터 (Feeder)
    private FeederBuilder<String> queryFeeder = csv("queries.csv").random();

    // 3. 시나리오 정의
    private ScenarioBuilder sseScenario = scenario("SSE Chat Stream Load Test")
            .feed(queryFeeder) // Feeder에서 query 데이터를 하나씩 가져옴
            .exec(
                    sse("ConnectChatStream").post("/api/chat/stream")
                            .headers(java.util.Map.of("Content-Type", "application/json"))
                            .body(ElFileBody("bodies/chatRequest.json")).asJson()
                            .await(Duration.ofSeconds(60))
                            .on(
                                    // 스트림 응답 중 카드 정보 JSON 배열의 끝 부분( ']}' )이 포함된 메시지가 오면 성공
                                    sse.checkMessage("Check for final card array")
                                            .matching(substring("]}"))
                            )
            )
            .pause(Duration.ofSeconds(1), Duration.ofSeconds(3));

    // 4. 부하 주입 설정 (Java에서는 생성자 안에서 setUp을 호출합니다)
    public ChatSimulation() {
        setUp(
                sseScenario.injectOpen(
                        rampUsers(20).during(Duration.ofSeconds(60)) // 60초 동안 사용자를 50명까지 점진적으로 증가
                )
        ).protocols(httpProtocol);
    }
}