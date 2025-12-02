package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "vai_tro")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VaiTro {

    @Id
    @Column(name = "ma_vai_tro")
    private String maVaiTro;

    @Column(name = "ten_vai_tro", nullable = false, length = 50)
    private String tenVaiTro;
}