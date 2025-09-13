package com.seminar.wooricard.server.chat.config;

import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.core5.http.io.SocketConfig;
import org.apache.hc.core5.util.TimeValue;
import org.apache.hc.core5.util.Timeout;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * MVC(Apache HttpClient) 기반의 동기 HTTP 클라이언트 RestTemplate 설정 클래스입니다.
 * WebClientConfig와 동일한 기준으로 성능 평가를 위해 설정을 통일합니다.
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        // --- 성능 테스트를 위한 커넥션 풀 설정 ---
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
        // [1] 최대 동시 연결 수: WebClient의 maxConnections와 동일하게 100으로 설정
        connectionManager.setMaxTotal(100);
        // [1-2] 특정 경로(호스트)당 최대 연결 수: JMeter가 단일 엔드포인트를 호출할 것을 대비해 50으로 설정
        connectionManager.setDefaultMaxPerRoute(50);
        // [2] 유휴 상태 커넥션 검증 시간: 5분 이상 미사용된 커넥션은 재연결 전 유효성 검사
        connectionManager.setValidateAfterInactivity(TimeValue.ofMinutes(5));

        // --- 성능 테스트를 위한 타임아웃 설정 ---
        RequestConfig requestConfig = RequestConfig.custom()
                // [3] 커넥션 요청 대기 시간: 풀이 가득 찼을 때, 커넥션을 얻기 위해 최대 60초 대기
                .setConnectionRequestTimeout(Timeout.ofSeconds(60))
                // [4] 연결 타임아웃: TCP 연결을 맺기까지 최대 5초 대기
                .setConnectTimeout(Timeout.ofSeconds(5))
                // [5] 응답 타임아웃: AI 서버의 응답을 기다리는 최대 시간 (10분)
                .setResponseTimeout(Timeout.ofMinutes(10))
                .build();

        CloseableHttpClient httpClient = HttpClientBuilder.create()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(requestConfig)
                .build();

        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);

        return builder
                .requestFactory(() -> requestFactory)
                .build();
    }
}

