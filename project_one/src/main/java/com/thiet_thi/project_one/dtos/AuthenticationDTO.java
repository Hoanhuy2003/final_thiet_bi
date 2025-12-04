package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class AuthenticationDTO {
    @JsonProperty("userName")
    String userName;
    @JsonProperty("password")
    String password;
}
