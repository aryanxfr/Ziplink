package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.config.ShortCodeProperties;
import com.aryan.ziplink.dto.request.CreateUrlRequest;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.enums.UrlFilterStatus;
import com.aryan.ziplink.exception.BadRequestException;
import com.aryan.ziplink.exception.ForbiddenException;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.exception.ShortCodeGenerationException;
import com.aryan.ziplink.mapper.UrlMapper;
import com.aryan.ziplink.repository.UrlRepository;
import com.aryan.ziplink.repository.UserRepository;
import com.aryan.ziplink.service.ExpiryService;
import com.aryan.ziplink.service.ShortCodeGenerator;
import com.aryan.ziplink.service.UrlService;
import com.aryan.ziplink.specifications.UrlSpecification;
import com.aryan.ziplink.util.SecurityUtils;
import com.aryan.ziplink.util.UrlBuilder;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UrlServiceImpl implements UrlService {
    private final UrlRepository urlRepository;
    private UserRepository userRepository;
    private UrlMapper urlMapper;
    private ShortCodeGenerator shortCodeGenerator;
    private UrlBuilder urlBuilder;
    private final ShortCodeProperties shortCodeProperties;
    private final ExpiryService expiryService;
    private final CacheManager cacheManager;

    public UrlServiceImpl(UrlRepository urlRepository, UserRepository userRepository, UrlMapper urlMapper, ShortCodeGenerator shortCodeGenerator, UrlBuilder urlBuilder, ShortCodeProperties shortCodeProperties, ExpiryService expiryService, CacheManager cacheManager) {
        this.urlRepository = urlRepository;
        this.userRepository = userRepository;
        this.urlMapper = urlMapper;
        this.shortCodeGenerator = shortCodeGenerator;
        this.urlBuilder = urlBuilder;
        this.shortCodeProperties = shortCodeProperties;
        this.expiryService = expiryService;
        this.cacheManager = cacheManager;
    }


    @Override
    @Transactional
    public UrlResponse createShortUrl(CreateUrlRequest request) {
        Optional<Url> existingUrl=urlRepository.
                findByUserAndOriginalUrlAndActiveTrueAndExpiresAtAfter(
                        SecurityUtils.currentUser(),
                        request.originalUrl(),
                        Instant.now()
                );
        if(existingUrl.isPresent()){
            var existing=existingUrl.get();
            return urlMapper.toResponse(
                    existing,
                    urlBuilder.buildShortUrl
                            (existing.getShortCode())
            );
        }

        var url=urlMapper.toEntity(request);
        url.setUser(SecurityUtils.currentUser());
        url.setExpiresAt(expiryService.resolveExpiry(request.expiryType(),request.expiresAt()));
        Url saved=saveWithUniqueShortCode(url);
        return urlMapper.toResponse(
                saved,
                urlBuilder.buildShortUrl(saved.getShortCode())
        );
    }

    @Override
    public void deactivateUrl(UUID urlId) {
        var url=urlRepository.findById(urlId).orElseThrow(()-> new ResourceNotFoundException("URL not found"));
        var currentUser=SecurityUtils.currentUser();
        if(!url.getUser().getId().equals(currentUser.getId())){
            throw new ForbiddenException("You are not allowed to modify this URL");
        }
        if (!url.getActive()){
            throw new BadRequestException("URL is already inactive");
        }
        url.setActive(false);
        urlRepository.save(url);
        cacheManager
                .getCache("redirects")
                .evict(url.getShortCode());

    }

    @Override
    public void activateUrl(UUID urlId) {
        var url=urlRepository.findById(urlId).orElseThrow(()-> new ResourceNotFoundException("URL not found"));
        var currentUser=SecurityUtils.currentUser();
        if(!url.getUser().getId().equals(currentUser.getId())){
            throw new ForbiddenException("You are not allowed to modify this URL");
        }
        if(url.getExpiresAt().isBefore(Instant.now())){
            throw new BadRequestException("Expired URLs cannot be reactivated");
        }
        if(url.getActive()){
            throw new BadRequestException("URL is already active");
        }
        if(url.getDeletedAt()!=null){
            throw new BadRequestException("Deleted URLs cannot be activated");
        }
        url.setActive(true);
        urlRepository.save(url);
        cacheManager
                .getCache("redirects")
                .evict(url.getShortCode());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UrlResponse> getUrls(String search, UrlFilterStatus status, Pageable pageable) {
        var currentUser=SecurityUtils.currentUser();
        Specification<Url> specification = Specification
                .where(UrlSpecification.belongsTo(currentUser))
                .and(UrlSpecification.search(search))
                .and(UrlSpecification.status(status));
        return urlRepository.findAll(specification,pageable)
                .map(url -> urlMapper.toResponse(
                        url,
                        urlBuilder.buildShortUrl(url.getShortCode())
                ));
    }

    @Override
    public List<UrlResponse> getExpiringSoon(int days) {
        var currentUser=SecurityUtils.currentUser();
        Specification<Url> specification=Specification
                .where(UrlSpecification.belongsTo(currentUser))
                .and(UrlSpecification.expiringWithin(days));
        return urlRepository.findAll(specification, Sort.by("expiresAt").ascending())
                .stream()
                .map(url -> urlMapper.toResponse(
                        url,
                        urlBuilder.buildShortUrl(url.getShortCode())
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UrlResponse> getRecentUrls(int limit) {
        var currentUser=SecurityUtils.currentUser();
        Specification<Url> specification=Specification
                .where(UrlSpecification.belongsTo(currentUser));
        Pageable pageable= PageRequest.of(
                0,
                limit,
                Sort.by(Sort.Direction.DESC,"createdAt")
        );
        return urlRepository
                .findAll(specification,pageable)
                .map(url -> urlMapper.toResponse(
                        url,
                        urlBuilder.buildShortUrl(url.getShortCode())
                ))
                .getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UrlResponse> getTopUrls(Pageable pageable) {
        var currentUser=SecurityUtils.currentUser();
        Specification<Url> specification=Specification.where(UrlSpecification.belongsTo(currentUser));
        Pageable sortedPageable=PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC,"clickCount")
        );
        return urlRepository.findAll(specification,sortedPageable)
                .map(url -> urlMapper.toResponse(
                        url,
                        urlBuilder.buildShortUrl(url.getShortCode())
                ));
    }

    @Override
    @Transactional

    public void deleteUrl(UUID urlId) {
        var url=urlRepository.findById(urlId)
                .orElseThrow(()->new ResourceNotFoundException("URL not found"));
        var currentUser=SecurityUtils.currentUser();
        if(!url.getUser().getId().equals(currentUser.getId())){
            throw new ForbiddenException("You are not allowed to delete this URL");
        }
        if(url.getDeletedAt()!=null){
            throw new BadRequestException("URL is already active");
        }
        url.setActive(false);
        url.setDeletedAt(Instant.now());
        urlRepository.save(url);


        cacheManager.getCache("redirects")
                .evict(url.getShortCode());
    }

    private Url saveWithUniqueShortCode(Url url) {
        for (int attempt = 1; attempt <= shortCodeProperties.maxRetryAttempts(); attempt++) {
            try {
                url.setShortCode(
                        shortCodeGenerator.generateShortCode()
                );
                return urlRepository.save(url);
            } catch (DataIntegrityViolationException ex) {
                if (attempt== shortCodeProperties.maxRetryAttempts()){
                    throw new ShortCodeGenerationException("Unable to generate a unique short code after"
                    + shortCodeProperties.maxRetryAttempts() + "attempts.");
                }
            }
        }
        throw new ShortCodeGenerationException(
                "Unable to generate a unique short code."
        );
    }

}
