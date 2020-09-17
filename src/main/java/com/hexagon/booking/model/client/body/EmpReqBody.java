package com.hexagon.booking.model.client.body;

public class EmpReqBody {

	private String empId;

	private String startTime;

	private String endTime;

	public EmpReqBody() {
		
	}
	public EmpReqBody(String empId, String startTime, String endTime) {
		this.empId = empId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

}
