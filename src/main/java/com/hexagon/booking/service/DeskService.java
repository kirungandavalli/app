package com.hexagon.booking.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexagon.booking.model.Desk;
import com.hexagon.booking.repository.DeskRepository;

@Service
public class DeskService {
	@Autowired
	DeskRepository repository;

	@Autowired
	BookingInfoService booking;

	public Desk createDesk(Desk d) {
		return repository.save(d);
	}

	public List<Desk> getAll() {
		return repository.findAll();
	}

	public Optional<Desk> findById(String id) {
		return repository.findById(id);
	}

	public Desk updateBookingInfo(String id, String bookingId) {
		Optional<Desk> desk = repository.findById(id);
		if (!desk.isPresent())
			return null;
		return repository.save(desk.get());

	}

}
