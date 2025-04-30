package com.tech.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080") // استبدلها بعنوان سيرفر Vue.js
                .allowedMethods("GET", "POST", "PUT", "DELETE") // الخيارات المتاحة
                .allowedHeaders("*"); // يسمح بجميع الهيدرز
    }
}