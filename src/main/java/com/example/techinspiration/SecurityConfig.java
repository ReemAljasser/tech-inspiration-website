package com.tech.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
          // 1. نسمح بالوصول للمسارات التالية بدون تسجيل دخول
          .authorizeHttpRequests(auth -> auth
              .requestMatchers(
                  "/",               // الجذر → index.html أو Thymeleaf index
                  "/index",          // ممكن صفحة Thymeleaf باسم index
                  "/index.html",     // لو صفحة ثابتة داخل static
                  "/contact.html",   // صفحات ثابتة
                  "/css/**",         // ملفات CSS
                  "/js/**",          // ملفات JS
                  "/images/**",      // ملفات الصور
                  "/h2-console/**",  // لتصفح H2 Console
                  "/login",          // صفحة تسجيل الدخول نفسها
                  "/error"           // صفحة الخطأ الافتراضية
              ).permitAll()
              // 2. أي طلب ثاني يحتاج تسجيل دخول
              .anyRequest().authenticated()
          )
          // 3. تكوين صفحة الـ login
          .formLogin(form -> form
              .loginPage("/login")
              .permitAll()
          )
          .logout(logout -> logout.permitAll());

        // 4. للسماح بعمل iframe للـ H2 console
        http.csrf(csrf -> csrf
            .ignoringRequestMatchers("/h2-console/**")
        );
        http.headers(headers -> headers
            .frameOptions(frame -> frame.sameOrigin())
        );

        return http.build();
    }

    // bean لـ PasswordEncoder حتى يشتغل الـ BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}