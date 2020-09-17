package com.hexagon.booking.schema;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hexagon.booking.model.Desk;
import com.hexagon.booking.model.Employee;
import com.hexagon.booking.service.BookingInfoService;
import com.hexagon.booking.service.DeskService;
import com.hexagon.booking.service.EmployeeService;

@Component
public class Schema {

	@Autowired
	DeskService deskService;

	@Autowired
	EmployeeService empService;
	
	@Autowired
	BookingInfoService bookingService;


	public void create() {
		try {
			XSSFWorkbook book = new XSSFWorkbook(new FileInputStream("E:\\\\Booking\\\\Desks.xlsx"));
			createDesks(book);
			createEmployees(book);
		} catch (IOException e) {

		}
	}
	
	public void create(InputStream stream) {
		try {
			XSSFWorkbook book = new XSSFWorkbook(stream);
			createDesks(book);
			createEmployees(book);
		} catch (IOException e) {

		}
	}

	private void createDesks(XSSFWorkbook book) {
		XSSFSheet sheetAt = book.getSheet("Desks");
		Iterator<Row> iterator = sheetAt.iterator();
		int i = 0;
		while (iterator.hasNext()) {

			Row row = iterator.next();
			if (i == 0) {
				i++;
				continue;
			}
			Desk desk = new Desk();
			Iterator<Cell> cell = row.iterator();
			int c = 0;
			while (cell.hasNext()) {
				if (c == 0)
					desk.setId(cell.next().getStringCellValue());
				else if(c ==1)
					desk.setBlock(cell.next().getStringCellValue());
				else if(c ==2)
					desk.setActive(cell.next().getBooleanCellValue());
				else if(c == 3)
					desk.setAlarming(cell.next().getStringCellValue());
				c++;
			}
			deskService.createDesk(desk);
			System.out.println(desk);
			i++;
		}
	}

	private void createEmployees(XSSFWorkbook book) {
		XSSFSheet sheetAt = book.getSheet("Employees");
		Iterator<Row> iterator = sheetAt.iterator();
		int i = 0;
		while (iterator.hasNext()) {

			Row row = iterator.next();
			if (i == 0) {
				i++;
				continue;
			}
			Employee emp = new Employee();
			Iterator<Cell> cell = row.iterator();
			int c = 0;
			while (cell.hasNext()) {
				String val = cell.next().getStringCellValue();
				if (c == 0)
					emp.setId(val);
				else if (c == 1)
					emp.setName(val);
				else
					emp.setDepartment(val);
				c++;
			}
			empService.createEmployee(emp);
			System.out.println(emp);
			i++;
		}
	}
}
