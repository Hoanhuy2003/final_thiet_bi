package com.thiet_thi.project_one.iservices;



import com.thiet_thi.project_one.dtos.VaiTroDto;

import java.util.List;

public interface IVaiTroService {

    List<VaiTroDto> getAllRoles();

    // dùng maVaiTro làm khóa chính
    VaiTroDto getRoleByMaVaiTro(String maVaiTro);

    VaiTroDto createRole(VaiTroDto dto);

    VaiTroDto updateRole(String maVaiTro, VaiTroDto dto);

    void deleteRole(String maVaiTro);
}
