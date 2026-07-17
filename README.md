# MoveWell Reviews — hướng dẫn triển khai

Site đã được viết lại hoàn toàn: **Astro (SSR)** + **Supabase** (database) + **Netlify Functions**, deploy qua **GitHub → Netlify**. Không còn dữ liệu hard-code trong HTML — sản phẩm, review, blog đều lấy từ Supabase, bạn thêm/sửa nội dung ngay trong Supabase dashboard mà không cần đụng code.

File `_legacy_unrelated_template.html.bak` là file ShopVN cũ (không liên quan) — có thể xoá khi bạn xác nhận không cần nữa.

## 1. Cấu trúc dự án

```
src/
  layouts/BaseLayout.astro     Khung trang, SEO meta, schema.org
  components/                 Header, Footer, ProductCard, ComparisonTable, disclosure, cookie banner...
  pages/
    index.astro                Trang chủ
    reviews/[slug].astro        Trang review chi tiết 1 sản phẩm (SSR động)
    best/walking-pads.astro     Trang "Best walking pads" (roundup)
    best/recovery-tools.astro   Trang "Best recovery tools"
    compare.astro               So sánh sản phẩm dạng bảng
    blog/[slug].astro           Bài viết blog/hướng dẫn mua hàng
    affiliate-disclosure.astro  privacy-policy.astro  terms.astro  about.astro  contact.astro
supabase/schema.sql            Toàn bộ schema + dữ liệu mẫu (placeholder, is_published=false)
netlify/functions/
  go.js         Redirect ẩn link affiliate: /go/<affiliate_slug> → link thật + log click
  subscribe.js  Nhận đăng ký newsletter, lưu vào Supabase
  contact.js    Nhận form liên hệ, lưu vào Supabase
```

## 2. Tạo Supabase project (database)

1. Vào [supabase.com](https://supabase.com) → New project (free tier là đủ để bắt đầu).
2. Vào **SQL Editor** → New query → dán toàn bộ nội dung [`supabase/schema.sql`](supabase/schema.sql) → Run.
   - Việc này tạo các bảng: `categories`, `products`, `reviews`, `blog_posts`, `click_events`, `subscribers`, `contact_messages`, kèm Row Level Security (khách chỉ đọc được nội dung có `is_published = true`).
3. Vào **Project Settings → API**, lấy 4 giá trị:
   - `Project URL` → dùng cho cả `PUBLIC_SUPABASE_URL` và `SUPABASE_URL`
   - `anon public` key → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**tuyệt đối không lộ ra frontend/GitHub**, chỉ dùng trong Netlify Functions)

## 3. Thêm sản phẩm / bài review (không cần code)

Vào Supabase → **Table Editor**:

- **products**: thêm 1 dòng cho mỗi sản phẩm (walking pad, massage gun...). Điền `affiliate_url` là link affiliate thật (Amazon Associates, ShareASale, Impact...), đặt `affiliate_slug` duy nhất (vd. `amazon-walkingpad-x1`), và **chỉ bật `is_published = true` khi nội dung đã sẵn sàng** — trước đó sản phẩm sẽ không hiển thị trên site.
- **reviews**: 1 dòng ứng với mỗi `product_id`, chứa nội dung review dài (`body_html`) và **`testing_methodology`** — phần này quan trọng để tuân thủ hướng dẫn FTC (phải nói rõ bạn đã test sản phẩm như thế nào).
- **blog_posts**: bài hướng dẫn mua hàng (top-of-funnel SEO).

> Lưu ý theo chính sách Amazon Associates: **không hard-code giá sản phẩm** lâu dài trên site — giá thay đổi liên tục và Amazon cấm hiển thị giá cache/lỗi thời. Trường `price_note` mặc định là "Check current price" — nếu muốn hiển thị giá thật theo thời gian thực, bạn cần đăng ký Amazon Product Advertising API (PA-API) sau khi tài khoản Associates có đủ giao dịch đủ điều kiện.

## 4. Đưa code lên GitHub

```bash
cd "C:\Users\hoangle\New folder"
git init
git add .
git commit -m "Initial dynamic MoveWell Reviews site"
git branch -M main
git remote add origin https://github.com/<your-username>/movewellreviews.git
git push -u origin main
```

## 5. Deploy lên Netlify

1. Netlify → **Add new site → Import an existing project** → chọn repo GitHub vừa tạo.
2. Build command: `npm run build`, Publish directory: `dist` (đã cấu hình sẵn trong `netlify.toml`).
3. Vào **Site settings → Environment variables**, thêm 4 biến giống `.env.example`:
   `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy. Mỗi lần bạn `git push`, Netlify tự build & deploy lại (đây là phần "động" bạn cần — không phải sửa file tĩnh thủ công nữa).

## 6. Gắn domain đã có sẵn

Netlify → **Domain management → Add a domain** → nhập `movewellreviews.com` → làm theo hướng dẫn trỏ DNS (thường là thêm bản ghi `A`/`ALIAS` về Netlify hoặc đổi nameserver). Netlify tự cấp SSL miễn phí (Let's Encrypt).

## 7. Checklist tuân thủ affiliate thị trường Mỹ (đã dựng sẵn, bạn cần rà lại nội dung thật)

- ✅ **FTC 16 CFR Part 255** — disclosure "clear and conspicuous" hiển thị ngay đầu mọi trang có link affiliate (component `AffiliateDisclosure.astro`), không chỉ giấu ở footer.
- ✅ Trang riêng `/affiliate-disclosure` giải thích cách kiếm tiền, các chương trình tham gia (Amazon Associates, ShareASale, Impact, CJ...).
- ✅ Link affiliate gắn `rel="sponsored nofollow noopener"` (đúng khuyến nghị Google/Amazon) và đi qua `/go/<slug>` (redirect có log, không lộ thẳng link affiliate ra HTML).
- ✅ `/privacy-policy` có phần CCPA/CPRA (quyền của người California) và ghi chú GDPR, COPPA (không nhắm tới trẻ em dưới 13).
- ✅ Cookie consent banner tối giản (Accept/Decline) — nếu bạn chỉ dùng analytics không cookie (vd. Plausible) thì có thể bỏ banner này.
- ✅ `/terms` giới hạn trách nhiệm, nói rõ giá/specs có thể thay đổi theo nhà bán.
- ⚠️ **Các trang Privacy Policy/Terms/Affiliate Disclosure là bản mẫu, không phải tư vấn pháp lý** — nên có luật sư Mỹ rà soát trước khi chạy quảng cáo/traffic thật, đặc biệt nếu sau này dùng thêm ad network (Mediavine, AdThrive...) vì họ yêu cầu điều khoản riêng.
- ⚠️ Khi đăng ký **Amazon Associates**: cần đạt 3 đơn hàng hợp lệ trong 180 ngày đầu, nếu không tài khoản bị đóng — nên có traffic thật trước khi đăng ký, và ghi đúng disclosure text theo yêu cầu của Amazon (đã có sẵn trong `src/consts.js` → `DISCLOSURE_SHORT`, có thể chỉnh).

## 8. Chạy thử local

```bash
npm install
cp .env.example .env   # rồi điền giá trị Supabase thật
npm run dev
```

## 9. Việc cần làm tiếp theo

- Thay toàn bộ nội dung mẫu (`example-walking-pad-1` trong `schema.sql`) bằng sản phẩm thật, ảnh thật, link affiliate thật.
- Viết review thật cho từng sản phẩm (không copy mô tả từ trang bán hàng — Google phạt nội dung trùng lặp, và FTC yêu cầu review phản ánh trải nghiệm thật).
- Cân nhắc thêm Google Analytics 4 hoặc Plausible (privacy-friendly, không cần cookie banner).
- Đăng ký Google Search Console, submit sitemap (`https://movewellreviews.com/sitemap-index.xml`, tự sinh bởi `@astrojs/sitemap`).
