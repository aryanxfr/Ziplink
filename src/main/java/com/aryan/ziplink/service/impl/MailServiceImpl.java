package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class MailServiceImpl implements MailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public MailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendWelcomeEmail(User user) {
        var context=new Context();
        context.setVariable("name",user.getUsername());

        String html= templateEngine.process("welcome-email",
                context);
        MimeMessage message=mailSender.createMimeMessage();
        try{
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            helper.setTo(user.getEmail());
            helper.setSubject("🎉 Welcome to ZipLink");
            helper.setText(html,true);

            mailSender.send(message);
        }catch (MessagingException ex){
            throw new RuntimeException("Failed to send welcome email");
        }
    }

    @Override
    public void sendVerificationEmail(User user, String verificationLink) {
        Context context=new Context();
        context.setVariable("name",user.getUsername());
        context.setVariable("verificationLink",verificationLink);

        String html=templateEngine.process("verification-email",context);
        MimeMessage message=mailSender.createMimeMessage();
        try{
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            helper.setTo(user.getEmail());
            helper.setSubject("Verify your Ziplink Account");
            helper.setText(html,true);

            mailSender.send(message);
        }catch (MessagingException ex){
            throw new RuntimeException("Failed to send verification email.",ex);
        }
    }

    @Override
    public void sendPasswordResetEmail(User user, String resetLink) {
        Context context=new Context();
        context.setVariable("name",user.getUsername());
        context.setVariable("resetLink",resetLink);

        String html=templateEngine.process(
                "reset-password-email",
                context
        );

        MimeMessage message=mailSender.createMimeMessage();

        try{
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            helper.setTo(user.getEmail());
            helper.setSubject("Reset your Ziplink password");
            helper.setText(html,true);

            mailSender.send(message);
        }catch (MessagingException ex){
            throw new RuntimeException("Failed to send your password reset email");
        }
    }

    @Override
    public void sendExpiryReminderEmail(User user, Url url) {
        Context context=new Context();
        context.setVariable("name",user.getUsername());
        context.setVariable("shortUrl",url.getShortCode());
        context.setVariable("originalUrl",url.getOriginalUrl());

        String html=templateEngine.process("expiry-reminder-email",context);

        MimeMessage message=mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            helper.setTo(user.getEmail());
            helper.setSubject("Your Ziplink expires in 24 hours");
            helper.setText(html,true);

            mailSender.send(message);
        }catch (MessagingException ex){
            throw new RuntimeException("Failed to send reminder email");
        }
    }

}
