package com.ecw.FilePurge;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FilePurgeApplication {
	 
	private static final Logger logger = LoggerFactory.getLogger(FilePurgeApplication.class);
	   
	public static void main(String[] args) {
		SpringApplication.run(FilePurgeApplication.class, args);
	}

}
