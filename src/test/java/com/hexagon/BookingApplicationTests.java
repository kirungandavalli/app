package com.hexagon;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexagon.booking.controller.BookingController;

@SpringBootTest
class BookingApplicationTests {

	@Autowired
	private BookingController controller;
	@Test
	void contextLoads() {
		assertThat(controller).isNotNull();

	}

}
