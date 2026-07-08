package com.aryan.ziplink.specifications;

import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.enums.UrlFilterStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class UrlSpecification {
    private UrlSpecification(){
    }
    public static Specification<Url> belongsTo(User user){
        return(root, query, criteriaBuilder) ->
                criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("user"),user),
                        criteriaBuilder.isNull(root.get("deletedAt"))
                );
    }
    public static Specification<Url> search(String search){
        if(search==null || search.isBlank()){
            return (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        }
        String pattern="%" + search.toLowerCase() + "%";
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("originalUrl")),
                                pattern
                        ),
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("shortCode")),
                                pattern
                        ),
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("customAlias")),
                                pattern
                        )
                );
    }
    public static Specification<Url> status(UrlFilterStatus status){
        if (status==null){
            return (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        }
        return switch (status){
            case ACTIVE -> active();
            case INACTIVE -> inactive();
            case EXPIRED -> expired();
        };
    }

    private static Specification<Url> active(){
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("active")),
                criteriaBuilder.or(
                        criteriaBuilder.isNull(root.get("expiresAt")),
                        criteriaBuilder.greaterThan(
                                root.get("expiresAt"),
                                Instant.now()
                        )
                )
        );
    }

    private static Specification<Url> inactive(){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isFalse(root.get("active"));
    }

    private static Specification<Url> expired(){
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isNotNull(root.get("expiresAt")),
                        criteriaBuilder.lessThan(
                                root.get("expiresAt"),
                                Instant.now()
                        )
        );
    }

    public static Specification<Url> expiringWithin(int days) {
        Instant now = Instant.now();
        Instant end = now.plus(days, ChronoUnit.DAYS);
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("active")),
                criteriaBuilder.isNotNull(root.get("expiresAt")),
                criteriaBuilder.between(
                        root.get("expiresAt"),
                        now,
                        end
                )
        );
    }
}
