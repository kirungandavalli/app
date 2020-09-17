package com.hexagon.booking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexagon.booking.converter.DateConverter;
import com.hexagon.booking.model.BookingInfo;
import com.hexagon.booking.model.client.Desk;
import com.hexagon.booking.model.client.Result;

@Service
public class ResultService {

	@Autowired
	DeskService deskService;

	@Autowired
	BookingInfoService bookingService;

	@Autowired
	EmployeeService empService;

	@Autowired
	AdminService admin;

	public Result getAll(String empId, String startTime, String endTime) {
		Result res = new Result();
		List<com.hexagon.booking.model.Desk> desks = deskService.getAll();
		List<Desk> resDesks = new ArrayList<>();
		boolean isAlarming = admin.getConfig().isAlarming();

		desks.forEach(d -> {
			Desk desk = new Desk(d);
			if (!isAlarming)
				desk.setAlarming(null);
			resDesks.add(desk);
		});
		List<BookingInfo> bookings = bookingService.findByStartTimeBetween(DateConverter.toDate(startTime),
				DateConverter.toDate(endTime));
		res.setDesks(resDesks);
		updateDesksWithBookingInfo(resDesks, bookings);
		return res;
	}

	private void updateDesksWithBookingInfo(List<Desk> desks, List<BookingInfo> bookings) {
		for (BookingInfo booking : bookings) {
			Desk desk = getDeskById(desks, booking.getDeskId());
			desk.setEmployee(booking.getEmployee());
			desk.setBookingId(booking.getId());

			String alarming = desk.getAlarming();
			if (null == alarming)
				continue;
			String[] list = alarming.split(",");
			for (String id : list) {
				getDeskById(desks, id).setDanger(true);
			}

		}
	}

	private Desk getDeskById(List<Desk> desks, String id) {
		for (Desk desk : desks) {
			if (desk.getId().equalsIgnoreCase(id))
				return desk;
		}
		return null;
	}

}
