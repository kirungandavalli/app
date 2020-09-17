package com.hexagon.booking.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.hexagon.booking.service.BookingInfoService;
import com.hexagon.booking.service.DeskService;
import com.hexagon.booking.service.EmployeeService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

@WebMvcTest(BookingController.class)
public class BookingControllerTest {
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	BookingInfoService bookingService;

	@MockBean
	DeskService deskService;
	
	@MockBean
	EmployeeService empService;

	@Test
	public void testAllDesk() throws Exception {

		ResultActions perform = this.mockMvc.perform(get("/desks")).andExpect(content().json("[]"));
		

	}

}
