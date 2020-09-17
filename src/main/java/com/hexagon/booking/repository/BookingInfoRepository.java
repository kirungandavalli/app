package com.hexagon.booking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.hexagon.booking.model.BookingInfo;
import com.hexagon.booking.repository.custom.CustomBookingInfoRepository;

@Repository
public interface BookingInfoRepository extends MongoRepository<BookingInfo, String> ,CustomBookingInfoRepository {

}
