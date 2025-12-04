package com.thiet_thi.project_one.services;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.thiet_thi.project_one.dtos.AuthenticationDTO;
import com.thiet_thi.project_one.dtos.IntrospectDTO;
import com.thiet_thi.project_one.dtos.RegisterDTO;
import com.thiet_thi.project_one.exceptions.AppException;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.exceptions.ErrorCode;
import com.thiet_thi.project_one.models.InvalidatedToken;
import com.thiet_thi.project_one.models.NguoiDung;
import com.thiet_thi.project_one.repositorys.DonViRepository;
import com.thiet_thi.project_one.repositorys.InvalidatedTokenRepository;
import com.thiet_thi.project_one.repositorys.NguoiDungRepository;
import com.thiet_thi.project_one.repositorys.VaiTroRepository;
import com.thiet_thi.project_one.responses.AuthenticationResponse;
import com.thiet_thi.project_one.responses.DonViResponse;
import com.thiet_thi.project_one.responses.IntrospectResponse;
import com.thiet_thi.project_one.responses.NguoiDungResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    private final VaiTroRepository vaiTroRepository;
    NguoiDungRepository nguoiDungRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    DonViRepository donViRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;


    public AuthenticationResponse authenticationResponse(AuthenticationDTO dto) {
        var user = nguoiDungRepository.findByEmail(dto.getUserName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // KIỂM TRA TRẠNG THÁI TÀI KHOẢN
        if (!"HOAT_DONG".equals(user.getTrangThai())) {
            if ("CHO_DUYET".equals(user.getTrangThai())) {
                throw new AppException(ErrorCode.USER_NOT_APPROVED); // "Tài khoản đang chờ duyệt"
            }
            throw new AppException(ErrorCode.USER_BLOCKED); // "Tài khoản đã bị khóa"
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean passwordMatches = passwordEncoder.matches(dto.getPassword(), user.getMatKhau());
        if (!passwordMatches) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var accessToken = generateAccessToken(user);
        var refreshToken = generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    // ==================== GENERATE ACCESS TOKEN ====================
    public String generateAccessToken(NguoiDung nguoiDung) {
        return generateToken(nguoiDung, VALID_DURATION, "access");
    }

    // ==================== GENERATE REFRESH TOKEN ====================
    public String generateRefreshToken(NguoiDung nguoiDung) {
        return generateToken(nguoiDung, REFRESHABLE_DURATION, "refresh");
    }

    // ==================== GENERATE TOKEN CHUNG ====================
    private String generateToken(NguoiDung nguoiDung, long duration, String type) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(nguoiDung.getEmail())
                .issuer("ok")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(duration, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(nguoiDung))
                .claim("type", type)
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Không thể tạo token", e);
            throw new RuntimeException(e);
        }
    }


    private String buildScope(NguoiDung nguoiDung) {
        StringJoiner joiner = new StringJoiner(" ");
        if (nguoiDung.getVaiTro() != null) {
            joiner.add("ROLE_" + nguoiDung.getVaiTro().getMaVaiTro());

        }
        return joiner.toString();
    }


    public IntrospectResponse introspectResponse(IntrospectDTO dto) throws JOSEException, ParseException {
        try {
            verifyToken(dto.getToken(), false);
            return IntrospectResponse.builder().valid(true).build();
        } catch (AppException e) {
            return IntrospectResponse.builder().valid(false).build();
        }
    }


    public SignedJWT verifyToken(String token, boolean allowExpiredForRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = allowExpiredForRefresh
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        boolean verified = signedJWT.verify(verifier);
        if (!verified || !expiryTime.after(new Date())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        if (invalidatedTokenRepository.existsById(jti)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }


    public void logout(String token) throws ParseException, JOSEException {
        try {
            var signedJWT = verifyToken(token, false);
            String jti = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();

            invalidatedTokenRepository.save(InvalidatedToken.builder()
                    .id(jti)
                    .expiryTime(expiry)
                    .build());
        } catch (AppException e) {
            log.info("Token đã hết hạn hoặc không hợp lệ: {}", e.getMessage());
        }
    }


    public AuthenticationResponse refreshToken(String refreshToken) throws ParseException, JOSEException {

        var signedJWT = verifyToken(refreshToken, true);

        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();


        invalidatedTokenRepository.save(InvalidatedToken.builder()
                .id(jti)
                .expiryTime(expiry)
                .build());

        String username = signedJWT.getJWTClaimsSet().getSubject();
        var user = nguoiDungRepository.findByEmail(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));


        var newAccessToken = generateAccessToken(user);
        var newRefreshToken = generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .authenticated(true)
                .build();
    }


    public long getRefreshableDuration() {
        return REFRESHABLE_DURATION;
    }


    public AuthenticationResponse register(RegisterDTO dto) {
        if (nguoiDungRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        var donVi = donViRepository.findById(dto.getMaDonVi())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        var newUser = NguoiDung.builder()
                .tenND(dto.getTenND())
                .email(dto.getEmail())
                .matKhau(passwordEncoder.encode(dto.getMatKhau()))
                .donVi(donVi)
                .vaiTro(vaiTroRepository.findByMaVaiTro("GIANGVIEN")
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED)))

                .trangThai("CHO_DUYET")
                .build();

        nguoiDungRepository.save(newUser);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(null)
                .build();
    }

}