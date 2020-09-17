package com.hexagon.booking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "config")
public class Config {

	@Id
	private String id = "config";

	private boolean alarming = true;

	private int coolingOff = 0;

	public Config(boolean alarming, int coolingOff) {
		this.alarming = alarming;
		this.coolingOff = coolingOff;
	}

	public boolean isAlarming() {
		return alarming;
	}

	public void setAlarming(boolean alarming) {
		this.alarming = alarming;
	}

	public int getCoolingOff() {
		return coolingOff;
	}

	public void setCoolingOff(int coolingOff) {
		this.coolingOff = coolingOff;
	}

}
