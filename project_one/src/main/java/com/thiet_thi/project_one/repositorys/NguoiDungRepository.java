package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {
}
