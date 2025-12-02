package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.BaoCaoDto;
import com.thiet_thi.project_one.models.BaoCao;
import com.thiet_thi.project_one.repositorys.BaoCaoRepository;
import com.thiet_thi.project_one.iservices.IBaoCaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class BaoCaoService implements IBaoCaoService {

    private final BaoCaoRepository baoCaoRepository;

    @Override
    @Transactional
    public BaoCao taoBaoCao(BaoCaoDto dto) {

        String tenFile = dto.getLoaiBaoCao().toLowerCase().replace(" ", "-")
                + "-" + LocalDate.now().toString() + ".pdf";

        BaoCao bc = BaoCao.builder()
                .tenBaoCao("Báo cáo " + dto.getLoaiBaoCao() + " từ " + dto.getTuNgay() + " đến " + dto.getDenNgay())
                .loaiBaoCao(dto.getLoaiBaoCao())
                .tuNgay(dto.getTuNgay())
                .denNgay(dto.getDenNgay())
                .donVi(dto.getDonVi() != null && !dto.getDonVi().isBlank() ? dto.getDonVi() : "Tất cả đơn vị")
                .nguoiTao(dto.getNguoiTao())
                .duongDanFile("/files/reports/" + tenFile)
                .kichThuocFile(randomSize())
                .build();

        return baoCaoRepository.save(bc);
    }

    @Override
    public List<BaoCao> getAll() {
        return baoCaoRepository.findAll();
    }

    private String randomSize() {
        String[] sizes = {"987 KB", "1.2 MB", "1.8 MB", "2.5 MB", "3.1 MB"};
        return sizes[new Random().nextInt(sizes.length)];
    }
}