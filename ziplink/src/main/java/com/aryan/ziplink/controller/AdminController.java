package com.aryan.ziplink.controller;

import com.aryan.ziplink.dto.request.UpdateStatusRequest;
import com.aryan.ziplink.dto.response.ApiResponse;
import com.aryan.ziplink.dto.response.ContactMessageResponse;
import com.aryan.ziplink.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/messages")
@RequiredArgsConstructor
public class AdminController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ContactMessageResponse>>> getMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ContactMessageResponse> messages = contactService.getMessages(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Messages fetched successfully",
                HttpStatus.OK.value(),
                messages
        ));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request) {
        ContactMessageResponse response = contactService.updateStatus(id, request.status());
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Message status updated",
                HttpStatus.OK.value(),
                response
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable UUID id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Message deleted",
                HttpStatus.OK.value(),
                null
        ));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getNewMessageCount() {
        long count = contactService.getNewMessageCount();
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "New message count fetched",
                HttpStatus.OK.value(),
                count
        ));
    }
}
