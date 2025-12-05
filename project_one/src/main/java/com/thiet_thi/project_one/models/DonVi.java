package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "don_vi")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DonVi {

    @Id
    @Column(name = "ma_don_vi")
    private String maDonVi;

    @Column(name = "ten_don_vi", nullable = false, length = 100)
    private String tenDonVi;

    @OneToMany(mappedBy = "donVi", cascade = CascadeType.ALL)
    private List<Phong> dsPhong;

    @OneToMany(mappedBy = "donVi")
    private List<NguoiDung> dsNguoiDung;
}