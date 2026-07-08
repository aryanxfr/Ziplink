package com.aryan.ziplink.entity;

import com.aryan.ziplink.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User extends BaseEntity{
    @Id
    @UuidGenerator //hibernate generates the uuid
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false,unique = true,length = 50)
    private String username;

    @Column(nullable = false,unique = true,length = 255)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(
            mappedBy = "user",cascade = CascadeType.ALL,orphanRemoval = true
    )
    @Builder.Default // to avoid producing null instead it will give urls= []
    private List<Url> urls=new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = false;


}
