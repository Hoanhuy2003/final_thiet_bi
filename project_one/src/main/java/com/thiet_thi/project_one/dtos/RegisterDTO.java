// src/main/java/com/thiet_thi/project_one/dtos/RegisterDTO.java
package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterDTO {

    @JsonProperty("ten_nd")
     String tenND;
    @JsonProperty("email")
     String email;
    @JsonProperty("mat_khau")
     String matKhau;
    @JsonProperty("ma_don_vi")
     String maDonVi;


}