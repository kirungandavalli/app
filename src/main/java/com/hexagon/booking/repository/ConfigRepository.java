package com.hexagon.booking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.hexagon.booking.model.Config;

@Repository
public interface ConfigRepository extends MongoRepository<Config, String> {

	String ID = "config";
}
