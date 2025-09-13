package com.seminar.wooricard.server.chat.config;

import io.netty.channel.ChannelOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;

/**
 * WebFlux(Netty) 기반의 비동기 HTTP 클라이언트 WebClient 설정 클래스입니다.
 * RestTemplateConfig와 동일한 기준으로 성능 평가를 위해 설정을 통일합니다.
 */
@Configuration
public class WebClientConfig {

    @Value("${ai.server.url}")
    private String aiServerUrl;

    @Bean
    public WebClient aiWebClient() {

        ConnectionProvider provider = ConnectionProvider.builder("ai-server-provider")
                // --- 성능 테스트를 위한 커넥션 풀 설정 ---
                // [1] 최대 동시 연결 수: RestTemplate의 maxTotal과 동일하게 100으로 설정
                .maxConnections(100)
                // [2] 유휴 상태 커넥션 유지 시간: 5분간 사용 없는 커넥션은 풀에서 제거
                .maxIdleTime(Duration.ofMinutes(5))
                // [3] 커넥션 요청 대기 시간: 풀이 가득 찼을 때, 커넥션을 얻기 위해 최대 60초 대기
                .pendingAcquireTimeout(Duration.ofSeconds(60))
                .build();
        // --- 성능 테스트를 위한 타임아웃 설정 ---
        HttpClient httpClient = HttpClient.create(provider)
                // [4] 연결 타임아웃: TCP 연결을 맺기까지 최대 5초 대기
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                // [5] 응답 타임아웃: AI 서버의 응답을 기다리는 최대 시간 (10분)
                .responseTimeout(Duration.ofMinutes(10))
                // [디버깅용] Netty의 모든 통신 내용을 상세하게 로그로 출력합
                .wiretap(false);

        return WebClient.builder()
                .baseUrl(aiServerUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}

