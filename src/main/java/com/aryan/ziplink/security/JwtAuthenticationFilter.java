package com.aryan.ziplink.security;

import com.aryan.ziplink.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService,CustomUserDetailsService userDetailsService){
        this.jwtService=jwtService;
        this.userDetailsService=userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
            ) throws ServletException, IOException{
        final String authHeader=request.getHeader(SecurityConstants.HEADER);

        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        String jwt=authHeader.substring(SecurityConstants.TOKEN_PREFIX.length());
        String username=jwtService.extractUsername(jwt);

        if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            var userDetails=userDetailsService.loadUserByUsername(username);
            if(jwtService.isTokenValid(jwt,userDetails)){
                UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(
                        userDetails,null,userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext()
                        .setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request,response);
    }
}
