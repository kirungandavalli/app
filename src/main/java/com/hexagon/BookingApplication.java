package com.hexagon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;

import com.hexagon.booking.schema.Schema;

@SpringBootApplication
@ComponentScan
public class BookingApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext run = SpringApplication.run(BookingApplication.class, args);
		Schema sc =    run.getBean(Schema.class);
		sc.create();
	}

}
