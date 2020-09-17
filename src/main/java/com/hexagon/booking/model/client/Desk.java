package com.hexagon.booking.model.client;

import com.hexagon.booking.model.Employee;

public class Desk extends com.hexagon.booking.model.Desk {

	private Employee employee;

	private boolean danger;
	
	private String bookingId;

	

	public Desk(com.hexagon.booking.model.Desk desk) {
		this(desk.getId(), desk.getBlock(), desk.isActive(), desk.getAlarming());
	}

	public Desk(String id, String block, boolean active, String alarming) {
		super(id, block, active, alarming);
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public boolean isDanger() {
		return danger;
	}

	public void setDanger(boolean danger) {
		this.danger = danger;
	}
	
	public String getBookingId() {
		return bookingId;
	}

	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}

}
