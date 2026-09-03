package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.request.ContactRequest;
import com.aryan.ziplink.dto.response.ContactMessageResponse;
import com.aryan.ziplink.enums.MessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ContactService {
    void submitContactMessage(ContactRequest request);
    Page<ContactMessageResponse> getMessages(Pageable pageable);
    ContactMessageResponse updateStatus(UUID id, MessageStatus status);
    void deleteMessage(UUID id);
    long getNewMessageCount();
}
