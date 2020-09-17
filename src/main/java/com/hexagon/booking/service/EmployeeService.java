package com.hexagon.booking.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexagon.booking.model.Employee;
import com.hexagon.booking.repository.EmployeeRepository;

@Service
public class EmployeeService {

	@Autowired
	EmployeeRepository repository;

	@Autowired
	BookingInfoService bookingService;

	@Autowired
	DeskService deskService;

	public Employee createEmployee(Employee emp) {
		return repository.save(emp);
	}

	public Employee getEmployeeById(String id){
		Optional<Employee> emp = repository.findById(id);
		
		return emp.get();
	}

	public Employee updateBookingInfo(String empId, String bookingId) {
		Optional<Employee> emp = repository.findById(empId);
		return repository.save(emp.get());
	}
}
