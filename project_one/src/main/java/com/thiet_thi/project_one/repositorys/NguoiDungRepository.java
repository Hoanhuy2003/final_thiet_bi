package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {

    boolean existsByEmail(String email);

    Optional<NguoiDung> findByEmail(String email);
}
