package com.hexagon.booking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "desk")
public class Desk {

	@Id
	private String id;

	private String block;

	private boolean active;

	private String alarming;


	public Desk() {
	}
	
	public Desk(String id, String block, boolean active, String alarming) {
		this.id = id;
		this.block = block;
		this.active = active;
		this.alarming = alarming;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBlock() {
		return block;
	}

	public void setBlock(String block) {
		this.block = block;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
	
	public String getAlarming() {
		return alarming;
	}

	public void setAlarming(String alarming) {
		this.alarming = alarming;
	}



	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return id + ":" + block;
	}
}
