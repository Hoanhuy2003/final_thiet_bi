package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VaiTroRepository extends JpaRepository<VaiTro, String> {
    Optional<VaiTro> findByMaVaiTro(String maVaiTro);
}