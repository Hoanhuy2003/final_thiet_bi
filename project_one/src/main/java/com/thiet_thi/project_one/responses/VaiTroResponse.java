package com.thiet_thi.project_one.responses;

import com.thiet_thi.project_one.models.VaiTro;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VaiTroResponse {
  private String maVaiTro;
  private String tenVaiTro;

  public static VaiTroResponse fromVaiTro(VaiTro vt) {
    return VaiTroResponse.builder()
            .maVaiTro(vt.getMaVaiTro())
            .tenVaiTro(vt.getTenVaiTro())
            .build();
  }
}

