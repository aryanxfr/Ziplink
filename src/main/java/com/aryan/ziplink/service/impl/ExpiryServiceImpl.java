package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.config.ShortCodeProperties;
import com.aryan.ziplink.enums.ExpiryType;
import com.aryan.ziplink.exception.BadRequestException;
import com.aryan.ziplink.service.ExpiryService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
@Service
public class ExpiryServiceImpl implements ExpiryService {

    public final ShortCodeProperties properties;

    public ExpiryServiceImpl(ShortCodeProperties properties) {
        this.properties = properties;
    }

    @Override
    public Instant resolveExpiry(ExpiryType expiryType, Instant customExpiry) {
        if(expiryType==null){
            expiryType=ExpiryType.DEFAULT;
        }
        Instant now=Instant.now();
        switch (expiryType){
            case   DEFAULT:
                return now.plus(properties.defaultExpiryDays(), ChronoUnit.DAYS);

            case FIVE_MINUTES:
                return now.plus(5,ChronoUnit.MINUTES);

            case TEN_MINUTES:
                return now.plus(10,ChronoUnit.MINUTES);

            case ONE_DAY:
                return now.plus(1,ChronoUnit.DAYS);

            case SEVEN_DAYS:
                return now.plus(7,ChronoUnit.DAYS);

            case ONE_MONTH:
                return now.plus(1,ChronoUnit.MONTHS);

            case THREE_MONTHS:
                return now.plus(3,ChronoUnit.MONTHS);

            case CUSTOM:
                if (customExpiry==null){
                    throw new BadRequestException("Expiry date is required for Custom Expiry");
                }
                return customExpiry;
            default:
                throw new IllegalArgumentException("Invalid Expiry Type");
        }
    }
}
