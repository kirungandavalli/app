package com.hexagon.booking.repository.custom;

import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.hexagon.booking.model.BookingInfo;

public class BookingInfoRepositoryImpl implements CustomBookingInfoRepository {

	private MongoTemplate mongoTemplate;

	@Autowired
	public BookingInfoRepositoryImpl(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@Override
	public List<BookingInfo> findByStartTimeBetween(Date from, Date to) {
		Criteria release = Criteria.where("released").is(false);

		Criteria lt = Criteria.where("startTime").gte(from).lte(to);
		LookupOperation deskLookup = Aggregation.lookup("desk", "deskId", "_id", "desk");
		LookupOperation EmpLookup = Aggregation.lookup("employee", "empId", "_id", "employee");
		SortOperation sort  = Aggregation.sort(Sort.by(Sort.Direction.ASC, "startTime"));

		AggregationResults<BookingInfo> aggregate = mongoTemplate.aggregate(
				Aggregation.newAggregation(sort,deskLookup, EmpLookup, Aggregation.match(lt), Aggregation.match(release)),
				"bookinginfo", BookingInfo.class);
		return aggregate.getMappedResults();

	}

	@Override
	public List<BookingInfo> findByStartTimeBetweenByEmployee(String empId, Date from, Date to) {
		Criteria release = Criteria.where("released").is(false);
		String pattern = ".*"+empId+".*"; 
		Criteria eId = Criteria.where("empId").regex(pattern);

		Criteria lt = Criteria.where("startTime").gte(from).lte(to);

		LookupOperation deskLookup = Aggregation.lookup("desk", "deskId", "_id", "desk");
		LookupOperation EmpLookup = Aggregation.lookup("employee", "empId", "_id", "employee");
		SortOperation sort  = Aggregation.sort(Sort.by(Sort.Direction.ASC, "startTime"));
		AggregationResults<BookingInfo> aggregate = mongoTemplate.aggregate(Aggregation.newAggregation(sort,deskLookup,
				EmpLookup, Aggregation.match(eId), Aggregation.match(lt), Aggregation.match(release)), "bookinginfo",
				BookingInfo.class);
		return aggregate.getMappedResults();

	}

}
