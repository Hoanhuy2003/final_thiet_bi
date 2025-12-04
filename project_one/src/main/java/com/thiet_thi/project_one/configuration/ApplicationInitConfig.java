package com.thiet_thi.project_one.configuration;

import com.thiet_thi.project_one.models.NguoiDung;
import com.thiet_thi.project_one.models.VaiTro;
import com.thiet_thi.project_one.repositorys.NguoiDungRepository;
import com.thiet_thi.project_one.repositorys.VaiTroRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;
    NguoiDungRepository nguoiDungRepository;
    VaiTroRepository vaiTroRepository;

    @NonFinal
    @Value("${admin.password}")
    protected String adPassword;
    @EventListener(ApplicationReadyEvent.class)
    public void initAdmin() {
        String adminUsername = "admin@gmail.com";
        String adminPassword = passwordEncoder.encode(adPassword);


        if (nguoiDungRepository.findByEmail(adminUsername).isEmpty()) {
            log.info("Tao tk Admin");


            VaiTro adminRole = vaiTroRepository.findByMaVaiTro("ADMIN")
                    .orElseGet(() -> {
                        VaiTro role = VaiTro.builder()
                                .maVaiTro("ADMIN")
                                .tenVaiTro("Quản trị hệ thống")
                                .build();
                        return vaiTroRepository.save(role);
                    });

            NguoiDung adminUser = NguoiDung.builder()
                    .email(adminUsername)
                    .matKhau(adminPassword)
                    .tenND("Admin")
                    .trangThai("HOAT_DONG")
                    .vaiTro(adminRole)
                    .build();

            nguoiDungRepository.save(adminUser);

        } else {
            log.info("Admin da ton tai");
        }
    }
}
