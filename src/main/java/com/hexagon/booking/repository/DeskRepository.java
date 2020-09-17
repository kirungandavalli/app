package com.hexagon.booking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.hexagon.booking.model.Desk;



@Repository
public interface DeskRepository extends MongoRepository<Desk, String> {
	
	

}
