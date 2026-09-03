package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.request.ContactRequest;
import com.aryan.ziplink.dto.response.ContactMessageResponse;
import com.aryan.ziplink.entity.ContactMessage;
import com.aryan.ziplink.enums.MessageStatus;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.repository.ContactMessageRepository;
import com.aryan.ziplink.service.ContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    @Transactional
    public void submitContactMessage(ContactRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.name())
                .email(request.email())
                .message(request.message())
                .status(MessageStatus.NEW)
                .build();
        contactMessageRepository.save(message);
        log.info("Contact message received from {} <{}>", request.name(), request.email());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> getMessages(Pageable pageable) {
        return contactMessageRepository.findByDeletedAtIsNullOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional
    public ContactMessageResponse updateStatus(UUID id, MessageStatus status) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        message.setStatus(status);
        contactMessageRepository.save(message);
        log.info("Message {} status updated to {}", id, status);
        return toResponse(message);
    }

    @Override
    @Transactional
    public void deleteMessage(UUID id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        message.setStatus(MessageStatus.ARCHIVED);
        message.setDeletedAt(Instant.now());
        contactMessageRepository.save(message);
        log.info("Message {} soft-deleted", id);
    }

    @Override
    @Transactional(readOnly = true)
    public long getNewMessageCount() {
        return contactMessageRepository.countByStatusAndDeletedAtIsNull(MessageStatus.NEW);
    }

    private ContactMessageResponse toResponse(ContactMessage m) {
        return new ContactMessageResponse(
                m.getId(),
                m.getName(),
                m.getEmail(),
                m.getMessage(),
                m.getStatus(),
                m.getCreatedAt()
        );
    }
}
