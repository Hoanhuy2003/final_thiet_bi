package com.thiet_thi.project_one.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "phong")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Phong {

    @Id
    @Column(name = "ma_phong")
    private String maPhong;

    @Column(name = "ten_phong", nullable = false, length = 100)
    private String tenPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_vi", nullable = false)
    private DonVi donVi;

    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ThietBi> thietBis;
}
