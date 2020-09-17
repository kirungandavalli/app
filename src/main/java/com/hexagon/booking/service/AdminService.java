package com.hexagon.booking.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexagon.booking.model.Config;
import com.hexagon.booking.repository.ConfigRepository;

@Service
public class AdminService {

	@Autowired
	ConfigRepository config;

	public Config update(boolean alarming, int coolingOff) {
		Optional<Config> c = config.findById(ConfigRepository.ID);
		if (c.isPresent()) {
			c.get().setAlarming(alarming);
			c.get().setCoolingOff(coolingOff);
			return config.save(c.get());
		}
		return config.save(new Config(alarming, coolingOff));
	}

	public Config getConfig() {
		Optional<Config> c = config.findById(ConfigRepository.ID);
		if (c.isPresent()) {
			return c.get();
		}
		return config.save(new Config(true, 0));
	}
}
