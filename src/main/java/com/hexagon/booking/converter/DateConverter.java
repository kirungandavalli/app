package com.hexagon.booking.converter;

import java.util.Date;

public class DateConverter {

	public static Date toDate(String timeStamp) {
		return new Date(Long.parseLong(timeStamp));
	}
}
