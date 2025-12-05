package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.PhongDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IPhongService;
import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.models.Phong;
import com.thiet_thi.project_one.models.ThietBi;
import com.thiet_thi.project_one.repositorys.DonViRepository;
import com.thiet_thi.project_one.repositorys.PhongRepository;
import com.thiet_thi.project_one.repositorys.ThietBiRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhongService implements IPhongService {


    private final PhongRepository phongRepository;
    private final DonViRepository donViRepository;
    private final ThietBiRepository thietBiRepository;
    @Override
    public Phong createPhong(PhongDto dto) throws DataNotFoundException {
        DonVi donVi = donViRepository.findById(dto.getMaDonVi())
                .orElseThrow(()-> new DataNotFoundException("Không tim thấy phòng"));
        Phong phong = Phong.builder()
                .maPhong(dto.getMaPhong())
                .tenPhong(dto.getTenPhong())
                .donVi(donVi)
                .build();
        if(dto.getThietBis() != null && !dto.getThietBis().isEmpty()){
            List<ThietBi> thietBis = dto.getThietBis().stream()
                    .map(thietBiDto ->{
                        ThietBi thietBi = thietBiRepository.findById(thietBiDto.getMaTB())
                                .orElseThrow(()-> new DataNotFoundException("Không tìm thấy thiết bị"));
                        thietBi.setPhong(phong);
                        return thietBi;
                    })
                    .collect(Collectors.toList());
            phong.setThietBis(thietBis);

        }
        return phongRepository.save(phong);

    }

    @Override
    @Transactional
    public Phong updatePhong(String maPhong, PhongDto dto) throws DataNotFoundException {

        Phong phong = phongRepository.findById(maPhong)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phòng: " + maPhong));

        DonVi donVi = donViRepository.findById(dto.getMaDonVi())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đơn vị: " + dto.getMaDonVi()));

        phong.setTenPhong(dto.getTenPhong());
        phong.setDonVi(donVi);

       if(dto.getThietBis() != null){
           if(phong.getThietBis() != null){
               phong.getThietBis().forEach(thietBi -> thietBi.setPhong(null));
           }


           List<ThietBi> newThietBi = dto.getThietBis().stream()
                   .map(thietBiDTO -> {
                       ThietBi thietBi = thietBiRepository.findById(thietBiDTO.getMaTB())
                               .orElseThrow(() -> new DataNotFoundException("Không tìm thấy TB có mã:" + thietBiDTO.getMaTB()));
                       thietBi.setPhong(phong);
                       return thietBi;
                   })
                   .collect(Collectors.toList());
           phong.setThietBis(newThietBi);
       }




        return phongRepository.save(phong);
    }

    @Override
    public void deletePhong(String maPhong) throws DataNotFoundException {
        Phong phong = phongRepository.findById(maPhong)
                .orElseThrow(()-> new DataNotFoundException("Không tìm thấy phòng"));
        if(phong.getThietBis() != null){
            phong.getThietBis().forEach(thietBi -> thietBi.setPhong(null));
        }
        phongRepository.delete(phong);

    }

    @Override
    public List<Phong> getAllPhong() {
        return phongRepository.findAll();
    }

    @Override
    public Phong getByMaPhong(String maPhong) throws DataNotFoundException {

        return phongRepository.findById(maPhong)
                .orElseThrow(()-> new DataNotFoundException("Không tìm thấy"));
    }
}
