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

        ConnectionProvider provider = ConnectionProvider.builder("ai-server-provider")
                .maxConnections(100)
                .maxIdleTime(Duration.ofMinutes(5))
                .pendingAcquireTimeout(Duration.ofSeconds(60))
                .build();
        HttpClient httpClient = HttpClient.create(provider)
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .responseTimeout(Duration.ofMinutes(10))
                .wiretap(false);

        return WebClient.builder()
                .baseUrl(aiServerUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}

