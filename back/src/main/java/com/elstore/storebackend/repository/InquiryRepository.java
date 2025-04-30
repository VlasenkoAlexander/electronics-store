package com.elstore.storebackend.repository;

import com.elstore.storebackend.entity.Inquiry;
import com.elstore.storebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByUser(User user);
}
