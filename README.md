# MoveWell Reviews — hướng dẫn triển khai

Kiến trúc: **Astro** + **Sveltia CMS** (giao diện viết bài giống WordPress tại `/admin`) + **Supabase** (chỉ cho dữ liệu thực sự cần "sống": lượt click affiliate, đăng ký newsletter, tin nhắn liên hệ), deploy qua **GitHub → Netlify**.

**Toàn bộ nội dung (sản phẩm, review, blog) được sửa qua `/admin`** — không cần vào Supabase hay viết code/SQL nữa. Nội dung lưu dưới dạng file trong repo GitHub; mỗi lần đăng/sửa bài qua `/admin` sẽ tự tạo 1 commit, Netlify tự build lại trong ~1 phút.

File `_legacy_unrelated_template.html.bak` là file ShopVN cũ (không liên quan) — có thể xoá khi bạn xác nhận không cần nữa.

## 1. Cấu trúc dự án

```
src/
  layouts/BaseLayout.astro     Khung trang, SEO meta, schema.org
  components/                 Header, Footer, ProductCard, ComparisonTable, disclosure, cookie banner...
  content/
    config.ts                  Định nghĩa schema cho "products" và "blog"
    products/*.md               Mỗi file = 1 sản phẩm + review (quản lý qua /admin)
    blog/*.md                   Mỗi file = 1 bài blog (quản lý qua /admin)
  pages/
    index.astro                Trang chủ
    reviews/[slug].astro        Trang review chi tiết 1 sản phẩm
    best/walking-pads.astro     Trang "Best walking pads" (roundup)
    best/recovery-tools.astro   Trang "Best recovery tools"
    compare.astro               So sánh sản phẩm dạng bảng
    blog/[slug].astro           Bài blog
    go/[slug].astro             Redirect ẩn link affiliate + log click vào Supabase
    affiliate-disclosure.astro  privacy-policy.astro  terms.astro  about.astro  contact.astro
public/admin/
  index.html, config.yml       Giao diện CMS (Sveltia CMS) tại movewellreviews.com/admin
supabase/schema.sql            click_events, subscribers, contact_messages (không còn products/reviews)
netlify/functions/
  subscribe.js  Nhận đăng ký newsletter, lưu vào Supabase
  contact.js    Nhận form liên hệ, lưu vào Supabase
```

## 2. Đăng nhập trang Admin (`/admin`) — cần làm 1 lần

CMS xác thực bằng tài khoản GitHub, cần 1 GitHub OAuth App:

1. [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps → New OAuth App**.
   - Homepage URL: `https://movewellreviews.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Copy **Client ID**, bấm **Generate a new client secret** → copy **Client Secret**.
3. Trên Netlify → site → tìm mục **OAuth** (Site configuration, hoặc gõ "OAuth" vào ô Search) → **Install provider** → chọn **GitHub** → dán Client ID + Client Secret → Save.
4. Mở `https://movewellreviews.com/admin` → **Login with GitHub** → cho phép truy cập.

Từ đây, mọi lần vào `/admin` chỉ cần đăng nhập GitHub như bình thường.

## 3. Thêm/sửa sản phẩm & bài blog qua `/admin`

- **Products & Reviews**: đầy đủ các ô — hãng, tên, danh mục (dropdown), ảnh bìa, ảnh phụ, đánh giá sao, thông số kỹ thuật (dạng bảng tên/giá trị, không cần gõ JSON), Pros/Cons (danh sách), link affiliate, mạng affiliate, ô "Testing Methodology" (bắt buộc về mặt tuân thủ — mô tả cách bạn test), ô **SEO** (tiêu đề SEO, mô tả, từ khóa), và **ô soạn thảo đầy đủ định dạng** (in đậm, in nghiêng, tiêu đề, danh sách, chèn ảnh kéo-thả, xem trước) cho nội dung review.
- **Blog Posts**: tương tự — tiêu đề, ảnh bìa, tác giả, ô SEO, và soạn thảo đầy đủ định dạng.
- Cả 2 loại đều có công tắc **Published/Draft** — chỉ hiện lên site thật khi bật.

> Lưu ý theo chính sách Amazon Associates: **không hard-code giá sản phẩm** cố định — giá thay đổi liên tục. Ô "Price note" mặc định "Check current price"; muốn hiển thị giá thời gian thực cần đăng ký Amazon Product Advertising API (PA-API) sau khi tài khoản Associates đủ điều kiện.

## 4. Tạo Supabase project (chỉ cho click tracking / newsletter / contact form)

1. [supabase.com](https://supabase.com) → New project.
2. **SQL Editor** → dán nội dung [`supabase/schema.sql`](supabase/schema.sql) → Run.
3. **Project Settings → API**, lấy:
   - `Project URL` → dùng cho cả `PUBLIC_SUPABASE_URL` và `SUPABASE_URL`
   - `anon public` key → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**không lộ ra frontend/GitHub**, chỉ dùng trong Netlify Functions)
4. Nhập 4 biến này vào Netlify → **Site configuration → Environment variables**.

## 5. Đưa code lên GitHub / Deploy Netlify / Gắn domain

Đã làm xong (repo: movewellreviews-glitch/movewellreviews, domain movewellreviews.com đã trỏ về Netlify). Từ giờ chỉ cần `git push` (hoặc đăng bài qua `/admin`, tự tạo commit) là Netlify tự build & deploy.

## 6. Checklist tuân thủ affiliate thị trường Mỹ

- ✅ **FTC 16 CFR Part 255** — disclosure "clear and conspicuous" ở đầu mọi trang có link affiliate (`AffiliateDisclosure.astro`), không chỉ ở footer.
- ✅ Trang riêng `/affiliate-disclosure`.
- ✅ Link affiliate gắn `rel="sponsored nofollow noopener"`, đi qua `/go/<slug>` (redirect có log, không lộ thẳng link ra HTML).
- ✅ `/privacy-policy` có CCPA/CPRA, GDPR, COPPA.
- ✅ `/terms` giới hạn trách nhiệm.
- ⚠️ **Các trang pháp lý là bản mẫu, không phải tư vấn pháp lý** — nên có luật sư Mỹ rà soát trước khi chạy quảng cáo/traffic thật.
- ⚠️ Amazon Associates: cần 3 đơn hàng hợp lệ trong 180 ngày đầu, nếu không tài khoản bị đóng.

## 7. Chạy thử local

```bash
npm install
cp .env.example .env   # điền giá trị Supabase thật (chỉ cần cho /go, newsletter, contact form)
npm run dev
```

`/admin` sẽ không đăng nhập được khi chạy local (CMS cần domain thật đã cấu hình OAuth) — muốn thử soạn bài, tạo/sửa file trực tiếp trong `src/content/products/` hoặc `src/content/blog/` rồi xem qua `npm run dev`.

## 8. Việc cần làm tiếp theo

- Viết nội dung thật cho sản phẩm mẫu (`src/content/products/deerrun-q2-urban-walking-pad.md`, đang `published: false`) qua `/admin`, hoặc thêm sản phẩm mới.
- Không copy mô tả từ trang bán hàng — Google phạt nội dung trùng lặp, và FTC yêu cầu review phản ánh trải nghiệm thật.
- Cân nhắc thêm Google Analytics 4 hoặc Plausible.
- Đăng ký Google Search Console, submit sitemap (`https://movewellreviews.com/sitemap-index.xml`).
