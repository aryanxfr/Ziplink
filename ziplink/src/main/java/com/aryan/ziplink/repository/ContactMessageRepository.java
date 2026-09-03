package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.ContactMessage;
import com.aryan.ziplink.enums.MessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.UUID;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    Page<ContactMessage> findByDeletedAtIsNullOrderByCreatedAtDesc(Pageable pageable);

    long countByStatusAndDeletedAtIsNull(MessageStatus status);

    @Modifying
    @Query("DELETE FROM ContactMessage m WHERE m.status = :status AND m.deletedAt IS NOT NULL AND m.deletedAt < :cutoff")
    int purgeArchivedBefore(@Param("status") MessageStatus status, @Param("cutoff") Instant cutoff);
}
