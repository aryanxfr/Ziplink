<div align="center">

#  ZipLink
### A URL Shortener

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![JWT](https://img.shields.io/badge/JWT-Authentication-yellow)
![Docker](https://img.shields.io/badge/Docker-Redis-blue)
![Flyway](https://img.shields.io/badge/Flyway-Database%20Migration-brown)


A scalable, secure and URL shortening service built using **Spring Boot**, **PostgreSQL**, and **Redis**. ZipLink provides authentication, analytics, email verification, rate limiting, caching, scheduled maintenance tasks and follows modern backend engineering practices.

</div>

---

#  Overview

ZipLink is a backend system that allows authenticated users to create and manage shortened URLs while providing analytics, security, and performance optimizations.

The project is designed with scalability in mind by separating concerns into independent modules and integrating Redis for caching and distributed rate limiting.

---

#  Features

##  Authentication

- User Registration
- Login
- JWT Authentication
- Refresh Token Authentication
- Email Verification
- Forgot Password
- Password Reset
- Change Password
- Logout from all active sessions

---

##  URL Management

- Create Short URLs
- Custom Alias Support
- Automatic Short Code Generation
- URL Expiration
- Soft Delete
- Restore Capability (future enhancement)

---

##  Analytics

- Total Click Count
- Click History
- IP Address Tracking
- User Agent Tracking
- Referer Tracking
- Time Range Filtering
- Pagination Support

---

##  Performance

- Redis URL Cache
-  Rate Limiter
- Database Indexing
- Flyway Database Versioning
- Efficient Repository Queries

---

##  Notifications

- Email Verification
- Welcome Email
- Password Reset Email
- URL Expiry Reminder
- Scheduled Notifications

---

##  Scheduled Jobs

- Expired URL Cleanup
- Soft Deleted URL Cleanup
- Refresh Token Cleanup
- Verification Token Cleanup
- Password Reset Token Cleanup
- URL Expiry Reminder

---



#  Tech Stack

| Category | Technology |
|----------|------------|
| Language | Java 21 |
| Framework | Spring Boot 4 |
| Security | Spring Security + JWT |
| Database | PostgreSQL |
| Cache | Redis |
| ORM | Spring Data JPA |
| Migration | Flyway |
| Mapping | MapStruct |
| Build Tool | Maven |
| Email | JavaMail |
| Container | Docker |
| Testing | Postman, k6 |

---

#  Project Structure

```
src
│
├── config
├── controller
├── dto
│   ├── request
│   └── response
├── entity
├── enums
├── exception
├── mapper
├── repository
├── scheduler
├── security
├── service
│   ├── impl
│   └── interfaces
├── specification
├── util
└── validation
```

---

# Security Features

- JWT Authentication
- Refresh Token Rotation
- BCrypt Password Hashing
- Email Verification
- Password Reset Tokens
- Soft Delete
- Endpoint Authorization
- Role Based Authorization
- Redis Rate Limiting

---

# Caching

Redis is used to cache frequently accessed short URLs to reduce database lookups.

---


# Running Locally

## Clone

```bash
git clone https://github.com/yourusername/ziplink.git
```

```
cd ziplink
```

---

## PostgreSQL

Create database

```
ziplink
```

---

## Redis

Using Docker

```bash
docker run -d \
--name ziplink-redis \
-p 6379:6379 \
redis
```

---

## Configure Environment Variables

Create a `.env`

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=

MAIL_USERNAME=
MAIL_PASSWORD=

BASE_URL=

REDIS_HOST=
REDIS_PORT=
```

---

## Run

```
mvn spring-boot:run
```

---

#  API Documentation

Swagger UI

```
http://localhost:8080/swagger-ui.html
```

---


# Author

**Aryan Gupta**


GitHub: **https://github.com/aryanxfr**

---


