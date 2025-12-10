package com.thiet_thi.project_one.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoTBStatDto {
    private long tongLo;
    private long tongTB;
    private BigDecimal tongTien;
}
