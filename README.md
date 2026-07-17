# MoveWell Reviews

Website review tiếp thị liên kết (affiliate) cho thị trường Mỹ, chuyên 4 mảng:
**Walking Pads & Treadmills · Recovery & Massage · Home Gym & Strength · Wearables & Wellness Tech**.

Kiến trúc: **Astro (static)** — build ra thư mục `dist/` gồm HTML/CSS/JS tĩnh, upload
thẳng lên **Hostinger** (shared hosting, không cần Node server hay database chạy nền).
Form newsletter/liên hệ chạy qua **Formspree**. Code quản lý bằng **GitHub**.

> 📘 **Hướng dẫn deploy chi tiết từng bước: xem [DEPLOY.md](DEPLOY.md).**

---

## Trước khi chạy thật — điền thông tin

Mở **`src/consts.js`** và thay các `[PLACEHOLDER]` trong khối `LEGAL`
(tên công ty/LLC, địa chỉ, bang áp dụng luật, email). Đây là thông tin bắt buộc
cho các trang pháp lý thị trường Mỹ. Xem checklist đầy đủ trong DEPLOY.md.

---

## Cấu trúc dự án

```
src/
  consts.js                    ⭐ Nguồn cấu hình duy nhất: site, LEGAL (placeholder),
                                  HUBS (4 danh mục), navigation, Formspree endpoints
  layouts/
    BaseLayout.astro           Khung trang, SEO meta, schema.org, hệ màu + accent theo hub
    LegalLayout.astro          Khung dùng chung cho các trang pháp lý
  components/                  Header, Footer, ProductCard, ProductRow, ComparisonTable,
                                  StarRating, Newsletter, disclosure bar, cookie banner...
  content/
    config.ts                  Schema cho "products" và "blog" (9 category slug)
    products/*.md               Mỗi file = 1 sản phẩm + review
    blog/*.md                   Mỗi file = 1 bài blog
  pages/
    index.astro                Trang chủ (4 pillar + Top 5 mỗi hub)
    best/[hub].astro            Trang "Best ..." động cho cả 4 hub
    reviews/[slug].astro        Trang review chi tiết
    reviews/index.astro         Tất cả review
    compare.astro               So sánh dạng bảng
    blog/[slug].astro           Bài blog
    go/[slug].astro             Redirect ẩn link affiliate (tĩnh, mỗi sản phẩm 1 file)
    affiliate-disclosure · privacy-policy · terms · editorial-policy ·
    disclaimer · accessibility · do-not-sell · about · contact
public/admin/                  Decap CMS (tùy chọn — cần GitHub OAuth, xem DEPLOY.md)
```

## Nội dung — 4 danh mục (hubs)

Định nghĩa trong `src/consts.js → HUBS`. Mỗi sản phẩm có 1 `category`, gom vào 1 hub:

| Hub (`/best/<slug>`) | Category slug |
|---|---|
| `walking-pads` | `walking-pads`, `treadmills` |
| `recovery` | `massage-guns`, `compression`, `foam-rollers` |
| `strength` | `home-gym`, `strength` |
| `wearables` | `wearables`, `wellness-tech` |

Thêm/sửa sản phẩm: tạo file `.md` trong `src/content/products/`, đặt `published: true`.
Các file `sample-*.md` hiện tại là **bản mẫu (Example)** — thay bằng review thật + link
affiliate thật trước khi launch.

## Chạy thử local

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build & deploy

```bash
npm run build      # tạo thư mục dist/
```

Upload toàn bộ nội dung bên trong `dist/` lên `public_html` của Hostinger.
Chi tiết từng bước (GitHub, Formspree, Hostinger File Manager, SSL, domain) trong
[DEPLOY.md](DEPLOY.md).

## Checklist tuân thủ affiliate thị trường Mỹ

- ✅ **FTC 16 CFR Part 255** — disclosure "clear and conspicuous" ở thanh trên cùng mọi trang, không chỉ footer.
- ✅ Trang riêng `/affiliate-disclosure` có đủ ngôn ngữ bắt buộc của Amazon Associates ("As an Amazon Associate we earn from qualifying purchases").
- ✅ Link affiliate gắn `rel="sponsored nofollow noopener"`, đi qua `/go/<slug>`.
- ✅ Không hard-code giá (theo chính sách Amazon) — dùng "Check current price".
- ✅ `/privacy-policy` (CCPA/CPRA, GDPR, COPPA, các bang khác) · `/do-not-sell` · `/terms` · `/disclaimer` · `/editorial-policy` · `/accessibility`.
- ⚠️ **Các trang pháp lý là bản mẫu, không phải tư vấn pháp lý** — nên có luật sư Mỹ rà soát trước khi chạy traffic thật.
- ⚠️ Amazon Associates: cần đủ đơn hàng hợp lệ trong 180 ngày đầu để giữ tài khoản.

## Việc nên làm tiếp

- Thay toàn bộ sản phẩm mẫu bằng review thật, ảnh thật, link affiliate thật.
- Không copy mô tả từ trang bán hàng (Google phạt nội dung trùng lặp; FTC yêu cầu review phản ánh trải nghiệm thật).
- Thêm Google Analytics 4 hoặc Plausible (nhớ nối vào cookie banner).
- Đăng ký Google Search Console, submit `https://movewellreviews.com/sitemap-index.xml`.
