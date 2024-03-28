package com.ndoan.cons.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${security.enabled}")
    private boolean securityEnabled;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        if (securityEnabled) {
            http
                    .authorizeRequests((authorizeRequests) ->
                            authorizeRequests
                                    .requestMatchers("/api/**").hasRole("USER")
                    )
                    .authorizeRequests((authorizeRequests) ->
                            authorizeRequests
                                    .requestMatchers("/").permitAll()
                    )
                    .formLogin(Customizer.withDefaults()
                /*.formLogin((formLogin) ->
                        formLogin
                                .usernameParameter("username")
                                .passwordParameter("password")
                                .loginPage("/login")
                                .failureUrl("/login?failed")
                                .loginProcessingUrl("/login/process").permitAll()*/
                    );
        } else {
            http.authorizeRequests().anyRequest().permitAll();
        }

        return http.build();


    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
                .username("user")
                .password("password")
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }
}
