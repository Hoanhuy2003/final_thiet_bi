package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.responses.NhaCungCapResponse;
import java.util.List;

public interface INhaCungCapService {
    List<NhaCungCapResponse> getAll();
}