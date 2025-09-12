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

@Configuration
public class WebClientConfig {

    @Value("${ai.server.url}")
    private String aiServerUrl;

    @Bean
    public WebClient aiWebClient() {

        // FIX: 유휴(idle) 상태의 커넥션을 조기에 닫지 않도록 ConnectionProvider를 직접 설정합니다.
        // 이것이 Python 서버의 응답을 기다리는 동안 연결이 끊어지는 현상을 막는 핵심입니다.
        ConnectionProvider provider = ConnectionProvider.builder("custom-provider")
                .maxConnections(50)
                .maxIdleTime(Duration.ofMinutes(10)) // 유휴 상태 연결을 10분간 유지
                .maxLifeTime(Duration.ofMinutes(10)) // 최대 연결 수명
                .pendingAcquireTimeout(Duration.ofSeconds(60))
                .build();

        HttpClient httpClient = HttpClient.create(provider)
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .responseTimeout(Duration.ofMinutes(10)) // 응답 전체 대기 시간 10분
                // DEBUG: Netty의 모든 통신 내용을 상세하게 로그로 출력합니다.
                // 문제가 해결되면 이 줄은 주석 처리하거나 삭제해도 됩니다.
                .wiretap(true);

        return WebClient.builder()
                .baseUrl(aiServerUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}

