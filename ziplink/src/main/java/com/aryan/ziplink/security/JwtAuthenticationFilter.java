package com.aryan.ziplink.security;

import com.aryan.ziplink.config.CookieProperties;
import com.aryan.ziplink.security.cookie.CookieUtils;
import com.aryan.ziplink.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final CookieProperties cookieProperties;
    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService, CookieProperties cookieProperties){
        this.jwtService=jwtService;
        this.userDetailsService=userDetailsService;
        this.cookieProperties = cookieProperties;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
            ) throws ServletException, IOException{
        Optional<String> token= CookieUtils.getCookieValue(
                request,
                cookieProperties.accessToken().name()
        );
        if(token.isEmpty()){
            filterChain.doFilter(request,response);
            return;
        }

        try{
            String jwt=token.get();

            String username=jwtService.extractUsername(jwt);

            if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
                UserDetails userDetails=userDetailsService.loadUserByUsername(username);
                if(jwtService.isTokenValid(jwt,userDetails)){
                    UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authenticationToken);
                }
            }
        } catch (JwtException | IllegalArgumentException ignored){

        }
        filterChain.doFilter(request,response);
    }
}
