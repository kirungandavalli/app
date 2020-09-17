package com.hexagon.booking.repository.custom;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.hexagon.booking.model.BookingInfo;
import com.hexagon.booking.model.Desk;


public interface CustomBookingInfoRepository {

	List<BookingInfo> findByStartTimeBetween(Date from, Date to);
	
	
	
	List<BookingInfo> findByStartTimeBetweenByEmployee(String empId, Date from, Date to);

}
