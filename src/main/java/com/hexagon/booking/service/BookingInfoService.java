package com.hexagon.booking.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexagon.booking.converter.DateConverter;
import com.hexagon.booking.model.BookingInfo;
import com.hexagon.booking.repository.BookingInfoRepository;

@Service
public class BookingInfoService {

	@Autowired
	DeskService deskService;

	@Autowired
	EmployeeService empService;

	@Autowired
	BookingInfoRepository repository;

	public BookingInfo createBookingInfo(BookingInfo info) {

		return repository.save(info);

	}

	public BookingInfo getBookingInfo(String id) {
		return repository.findById(id).get();
	}

	public BookingInfo release(String id) {

		Optional<BookingInfo> booking = repository.findById(id);
		booking.get().setReleased(true);
		return repository.save(booking.get());
	}

	public List<BookingInfo> findByStartTimeBetween(Date from, Date to) {
		return repository.findByStartTimeBetween(from, to);
	}

	public List<BookingInfo> getAllBookingsByEmployee(String empId, String fromDate, String toDate) {
		return repository.findByStartTimeBetweenByEmployee(empId, DateConverter.toDate(fromDate), DateConverter.toDate(toDate));
	}

	public List<Integer> findByStartTimeBetweenByEmployee(String eid, String year, String month) {
		Calendar gc = new GregorianCalendar();
		gc.set(Calendar.YEAR, Integer.parseInt(year));
		gc.set(Calendar.MONTH, Integer.parseInt(month) - 1);
		gc.set(Calendar.DAY_OF_MONTH, 1);
		Date from = new Date(gc.getTimeInMillis());
		gc.add(Calendar.MONTH, 1);
		gc.add(Calendar.DAY_OF_MONTH, -1);
		Date to = new Date(gc.getTimeInMillis());
		List<BookingInfo> bookings = repository.findByStartTimeBetweenByEmployee(eid, from, to);
		List<Integer> days = new ArrayList<>();
		for (BookingInfo d : bookings) {
			d.getEndTime().getDate();
		}
		bookings.forEach(b -> days.add(b.getEndTime().getDate()));
		return days;
	}

}
