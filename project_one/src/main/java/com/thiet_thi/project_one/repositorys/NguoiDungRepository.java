package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.NguoiDung;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {

    Optional<NguoiDung> findByMaND(String maND);

    boolean existsByEmail(String email);

    Optional<NguoiDung> findByEmail(String email);

    @Query("SELECT u FROM NguoiDung u WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "lower(u.tenND) LIKE lower(concat('%', :search, '%')) OR " +
            "lower(u.email) LIKE lower(concat('%', :search, '%'))) AND " +
            "(:vaiTro IS NULL OR :vaiTro = '' OR u.vaiTro.maVaiTro = :vaiTro) AND " +
            "(:donVi IS NULL OR :donVi = '' OR u.donVi.maDonVi = :donVi) AND " +
            "(:trangThai IS NULL OR :trangThai = '' OR u.trangThai = :trangThai)")
    Page<NguoiDung> findByCriteria(
            @Param("search") String search,
            @Param("vaiTro") String vaiTro,
            @Param("donVi") String donVi,
            @Param("trangThai") String trangThai,
            Pageable pageable);
}
