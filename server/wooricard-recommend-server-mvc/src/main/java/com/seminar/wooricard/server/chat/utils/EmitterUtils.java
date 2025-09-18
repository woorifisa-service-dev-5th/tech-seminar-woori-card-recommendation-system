package com.seminar.wooricard.server.chat.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;


@Component
public class EmitterUtils {

    private final List<ResponseBodyEmitter> emitters = new CopyOnWriteArrayList<>();

    public ResponseBodyEmitter createEmitter() {

        ResponseBodyEmitter emitter = new ResponseBodyEmitter(Duration.ofMinutes(30).toMillis());

        emitters.add(emitter);

        // 연결이 정상적으로 완료되거나, 타임아웃이 발생하거나, 에러가 발생했을 때
        // 리스트에서 해당 emitter를 제거하여 메모리 누수를 방지
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }
}
