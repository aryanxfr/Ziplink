package com.aryan.ziplink.service;

import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.entity.User;

public interface MailService {
    void sendWelcomeEmail(User user);

    void sendVerificationEmail(User user, String verificationLink);

    void sendPasswordResetEmail(User user,String resetLink);

    void sendExpiryReminderEmail(User user, Url url);
}
