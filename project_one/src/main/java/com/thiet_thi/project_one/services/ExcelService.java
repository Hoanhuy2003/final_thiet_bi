package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.responses.DeXuatMuaResponse;
import com.thiet_thi.project_one.responses.KiemKeResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelService {

    public byte[] exportThietBiToExcel(List<ThietBi> listThietBi) throws IOException {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Danh sách thiết bị");

            // --- 1. ĐỊNH NGHĨA HEADER (ĐẦY ĐỦ CÁC CỘT) ---
            String[] columns = {
                    "STT",
                    "Mã thiết bị",
                    "Tên thiết bị",
                    "Số Serial",
                    "Thông số kỹ thuật",
                    "Loại thiết bị",
                    "Phòng/Vị trí",
                    "Ngày nhập",
                    "Giá trị gốc (VNĐ)",
                    "Giá trị còn lại (VNĐ)",
                    "Tình trạng"
            };

            // --- 2. STYLE CHO EXCEL (ĐỂ ĐẸP HƠN) ---

            // Font in đậm cho Header
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
            headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Style định dạng tiền tệ (VD: 10.000.000)
            CellStyle currencyStyle = workbook.createCellStyle();
            DataFormat format = workbook.createDataFormat();
            currencyStyle.setDataFormat(format.getFormat("#,##0"));

            // Style căn giữa
            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            // --- 3. VẼ DÒNG HEADER ---
            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(25); // Chiều cao dòng header
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerCellStyle);
            }

            // --- 4. ĐỔ DỮ LIỆU ---
            int rowIdx = 1;
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (ThietBi tb : listThietBi) {
                Row row = sheet.createRow(rowIdx++);

                // Cột 0: STT
                Cell cellStt = row.createCell(0);
                cellStt.setCellValue(rowIdx - 1);
                cellStt.setCellStyle(centerStyle);

                // Cột 1: Mã TB
                row.createCell(1).setCellValue(tb.getMaTB());

                // Cột 2: Tên TB
                row.createCell(2).setCellValue(tb.getTenTB());

                // Cột 3: Serial (Check null)
                row.createCell(3).setCellValue(tb.getSoSeri() != null ? tb.getSoSeri() : "");

                // Cột 4: Thông số (Check null)
                row.createCell(4).setCellValue(tb.getThongSoKyThuat() != null ? tb.getThongSoKyThuat() : "");

                // Cột 5: Loại
                String tenLoai = (tb.getLoaiThietBi() != null) ? tb.getLoaiThietBi().getTenLoai() : "Chưa phân loại";
                row.createCell(5).setCellValue(tenLoai);

                // Cột 6: Phòng
                String tenPhong = (tb.getPhong() != null) ? tb.getPhong().getTenPhong() : "Kho chung";
                row.createCell(6).setCellValue(tenPhong);

                // Cột 7: Ngày nhập
                String ngayNhap = (tb.getNgaySuDung() != null) ? tb.getNgaySuDung().format(dateFormatter) : "";
                Cell cellDate = row.createCell(7);
                cellDate.setCellValue(ngayNhap);
                cellDate.setCellStyle(centerStyle);

                // Cột 8: Giá trị gốc
                Cell cellGiaGoc = row.createCell(8);
                double giaGoc = (tb.getGiaTriBanDau() != null) ? tb.getGiaTriBanDau().doubleValue() : 0;
                cellGiaGoc.setCellValue(giaGoc);
                cellGiaGoc.setCellStyle(currencyStyle); // Áp dụng định dạng số

                // Cột 9: Giá trị còn lại
                Cell cellGiaConLai = row.createCell(9);
                double giaConLai = (tb.getGiaTriHienTai() != null) ? tb.getGiaTriHienTai().doubleValue() : 0;
                cellGiaConLai.setCellValue(giaConLai);
                cellGiaConLai.setCellStyle(currencyStyle); // Áp dụng định dạng số

                // Cột 10: Tình trạng
                row.createCell(10).setCellValue(tb.getTinhTrang());
            }

            // --- 5. TỰ ĐỘNG GIÃN CỘT ---
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportThanhLyToExcel(List<PhieuThanhLy> list) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Phiếu Thanh Lý");

            // --- 1. ĐỊNH NGHĨA CỘT ---
            String[] cols = {
                    "STT",
                    "Mã phiếu",
                    "Người lập",
                    "Ngày lập",
                    "Tổng số thiết bị",
                    "Tổng giá trị thu về (VNĐ)",
                    "Trạng thái"
            };

            // --- 2. TẠO STYLE (ĐẸP) ---
            // Header Font
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            // Header Style
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex()); // Màu xanh lá cho khác với Thiết bị
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
            headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Style tiền tệ (#,##0)
            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
            currencyStyle.setAlignment(HorizontalAlignment.RIGHT);

            // Style căn giữa (cho ngày tháng, STT)
            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            // --- 3. VẼ HEADER ---
            Row header = sheet.createRow(0);
            header.setHeightInPoints(25);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerCellStyle);
            }

            // --- 4. ĐỔ DỮ LIỆU ---
            int rowIdx = 1;
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (PhieuThanhLy p : list) {
                Row row = sheet.createRow(rowIdx++);

                // 0. STT
                Cell cellStt = row.createCell(0);
                cellStt.setCellValue(rowIdx - 1);
                cellStt.setCellStyle(centerStyle);

                // 1. Mã phiếu
                row.createCell(1).setCellValue(p.getMaPhieuThanhLy());

                String tenNguoiLap = "";
                if (p.getNguoiLap() != null) {
                    // Ưu tiên lấy Họ tên đầy đủ, nếu không có thì lấy Tên đăng nhập
                    tenNguoiLap = p.getNguoiLap().getTenND() != null
                            ? p.getNguoiLap().getTenND()
                            : p.getNguoiLap().getTenND();
                } else {
                    tenNguoiLap = "Không rõ người tạo";
                }

                row.createCell(2).setCellValue(tenNguoiLap);

                // 3. Ngày lập
                String ngayLap = (p.getNgayLap() != null) ? p.getNgayLap().format(dateFormatter) : "";
                Cell cellDate = row.createCell(3);
                cellDate.setCellValue(ngayLap);
                cellDate.setCellStyle(centerStyle);

                // 4. Tổng thiết bị (Lấy size của list chi tiết)
                int tongTB = (p.getChiTiet() != null) ? p.getChiTiet().size() : 0;
                Cell cellSl = row.createCell(4);
                cellSl.setCellValue(tongTB);
                cellSl.setCellStyle(centerStyle);

                // 5. Tổng tiền thu về
                Cell cellTien = row.createCell(5);
                double tien = (p.getTongGiaTriThuVe() != null) ? p.getTongGiaTriThuVe().doubleValue() : 0;
                cellTien.setCellValue(tien);
                cellTien.setCellStyle(currencyStyle);

                // 6. Trạng thái
                row.createCell(6).setCellValue(p.getTrangThai());
            }

            // --- 5. TỰ ĐỘNG GIÃN CỘT ---
            for (int i = 0; i < cols.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportBienBanThanhLy(PhieuThanhLy p) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Biên Bản Thanh Lý");

            // ==========================================
            // 1. KHỞI TẠO STYLE (ĐỂ FILE EXCEL ĐẸP)
            // ==========================================

            // Font in đậm
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);

            // Font tiêu đề lớn
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setColor(IndexedColors.DARK_BLUE.getIndex());

            // Style Tiêu đề chính (To, Giữa)
            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            // Style Header Bảng (Nền xám, Viền, In đậm)
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(boldFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Style Dữ liệu thường (Có viền)
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Style Căn giữa (Có viền - cho STT, Mã)
            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.cloneStyleFrom(dataStyle);
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Style Tiền tệ (Có viền, định dạng #,##0)
            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.cloneStyleFrom(dataStyle);
            currencyStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
            currencyStyle.setAlignment(HorizontalAlignment.RIGHT);

            // Style Tổng cộng (In đậm, Căn phải)
            CellStyle totalStyle = workbook.createCellStyle();
            totalStyle.cloneStyleFrom(currencyStyle);
            totalStyle.setFont(boldFont);

            // ==========================================
            // 2. VẼ NỘI DUNG
            // ==========================================

            // --- DÒNG 0: TIÊU ĐỀ LỚN ---
            Row rowTitle = sheet.createRow(0);
            Cell cellTitle = rowTitle.createCell(0);
            cellTitle.setCellValue("BIÊN BẢN THANH LÝ TÀI SẢN");
            cellTitle.setCellStyle(titleStyle);
            // Gộp ô từ cột A đến F (0 -> 5) cho dòng tiêu đề
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

            // --- DÒNG 1: MÃ PHIẾU ---
            Row rowSubTitle = sheet.createRow(1);
            Cell cellSub = rowSubTitle.createCell(0);
            cellSub.setCellValue("Số phiếu: " + p.getMaPhieuThanhLy());
            CellStyle centerNoBorderStyle = workbook.createCellStyle();
            centerNoBorderStyle.setAlignment(HorizontalAlignment.CENTER);
            cellSub.setCellStyle(centerNoBorderStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 5));


            String nguoiLap = (p.getNguoiLap() != null)
                    ? (p.getNguoiLap().getTenND() != null ? p.getNguoiLap().getTenND() : p.getNguoiLap().getTenND())
                    : "Không rõ";

            sheet.createRow(3).createCell(0).setCellValue("Người lập phiếu: " + nguoiLap);

            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String ngayLap = (p.getNgayLap() != null) ? p.getNgayLap().format(df) : "";
            sheet.createRow(4).createCell(0).setCellValue("Ngày lập: " + ngayLap);

            sheet.createRow(5).createCell(0).setCellValue("Lý do thanh lý: " + (p.getLyDoThanhLy() != null ? p.getLyDoThanhLy() : ""));

            // --- DÒNG 7: HEADER BẢNG ---
            int rowIdx = 7;
            Row header = sheet.createRow(rowIdx++);
            String[] cols = {"STT", "Mã TB", "Tên thiết bị", "Nguyên giá", "Giá trị còn lại", "Giá thanh lý"};

            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            // --- DỮ LIỆU CHI TIẾT ---
            int stt = 1;
            // Lưu ý: Đảm bảo Entity của bạn là getChiTiet() hoặc getChiTietThanhLy()
            for (var ct : p.getChiTiet()) {
                Row row = sheet.createRow(rowIdx++);

                // 0. STT
                Cell c0 = row.createCell(0);
                c0.setCellValue(stt++);
                c0.setCellStyle(centerStyle);

                // 1. Mã TB
                Cell c1 = row.createCell(1);
                c1.setCellValue(ct.getThietBi().getMaTB());
                c1.setCellStyle(centerStyle);

                // 2. Tên TB
                Cell c2 = row.createCell(2);
                c2.setCellValue(ct.getThietBi().getTenTB());
                c2.setCellStyle(dataStyle);

                // 3. Nguyên giá
                Cell c3 = row.createCell(3);
                double nguyenGia = (ct.getNguyenGia() != null) ? ct.getNguyenGia().doubleValue() : 0;
                c3.setCellValue(nguyenGia);
                c3.setCellStyle(currencyStyle);

                // 4. Giá trị còn lại
                Cell c4 = row.createCell(4);
                double conLai = (ct.getGiaTriConLai() != null) ? ct.getGiaTriConLai().doubleValue() : 0;
                c4.setCellValue(conLai);
                c4.setCellStyle(currencyStyle);

                // 5. Giá thanh lý (Thu về)
                Cell c5 = row.createCell(5);
                double thuVe = (ct.getGiaTriThuVe() != null) ? ct.getGiaTriThuVe().doubleValue() : 0;
                c5.setCellValue(thuVe);
                c5.setCellStyle(currencyStyle);
            }

            // --- DÒNG TỔNG CỘNG ---
            Row rowTotal = sheet.createRow(rowIdx);

            // Merge các ô phía trước chữ "Tổng cộng"
            Cell cellTotalLabel = rowTotal.createCell(0);
            cellTotalLabel.setCellValue("TỔNG CỘNG THU VỀ:");
            CellStyle labelStyle = workbook.createCellStyle();
            labelStyle.cloneStyleFrom(dataStyle);
            labelStyle.setFont(boldFont);
            labelStyle.setAlignment(HorizontalAlignment.RIGHT);
            cellTotalLabel.setCellStyle(labelStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 4)); // Merge A->E

            // Vẽ viền cho các ô bị merge (nếu cần kỹ tính)
            for (int i = 1; i <= 4; i++) {
                rowTotal.createCell(i).setCellStyle(dataStyle);
            }

            // Giá trị tổng
            Cell cellTotalVal = rowTotal.createCell(5);
            double tongTien = (p.getTongGiaTriThuVe() != null) ? p.getTongGiaTriThuVe().doubleValue() : 0;
            cellTotalVal.setCellValue(tongTien);
            cellTotalVal.setCellStyle(totalStyle);

            // --- AUTOSIZE CỘT ---
            for (int i = 0; i < cols.length; i++) {
                sheet.autoSizeColumn(i);
            }
            // Riêng cột Tên thiết bị (index 2) nên rộng hơn chút
            sheet.setColumnWidth(2, 8000);

            workbook.write(out);
            return out.toByteArray();
        }
    }
    public byte[] exportLoThietBiToExcel(List<LoThietBi> list) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Danh sách Lô");

            // --- STYLE HEADER ---
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // --- HEADER ---
            String[] cols = {
                    "STT", "Mã lô", "Tên lô", "Loại thiết bị", "Số lượng",
                    "Đơn giá", "Tổng tiền", "Ngày nhập", "Nhà cung cấp", "Trạng thái"
            };

            Row header = sheet.createRow(0);
            header.setHeightInPoints(25);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            // --- DATA ---
            int rowIdx = 1;
            int stt = 1;

            // Format tiền và ngày
            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));

            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (LoThietBi lo : list) {
                Row row = sheet.createRow(rowIdx++);

                // 0. STT
                Cell c0 = row.createCell(0);
                c0.setCellValue(stt++);
                c0.setCellStyle(centerStyle);

                // 1. Mã lô (Check null)
                row.createCell(1).setCellValue(lo.getMaLo() != null ? lo.getMaLo() : "");

                // 2. Tên lô (Check null)
                row.createCell(2).setCellValue(lo.getTenLo() != null ? lo.getTenLo() : "");

                // 3. Loại TB (Check null sâu)
                String loai = "";
                if (lo.getLoaiThietBi() != null && lo.getLoaiThietBi().getTenLoai() != null) {
                    loai = lo.getLoaiThietBi().getTenLoai();
                }
                row.createCell(3).setCellValue(loai);

                // 4. Số lượng (FIX LỖI NULL)
                // Nếu getSoLuong() trả về null thì lấy 0
                int soLuong = (lo.getSoLuong() != null) ? lo.getSoLuong() : 0;
                Cell c4 = row.createCell(4);
                c4.setCellValue(soLuong);
                c4.setCellStyle(centerStyle);

                // 5. Đơn giá (FIX LỖI NULL POINTER)
                // Nếu getDonGia() null thì lấy 0
                double donGia = (lo.getDonGia() != null) ? lo.getDonGia().doubleValue() : 0;
                Cell c5 = row.createCell(5);
                c5.setCellValue(donGia);
                c5.setCellStyle(currencyStyle);

                // 6. Tổng tiền (TỰ TÍNH: Số lượng * Đơn giá)
                double tong = soLuong * donGia;
                Cell c6 = row.createCell(6);
                c6.setCellValue(tong);
                c6.setCellStyle(currencyStyle);

                // 7. Ngày nhập
                String ngay = (lo.getNgayNhap() != null) ? lo.getNgayNhap().format(df) : "";
                Cell c7 = row.createCell(7);
                c7.setCellValue(ngay);
                c7.setCellStyle(centerStyle);

                // 8. NCC (Kiểm tra lại tên getter: getTen hay getTenNhaCungCap?)
                // Mình sửa thành getTenNhaCungCap() cho chuẩn các bài trước
                String ncc = "";
                if (lo.getNhaCungCap() != null) {
                    // Cẩn thận: Kiểm tra Entity xem getter là getTen() hay getTenNhaCungCap()
                    ncc = (lo.getNhaCungCap().getTen() != null)
                            ? lo.getNhaCungCap().getTen()
                            : "";
                }
                row.createCell(8).setCellValue(ncc);

                // 9. Trạng thái (Check null)
                String status = "Khác";
                if (lo.getTrangThai() != null) {
                    status = (lo.getTrangThai() == 0) ? "Mới nhập" : (lo.getTrangThai() == 1 ? "Đã tạo tài sản" : "Khác");
                }
                row.createCell(9).setCellValue(status);
            }

            // Auto size
            for (int i = 0; i < cols.length; i++) sheet.autoSizeColumn(i);

            workbook.write(out);
            return out.toByteArray();
        }
    }
    // Nhớ sửa tham số đầu vào là List<KiemKeResponse>
    public byte[] exportKiemKeToExcel(List<KiemKeResponse> list) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Danh sách Kiểm Kê");

            // --- STYLE ---
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_TEAL.getIndex()); // Đổi màu cho đẹp
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            // --- HEADER ---
            String[] cols = {
                    "STT", "Mã phiếu", "Phòng", "Người kiểm kê", "Ngày kiểm",
                    "Tổng TB", "Tồn tại", "Mất", "Hỏng", "Tỷ lệ đạt", "Trạng thái"
            };

            Row header = sheet.createRow(0);
            header.setHeightInPoints(25);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            // --- DATA ---
            int rowIdx = 1;
            int stt = 1;
            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (KiemKeResponse kk : list) {
                Row row = sheet.createRow(rowIdx++);

                // 0. STT
                Cell c0 = row.createCell(0);
                c0.setCellValue(stt++);
                c0.setCellStyle(centerStyle);

                // 1. Mã phiếu (Check null)
                row.createCell(1).setCellValue(kk.getMaKiemKe() != null ? kk.getMaKiemKe() : "");

                // 2. Phòng (Check null)
                row.createCell(2).setCellValue(kk.getTenPhong() != null ? kk.getTenPhong() : "");

                // 3. Người kiểm kê (Check null)
                row.createCell(3).setCellValue(kk.getTenNguoiKiemKe() != null ? kk.getTenNguoiKiemKe() : "");

                // 4. Ngày kiểm kê (Check null)
                String ngay = (kk.getNgayKiemKe() != null) ? kk.getNgayKiemKe().format(df) : "";
                Cell c4 = row.createCell(4);
                c4.setCellValue(ngay);
                c4.setCellStyle(centerStyle);

                // 5. Tổng thiết bị (int primitve thì không null, nhưng wrapper Integer thì có thể)
                // Giả sử trong Response bạn để int thì OK, nếu Integer thì phải check
                row.createCell(5).setCellValue(kk.getTongSoLuong());

                // 6. Tồn tại
                row.createCell(6).setCellValue(kk.getTonTai());

                // 7. Mất
                row.createCell(7).setCellValue(kk.getMat());

                // 8. Hỏng
                row.createCell(8).setCellValue(kk.getHong());

                // 9. Tỷ lệ đạt (Check null)
                row.createCell(9).setCellValue(kk.getTyLeDat() != null ? kk.getTyLeDat() : "0%");

                // 10. Trạng thái (Check null)
                row.createCell(10).setCellValue(kk.getTrangThai() != null ? kk.getTrangThai() : "");
            }

            for (int i = 0; i < cols.length; i++) sheet.autoSizeColumn(i);
            workbook.write(out);
            return out.toByteArray();
        }
    }
    public byte[] exportBienBanKiemKe(KiemKeResponse kk) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Biên Bản Kiểm Kê");

            // ==========================================
            // 1. KHỞI TẠO STYLE (ĐỂ FILE EXCEL ĐẸP)
            // ==========================================

            // Font chung
            Font fontBold = workbook.createFont();
            fontBold.setBold(true);

            // Font tiêu đề lớn
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setColor(IndexedColors.DARK_BLUE.getIndex());

            // Style Tiêu đề chính (To, Giữa)
            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            // Style Thông tin chung (In đậm label)
            CellStyle labelStyle = workbook.createCellStyle();
            labelStyle.setFont(fontBold);

            // Style Header Bảng (Nền xanh, Viền, In đậm, Chữ trắng)
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Style Dữ liệu thường (Có viền)
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Style Căn giữa (Có viền - cho STT, Mã)
            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.cloneStyleFrom(dataStyle);
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            // ==========================================
            // 2. VẼ NỘI DUNG
            // ==========================================

            // --- DÒNG 0: TIÊU ĐỀ LỚN ---
            Row rowTitle = sheet.createRow(0);
            Cell cellTitle = rowTitle.createCell(0);
            cellTitle.setCellValue("BIÊN BẢN KIỂM KÊ TÀI SẢN");
            cellTitle.setCellStyle(titleStyle);
            // Gộp ô từ cột A đến G (0 -> 6) cho dòng tiêu đề
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            // --- DÒNG 2-6: THÔNG TIN CHUNG ---
            int rowInfo = 2;
            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            // Mã phiếu
            Row r2 = sheet.createRow(rowInfo++);
            Cell l2 = r2.createCell(0); l2.setCellValue("Mã phiếu:"); l2.setCellStyle(labelStyle);
            r2.createCell(1).setCellValue(kk.getMaKiemKe());

            // Phòng
            Row r3 = sheet.createRow(rowInfo++);
            Cell l3 = r3.createCell(0); l3.setCellValue("Phòng/Đơn vị:"); l3.setCellStyle(labelStyle);
            r3.createCell(1).setCellValue(kk.getTenPhong() != null ? kk.getTenPhong() : "");

            // Người kiểm
            Row r4 = sheet.createRow(rowInfo++);
            Cell l4 = r4.createCell(0); l4.setCellValue("Người kiểm kê:"); l4.setCellStyle(labelStyle);
            r4.createCell(1).setCellValue(kk.getTenNguoiKiemKe() != null ? kk.getTenNguoiKiemKe() : "");

            // Ngày kiểm
            Row r5 = sheet.createRow(rowInfo++);
            Cell l5 = r5.createCell(0); l5.setCellValue("Ngày thực hiện:"); l5.setCellStyle(labelStyle);
            String ngayStr = (kk.getNgayKiemKe() != null) ? kk.getNgayKiemKe().format(df) : "";
            r5.createCell(1).setCellValue(ngayStr);

            // Ghi chú chung
            Row r6 = sheet.createRow(rowInfo++);
            Cell l6 = r6.createCell(0); l6.setCellValue("Ghi chú phiếu:"); l6.setCellStyle(labelStyle);
            r6.createCell(1).setCellValue(kk.getGhiChu() != null ? kk.getGhiChu() : "");

            // --- DÒNG 8: HEADER BẢNG CHI TIẾT ---
            int rowIdx = 8;
            Row header = sheet.createRow(rowIdx++);
            // Các cột: STT, Mã TB, Tên TB, Loại, TT Hệ thống, TT Thực tế, Ghi chú
            String[] cols = {"STT", "Mã TB", "Tên thiết bị", "Loại thiết bị", "TT Hệ thống", "TT Thực tế", "Ghi chú"};

            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            // --- DỮ LIỆU CHI TIẾT ---
            int stt = 1;
            if (kk.getChiTiet() != null) {
                for (KiemKeResponse.ChiTietKiemKeResponse ct : kk.getChiTiet()) {
                    Row row = sheet.createRow(rowIdx++);

                    // 0. STT
                    Cell c0 = row.createCell(0); c0.setCellValue(stt++); c0.setCellStyle(centerStyle);

                    // 1. Mã TB
                    Cell c1 = row.createCell(1); c1.setCellValue(ct.getMaTB()); c1.setCellStyle(centerStyle);

                    // 2. Tên TB
                    Cell c2 = row.createCell(2); c2.setCellValue(ct.getTenTB()); c2.setCellStyle(dataStyle);

                    // 3. Loại TB
                    Cell c3 = row.createCell(3);
                    c3.setCellValue(ct.getTenLoai() != null ? ct.getTenLoai() : "");
                    c3.setCellStyle(dataStyle);

                    // 4. Tình trạng hệ thống (Trước kiểm kê)
                    Cell c4 = row.createCell(4);
                    c4.setCellValue(ct.getTinhTrangHeThong());
                    c4.setCellStyle(centerStyle);

                    // 5. Tình trạng thực tế (Sau kiểm kê)
                    Cell c5 = row.createCell(5);
                    c5.setCellValue(ct.getTinhTrangThucTe());
                    // Tô màu chữ nếu khác thường (Optional)
                    c5.setCellStyle(centerStyle);

                    // 6. Ghi chú
                    Cell c6 = row.createCell(6);
                    c6.setCellValue(ct.getGhiChu() != null ? ct.getGhiChu() : "");
                    c6.setCellStyle(dataStyle);
                }
            } else {
                // Nếu không có chi tiết, tạo 1 dòng trống
                sheet.createRow(rowIdx++);
            }

            // --- PHẦN TỔNG KẾT (FOOTER) ---
            rowIdx++; // Cách 1 dòng

            Row rowTotal = sheet.createRow(rowIdx++);
            Cell cellSumLabel = rowTotal.createCell(1);
            cellSumLabel.setCellValue("THỐNG KÊ KẾT QUẢ:");
            cellSumLabel.setCellStyle(labelStyle);

            Row rowStat1 = sheet.createRow(rowIdx++);
            rowStat1.createCell(1).setCellValue("Tổng thiết bị:");
            rowStat1.createCell(2).setCellValue(kk.getTongSoLuong());

            Row rowStat2 = sheet.createRow(rowIdx++);
            rowStat2.createCell(1).setCellValue("Tồn tại (Tốt):");
            rowStat2.createCell(2).setCellValue(kk.getTonTai());

            Row rowStat3 = sheet.createRow(rowIdx++);
            rowStat3.createCell(1).setCellValue("Mất / Thất lạc:");
            rowStat3.createCell(2).setCellValue(kk.getMat());

            Row rowStat4 = sheet.createRow(rowIdx++);
            rowStat4.createCell(1).setCellValue("Hỏng hóc:");
            rowStat4.createCell(2).setCellValue(kk.getHong());

            Row rowStat5 = sheet.createRow(rowIdx++);
            rowStat5.createCell(1).setCellValue("Tỷ lệ đạt:");
            rowStat5.createCell(2).setCellValue(kk.getTyLeDat());

            // --- AUTOSIZE CỘT ---
            for (int i = 0; i < cols.length; i++) {
                sheet.autoSizeColumn(i);
            }
            // Chỉnh lại cột Tên thiết bị (index 2) cho rộng rãi hơn chút
            sheet.setColumnWidth(2, 8000);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportDeXuatMuaToExcel(List<DeXuatMuaResponse> list) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Danh sách Đề Xuất");

            // --- STYLE ---
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_RED.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));

            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            // --- HEADER ---
            String[] cols = {
                    "STT", "Mã đề xuất", "Tiêu đề", "Phòng/Đơn vị",
                    "Ngày tạo", "Người đề xuất", "Tổng tiền (VNĐ)", "Trạng thái"
            };

            Row header = sheet.createRow(0);
            header.setHeightInPoints(25);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            // --- DATA ---
            int rowIdx = 1;
            int stt = 1;
            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (DeXuatMuaResponse dx : list) {
                Row row = sheet.createRow(rowIdx++);

                // 0. STT
                Cell c0 = row.createCell(0); c0.setCellValue(stt++); c0.setCellStyle(centerStyle);

                // 1. Mã
                row.createCell(1).setCellValue(dx.getMaDeXuat());

                // 2. Tiêu đề
                row.createCell(2).setCellValue(dx.getTieuDe());

                // 3. Phòng (Đã được xử lý null trong hàm from() rồi)
                row.createCell(3).setCellValue(dx.getTenPhong());

                // 4. Ngày tạo
                String ngay = (dx.getNgayTao() != null) ? dx.getNgayTao().format(df) : "";
                Cell c4 = row.createCell(4); c4.setCellValue(ngay); c4.setCellStyle(centerStyle);

                // 5. Người tạo
                row.createCell(5).setCellValue(dx.getTenNguoiTao());

                // 6. Tổng tiền (Lấy giá trị đã tính toán trong Response)
                double tien = (dx.getTongTien() != null) ? dx.getTongTien().doubleValue() : 0;
                Cell c6 = row.createCell(6);
                c6.setCellValue(tien);
                c6.setCellStyle(currencyStyle);

                // 7. Trạng thái
                row.createCell(7).setCellValue(dx.getTrangThai());
            }

            for (int i = 0; i < cols.length; i++) sheet.autoSizeColumn(i);
            workbook.write(out);
            return out.toByteArray();
        }
    }
}