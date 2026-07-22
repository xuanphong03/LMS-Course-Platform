# Cấu trúc dự án LMS Course Platform

Tài liệu này mô tả cấu trúc source code hiện tại của dự án Next.js. Cây thư mục không mở rộng nội dung của `.git/`, `.next/`, `node_modules/` và các file cache vì đây là dữ liệu được Git hoặc công cụ build tự động tạo ra.

## Cây thư mục

```text
lms-course-platform/
├── app/                                      # Next.js App Router
│   ├── (admin)/                              # Route group dành cho admin
│   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   │   ├── [courseId]/
│   │   │   │   │   └── edit/
│   │   │   │   │       ├── _components/
│   │   │   │   │       │   ├── course-structure/
│   │   │   │   │       │   │   ├── CourseStructureChapter.tsx
│   │   │   │   │       │   │   ├── course-structure.types.ts
│   │   │   │   │       │   │   ├── course-structure.utils.ts
│   │   │   │   │       │   │   └── useCourseStructureReorder.ts
│   │   │   │   │       │   ├── ChapterGroup.tsx
│   │   │   │   │       │   ├── ContentBasicInfo.tsx
│   │   │   │   │       │   ├── ContentCourseStructure.tsx
│   │   │   │   │       │   ├── CourseStructure.tsx
│   │   │   │   │       │   ├── EditCourseForm.tsx
│   │   │   │   │       │   ├── LessonGroup.tsx
│   │   │   │   │       │   ├── SortableItem.tsx
│   │   │   │   │       │   └── index.ts
│   │   │   │   │       ├── _lib/
│   │   │   │   │       │   └── course-structure-order.validation.ts
│   │   │   │   │       ├── actions.ts
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── _components/
│   │   │   │   │   ├── AdminCourseCard.tsx
│   │   │   │   │   └── AdminCourseList.tsx
│   │   │   │   ├── create/
│   │   │   │   │   ├── _components/
│   │   │   │   │   │   └── CourseCreationForm.tsx
│   │   │   │   │   ├── actions.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── data.json
│   │   └── layout.tsx
│   ├── (auth)/                               # Route group xác thực
│   │   ├── login/
│   │   │   ├── _components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignInByEmail.tsx
│   │   │   │   └── SignInByGithub.tsx
│   │   │   └── page.tsx
│   │   ├── verify-request/
│   │   │   ├── _components/
│   │   │   │   └── FormVerifyRequest.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (public)/                             # Route group public
│   │   ├── _components/
│   │   │   ├── FeaturesSection.tsx
│   │   │   └── HeroSection.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── _components/                          # Dành cho component cấp app (đang trống)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts
│   │   └── s3/
│   │       ├── delete/
│   │       │   └── route.ts
│   │       └── upload/
│   │           └── route.ts
│   ├── data/                                 # Server-only data access
│   │   └── admin/
│   │       ├── admin-get-course.ts
│   │       ├── admin-get-courses.ts
│   │       └── require-admin.ts
│   ├── forbidden/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
├── components/                               # Component dùng chung toàn ứng dụng
│   ├── file-uploader/
│   │   ├── RenderEmptyState.tsx
│   │   ├── RenderErrorState.tsx
│   │   ├── RenderUploadedState.tsx
│   │   ├── RenderUploadingState.tsx
│   │   ├── Uploader.tsx
│   │   └── index.ts
│   ├── forms/
│   │   ├── RHFFileUploader.tsx
│   │   ├── RHFInputField.tsx
│   │   ├── RHFSelectField.tsx
│   │   └── RHFTextareaField.tsx
│   ├── rich-text-editor/
│   │   ├── MenuBar.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── menuBarState.ts
│   │   └── styles.css
│   ├── sidebar/
│   │   ├── app-sidebar.tsx
│   │   ├── chart-area-interactive.tsx
│   │   ├── data-table.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-secondary.tsx
│   │   ├── nav-user.tsx
│   │   ├── section-cards.tsx
│   │   └── site-header.tsx
│   └── ui/                                   # UI primitives/shadcn
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── attachment.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── bubble.tsx
│       ├── button-group.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── combobox.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── direction.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── email-template.tsx
│       ├── empty.tsx
│       ├── field.tsx
│       ├── hover-card.tsx
│       ├── input-group.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── item.tsx
│       ├── kbd.tsx
│       ├── label.tsx
│       ├── marker.tsx
│       ├── menubar.tsx
│       ├── message-scroller.tsx
│       ├── message.tsx
│       ├── native-select.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── spinner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── theme-provider.tsx
│       ├── theme-toggle.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── consts/                                   # Route và endpoint constants
│   ├── endpoints.ts
│   └── routes.ts
├── hooks/                                    # Custom hooks/utilities phía client
│   ├── try-catch.ts
│   ├── use-construct.ts
│   ├── use-mobile.ts
│   └── use-signout.ts
├── interfaces/                               # Shared interfaces (đang trống)
├── layouts/                                  # Layout components dùng lại
│   ├── auth/                                 # Đang trống
│   └── public/
│       ├── _components/
│       │   └── UserDropdown.tsx
│       ├── Footer.tsx
│       └── Header.tsx
├── lib/                                      # Infrastructure và shared utilities
│   ├── generated/
│   │   └── prisma/                           # Prisma Client tự động sinh
│   │       ├── internal/
│   │       │   ├── class.ts
│   │       │   ├── prismaNamespace.ts
│   │       │   └── prismaNamespaceBrowser.ts
│   │       ├── models/
│   │       │   ├── Account.ts
│   │       │   ├── Chapter.ts
│   │       │   ├── Course.ts
│   │       │   ├── Lesson.ts
│   │       │   ├── Session.ts
│   │       │   ├── User.ts
│   │       │   └── Verification.ts
│   │       ├── browser.ts
│   │       ├── client.ts
│   │       ├── commonInputTypes.ts
│   │       ├── enums.ts
│   │       └── models.ts
│   ├── S3Client.ts
│   ├── arcjet.ts
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── db.ts
│   ├── env.ts
│   ├── resend.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma                         # Database schema
├── public/
│   └── images/
│       └── logo.svg
├── schemas/                                  # Zod schemas và inferred input types
│   ├── course-form.schema.ts
│   ├── course-structure-order.schema.ts
│   └── file-upload.schema.ts
├── .env                                      # Biến môi trường local, không chia sẻ nội dung
├── .env.local                                # Override biến môi trường local
├── .gitignore
├── .prettierignore
├── .prettierrc
├── AGENTS.md                                 # Quy tắc làm việc cho coding agents
├── CLAUDE.md                                 # Hướng dẫn cho Claude/coding agent
├── README.md
├── components.json                           # Cấu hình shadcn components
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts                             # Next.js tự động sinh
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── skill-coding-agent-workflow.md
├── structure-project.md
├── tsconfig.json
├── tsconfig.tsbuildinfo                      # TypeScript build cache, tự động sinh
├── .git/                                     # Git metadata, không mở rộng
├── .next/                                    # Next.js build output, không mở rộng
└── node_modules/                             # Dependencies, không mở rộng
```

## Quy ước tổ chức chính

- `app/`: route, layout, page, Route Handler và Server Action theo App Router.
- Route group `(admin)`, `(auth)` và `(public)` tổ chức quyền truy cập nhưng không xuất hiện trong URL.
- `_components/`: component chỉ phục vụ route/feature gần nhất.
- `_lib/`: business validation hoặc helper nội bộ của route, không phải API dùng chung toàn dự án.
- `components/`: component tái sử dụng ở nhiều feature; `components/ui/` chứa UI primitives.
- `app/data/`: server-only data-access functions và authorization guards.
- `schemas/`: Zod schema ở application boundary và các TypeScript input type được suy ra từ schema.
- `lib/`: client/server infrastructure như authentication, Prisma, S3, Arcjet, Resend và utility dùng chung.
- `lib/generated/prisma/`: code sinh bởi Prisma; không chỉnh sửa thủ công.
- `prisma/`: schema và cấu hình database.
- `public/`: static assets được phục vụ trực tiếp.

## Quy ước của feature Course Structure

```text
edit/
├── _components/
│   ├── course-structure/                    # Types, pure utilities, hook và presentation
│   ├── ChapterGroup.tsx                     # DnD provider và drag lifecycle
│   ├── LessonGroup.tsx                      # Droppable/sortable lesson list
│   └── SortableItem.tsx                     # Adapter dùng chung cho useSortable
├── _lib/
│   └── course-structure-order.validation.ts # Validation cần đối chiếu database
└── actions.ts                               # Auth, transaction và cache revalidation

schemas/
└── course-structure-order.schema.ts         # Shape validation và inferred payload types
```

Việc tách này giữ UI, persistence queue, schema validation và database validation ở các boundary riêng, giúp feature dễ kiểm thử và bảo trì hơn.
