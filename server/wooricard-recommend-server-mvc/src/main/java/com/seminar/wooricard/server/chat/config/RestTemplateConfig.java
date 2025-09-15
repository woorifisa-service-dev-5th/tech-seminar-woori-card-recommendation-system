package com.seminar.wooricard.server.chat.config;

import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.core5.util.Timeout;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        // HTTP 클라이언트 요청 팩토리 생성
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();

        // 커넥션 풀 설정
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
        connectionManager.setMaxTotal(100); // 최대 동시 연결 수

        // 타임아웃 설정
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectionRequestTimeout(Timeout.ofSeconds(20)) // 커넥션 풀에서 커넥션을 가져오는 타임아웃 (30초)
                .setConnectTimeout(Timeout.ofSeconds(5)) // 서버와 연결을 맺는 타임아웃 (5초)
                .setResponseTimeout(Timeout.ofMinutes(10)) // AI 서버의 응답을 기다리는 전체 타임아웃 (10분)
                .build();

        // Apache HttpClient 5 설정 적용
        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(requestConfig)
                .build();

        requestFactory.setHttpClient(httpClient);

        return new RestTemplate(requestFactory);
    }
}
