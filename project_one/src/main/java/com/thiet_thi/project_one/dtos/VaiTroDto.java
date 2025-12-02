package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VaiTroDto {
    @JsonProperty("ma_vai_tro")
    private String maVaiTro;

    @JsonProperty("ten_vai_tro")
    private String tenVaiTro;
}