package com.hexagon.booking.model;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

/**
 * An entity which holds booking information
 * 
 * @author kigandav
 *
 */
@Document(collection = "bookinginfo")
public class BookingInfo {

	public boolean isReleased() {
		return released;
	}
	public void setReleased(boolean released) {
		this.released = released;
	}
	private String id;

	private String empId;

	private String deskId;

	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date startTime;

	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date endTime;
	
	private Desk desk;
	
	private Employee employee;
	
	private boolean released = false;

	public Desk getDesk() {
		return desk;
	}
	public void setDesk(Desk desk) {
		this.desk = desk;
	}
	public Employee getEmployee() {
		return employee;
	}
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	public BookingInfo() {
		
	}
	public BookingInfo(String empId, String deskId, Date startTime, Date endTime, boolean released) {
		this.empId = empId;
		this.deskId = deskId;
		this.startTime = startTime;
		this.endTime = endTime;
		this.released = released;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public String getDeskId() {
		return deskId;
	}

	public void setDeskId(String deskId) {
		this.deskId = deskId;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}


}
