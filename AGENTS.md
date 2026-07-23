# Project Coding Rules

## Mandatory Workflow

- Trước khi phân tích, review, chỉnh sửa code hoặc chạy lệnh, phải đọc lại toàn bộ `AGENTS.md`.
- Xem `AGENTS.md` là nguồn quy tắc cấp dự án và ưu tiên áp dụng trong toàn bộ workspace.

## Next.js Rules

<!-- BEGIN:nextjs-agent-rules -->

Phiên bản Next.js của dự án có các breaking change về API, convention và cấu trúc file. Trước khi viết code Next.js, phải đọc hướng dẫn liên quan trong `node_modules/next/dist/docs/` và tuân theo các deprecation notice.

<!-- END:nextjs-agent-rules -->

## Code Comment Rules

- Chú thích phải giải thích TẠI SAO, không phải CÁI GÌ.
- Không chú thích những đoạn mã hiển nhiên.
- Ưu tiên giải thích logic nghiệp vụ, các quyết định kiến ​​trúc, các ràng buộc và sự đánh đổi.

## JSDoc Rules

Sử dụng JSDoc cho:

- Các hàm được xuất khẩu
- Các hành động phía máy chủ
- Các Hook
- Các tiện ích phức tạp

Ví dụ:

```ts
/**
 * Tạo một bài học mới.
 *
 * Luồng:
 * Xác thực đầu vào → Kiểm tra quyền → Cập nhật cơ sở dữ liệu → Xác thực lại bộ nhớ cache.
 */
```

## Comment Style

Ưu tiên:

// Giữ serverItems làm nguồn thông tin chính xác.
// draftItems chỉ tồn tại trong các tương tác lạc quan.

Tránh:

// Đặt các mục
setItems(items)

## React / Next.js Rules

- Giải thích lý do tại sao một component là Client Component.
- Giải thích các quyết định về bộ nhớ cache.
- Giải thích sự đồng bộ hóa giữa dữ liệu máy chủ và trạng thái máy khách.

## Trước khi thêm comment:

Hãy tự hỏi:
"Liệu một lập trình viên khác có hiểu được quyết định này mà không cần comment này không?"

Nếu câu trả lời là có, thì đừng thêm comment.
