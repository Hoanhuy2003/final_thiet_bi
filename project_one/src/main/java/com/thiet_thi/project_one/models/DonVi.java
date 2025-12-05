package com.thiet_thi.project_one.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    private Set<Phong> dsPhong = new HashSet<>();

    @OneToMany(mappedBy = "donVi")
    @JsonIgnore
    private Set<NguoiDung> dsNguoiDung = new HashSet<>();

}