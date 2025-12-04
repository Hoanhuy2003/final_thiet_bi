package com.thiet_thi.project_one.repositorys;


import com.thiet_thi.project_one.models.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
}
