package com.hexagon.booking.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hexagon.booking.converter.DateConverter;
import com.hexagon.booking.model.BookingInfo;
import com.hexagon.booking.model.Config;
import com.hexagon.booking.model.Employee;
import com.hexagon.booking.model.client.Result;
import com.hexagon.booking.model.client.body.EmpReqBody;
import com.hexagon.booking.schema.Schema;
import com.hexagon.booking.service.AdminService;
import com.hexagon.booking.service.BookingInfoService;
import com.hexagon.booking.service.EmployeeService;
import com.hexagon.booking.service.ResultService;

@RestController("/")
public class BookingController {

	@Autowired
	BookingInfoService bookingService;

	@Autowired
	EmployeeService empService;

	@Autowired
	ResultService resultService;
	
	@Autowired
	Schema schema ;
	

	@Autowired
	AdminService service;

	@PostMapping("/desks")
	@ResponseBody
	public Result getAllDesk(@RequestBody EmpReqBody reqBody) {
		return resultService.getAll(reqBody.getEmpId(), reqBody.getStartTime(), reqBody.getEndTime());
	}

	@GetMapping("/employee/{id}")
	public Employee getEmployee(@PathVariable String id) throws Exception {
		return empService.getEmployeeById(id);
	}

	@PostMapping("/employee/book")
	@ResponseBody
	public BookingInfo bookDesk(@RequestBody com.hexagon.booking.model.client.BookingInfo info) throws Exception {
		Date sdate = new Date(Long.parseLong(info.getStartTime()));
		Date edate = new Date(Long.parseLong(info.getEndTime()));

		return bookingService
				.createBookingInfo(new BookingInfo(info.getEmpId(), info.getDeskId(), sdate, edate, false));
	}

	@GetMapping("/employee/release/{id}")
	public String releaseDesk(@PathVariable String id) throws Exception {
		bookingService.release(id);
		return id;
	}
	
	@GetMapping("/employee/Desk/month/{eid}/{year}/{month}")
	public List<Integer> allBookingsInMonth(@PathVariable String eid, @PathVariable String year, @PathVariable String month) throws Exception {
		  
		return bookingService.findByStartTimeBetweenByEmployee(eid, year, month);
	}
	
	@PostMapping("/report")
	@ResponseBody
	public List<BookingInfo> getBookingReport(@RequestBody EmpReqBody reqBody){
		return reqBody.getEmpId() == null ||reqBody.getEmpId().equals("")  ? bookingService.findByStartTimeBetween(DateConverter.toDate(reqBody.getStartTime()), DateConverter.toDate(reqBody.getEndTime())) : bookingService.getAllBookingsByEmployee(reqBody.getEmpId(),reqBody.getStartTime(), reqBody.getEndTime());
	}
	

	@GetMapping("/admin/config")
	public Config getConfig() {
		return service.getConfig();
	}

	@GetMapping("/admin/config/update/{alarming}/{coolingOff}")
	public Config updateConfig(@PathVariable boolean alarming, @PathVariable int coolingOff) {
		return service.update(alarming, coolingOff);
	}

	@PostMapping("/upload")
	public Config bulkUpload(@RequestParam("file") MultipartFile file) throws IOException {
		schema.create(file.getInputStream());
		return service.getConfig();
	} 

}
