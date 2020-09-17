package com.hexagon.booking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.hexagon.booking.model.Employee;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String>{

}
