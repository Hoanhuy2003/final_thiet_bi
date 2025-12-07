package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nha_cung_cap")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NhaCungCap {

    @Id
    private String maNhaCungCap;

    @Column(nullable = false)
    private String ten;

    @Column
    private String diaChi;

    @Column
    private String soDienThoai;

    @Column
    private String email;

    @Column(name = "ma_so_thue")
    private String maSoThue;
}
