# Iron Pulse Manager 백엔드 도메인 설계

## 1. 개요

Iron Pulse Manager는 헬스장 운영을 위한 종합 관리 시스템입니다. 이 문서는 Java + Spring Boot 기반 백엔드 도메인 설계를 통해 데이터베이스 스키마, API 설계, 비즈니스 로직의 기초를 제공합니다.

### 1.1 기술 스택
- **Backend Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL (Primary), Redis (Cache)
- **ORM**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Gradle
- **Documentation**: SpringDoc OpenAPI 3
- **Testing**: JUnit 5, Testcontainers, MockMvc
- **Monitoring**: Spring Boot Actuator, Micrometer
- **Message Queue**: Spring AMQP (RabbitMQ)

## 2. 도메인 모델

### 2.1 핵심 엔티티 (Core Entities)

#### User (사용자)
```java
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password; // BCrypt 암호화
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}

public enum UserRole {
    OWNER, TRAINER, STAFF
}
```

#### Gym (헬스장)
```java
@Entity
@Table(name = "gyms")
@EntityListeners(AuditingEntityListener.class)
public class Gym {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String email;
    
    @Column(name = "business_number", unique = true, nullable = false)
    private String businessNumber;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @Embedded
    private GymSettings settings;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL)
    private List<Member> members = new ArrayList<>();
    
    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL)
    private List<User> staff = new ArrayList<>();
    
    // constructors, getters, setters
}

@Embeddable
public class GymSettings {
    @Embedded
    private OperatingHours operatingHours;
    
    @ElementCollection
    @CollectionTable(name = "gym_holidays")
    @Column(name = "holiday")
    private Set<String> holidays = new HashSet<>();
    
    @Embedded
    private LockerSettings lockerSettings;
    
    // getters, setters
}

@Embeddable
public class OperatingHours {
    @Column(name = "open_time")
    private LocalTime openTime;
    
    @Column(name = "close_time")
    private LocalTime closeTime;
    
    // getters, setters
}

@Embeddable
public class LockerSettings {
    @Column(name = "total_locker_count")
    private Integer totalCount;
    
    @Column(name = "locker_price_per_month")
    private BigDecimal pricePerMonth;
    
    // getters, setters
}
```

#### Member (회원)
```java
@Entity
@Table(name = "members", indexes = {
    @Index(name = "idx_member_phone", columnList = "phone"),
    @Index(name = "idx_member_gym", columnList = "gym_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "member_number", unique = true, nullable = false)
    private String memberNumber;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;
    
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;
    
    @Column(nullable = false)
    private String phone;
    
    private String email;
    
    private String address;
    
    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "has_app", nullable = false)
    private Boolean hasApp = false;
    
    @Column(name = "join_path")
    private String joinPath;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Pass> passes = new ArrayList<>();
    
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Attendance> attendances = new ArrayList<>();
    
    // constructors, getters, setters
}

public enum Gender {
    MALE, FEMALE
}
```

#### Product (상품)
```java
@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductType type;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @Embedded
    private ProductAttributes attributes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}

public enum ProductType {
    MEMBERSHIP, LESSON, LOCKER, DAY_PASS, OTHER
}

@Embeddable
public class ProductAttributes {
    @Column(name = "duration_days")
    private Integer duration; // 이용기간 (일)
    
    @Column(name = "pt_sessions")
    private Integer sessions; // 개인 레슨 세션 수
    
    @Column(name = "locker_duration_days")
    private Integer lockerDuration; // 락커 이용기간 (일)
    
    // getters, setters
}
```

#### Pass (이용권)
```java
@Entity
@Table(name = "passes", indexes = {
    @Index(name = "idx_pass_member", columnList = "member_id"),
    @Index(name = "idx_pass_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
public class Pass {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PassStatus status;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount;
    
    @Column(name = "remaining_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingAmount;
    
    // PT 관련 필드
    @Column(name = "total_sessions")
    private Integer totalSessions;
    
    @Column(name = "used_sessions")
    private Integer usedSessions = 0;
    
    @Column(name = "remaining_sessions")
    private Integer remainingSessions;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private User trainer;
    
    @OneToMany(mappedBy = "pass", cascade = CascadeType.ALL)
    private List<PassSuspension> suspensions = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultant_id", nullable = false)
    private User consultant;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}

public enum PassStatus {
    ACTIVE, EXPIRED, SUSPENDED
}

public enum PaymentMethod {
    CASH, CARD, TRANSFER, MOBILE
}

@Entity
@Table(name = "pass_suspensions")
@EntityListeners(AuditingEntityListener.class)
public class PassSuspension {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pass_id", nullable = false)
    private Pass pass;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false)
    private String reason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    // constructors, getters, setters
}
```

#### Locker (락커)
```java
@Entity
@Table(name = "lockers")
@EntityListeners(AuditingEntityListener.class)
public class Locker {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String number; // 락커 번호
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LockerStatus status;
    
    // 현재 사용자 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_member_id")
    private Member currentMember;
    
    @Column(name = "current_start_date")
    private LocalDate currentStartDate;
    
    @Column(name = "current_end_date")
    private LocalDate currentEndDate;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}

public enum LockerStatus {
    AVAILABLE, OCCUPIED, OUT_OF_ORDER
}
```

#### Attendance (출석)
```java
@Entity
@Table(name = "attendance", indexes = {
    @Index(name = "idx_attendance_member_date", columnList = "member_id, attendance_date"),
    @Index(name = "idx_attendance_gym_date", columnList = "gym_id, attendance_date")
})
@EntityListeners(AuditingEntityListener.class)
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @Column(name = "attendance_date", nullable = false)
    private LocalDate date;
    
    @Column(name = "check_in_time", nullable = false)
    private LocalDateTime checkInTime;
    
    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceType type;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}

public enum AttendanceType {
    MEMBERSHIP, DAY_PASS, LESSON
}
```

#### Schedule (일정)
```java
@Entity
@Table(name = "schedules", indexes = {
    @Index(name = "idx_schedule_date", columnList = "schedule_date")
})
@EntityListeners(AuditingEntityListener.class)
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String title;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleType type;
    
    @Column(name = "schedule_date", nullable = false)
    private LocalDate date;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(nullable = false)
    private Integer duration; // 소요시간 (분)
    
    // 관련 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member; // PT의 경우 회원
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private User trainer; // 담당 트레이너
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}

public enum ScheduleType {
    LESSON, GROUP_CLASS, MAINTENANCE, EVENT
}
```

#### Payment (결제 내역)
```java
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_member", columnList = "member_id"),
    @Index(name = "idx_payment_date", columnList = "payment_date")
})
@EntityListeners(AuditingEntityListener.class)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pass_id")
    private Pass pass; // 이용권과 연관된 결제
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false)
    private String description;
    
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by", nullable = false)
    private User processedBy;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}

public enum PaymentType {
    MEMBERSHIP, LESSON, LOCKER, DAY_PASS, PENALTY, REFUND
}
```

#### Post (게시글 - 커뮤니티)
```java
@Entity
@Table(name = "posts")
@EntityListeners(AuditingEntityListener.class)
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType type;
    
    @Column(name = "author_id", nullable = false)
    private UUID authorId; // 작성자 ID (회원 또는 직원)
    
    @Enumerated(EnumType.STRING)
    @Column(name = "author_type", nullable = false)
    private AuthorType authorType;
    
    // 통계
    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;
    
    @Column(name = "like_count", nullable = false)
    private Long likeCount = 0L;
    
    @Column(name = "comment_count", nullable = false)
    private Long commentCount = 0L;
    
    // 이미지
    @ElementCollection
    @CollectionTable(name = "post_images")
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();
    
    // 중고거래 전용
    @Embedded
    private MarketItem marketItem;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
    
    // constructors, getters, setters
}

public enum PostType {
    NOTICE, FREE, MARKET
}

public enum AuthorType {
    MEMBER, STAFF
}

@Embeddable
public class MarketItem {
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    private MarketStatus status;
    
    private String category;
    
    private String location;
    
    // getters, setters
}

public enum MarketStatus {
    SELLING, SOLD, RESERVED
}
```

#### Comment (댓글)
```java
@Entity
@Table(name = "comments")
@EntityListeners(AuditingEntityListener.class)
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
    
    @Column(name = "author_id", nullable = false)
    private UUID authorId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "author_type", nullable = false)
    private AuthorType authorType;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent; // 대댓글의 경우 부모 댓글
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // constructors, getters, setters
}
```

## 3. 데이터베이스 관계

### 3.1 주요 관계
- **Gym** 1:N **User** (한 헬스장에 여러 직원)
- **Gym** 1:N **Member** (한 헬스장에 여러 회원)
- **Gym** 1:N **Product** (한 헬스장에 여러 상품)
- **Member** 1:N **Pass** (한 회원이 여러 이용권 보유 가능)
- **Product** 1:N **Pass** (한 상품으로 여러 이용권 생성 가능)
- **Member** 1:N **Attendance** (한 회원의 여러 출석 기록)
- **User(Trainer)** 1:N **Pass** (한 트레이너가 여러 PT 담당)
- **Member** 1:1 **Locker** (한 회원이 하나의 락커 사용)

### 3.2 인덱스 전략
```sql
-- JPA @Index 애노테이션으로 관리되는 인덱스들
-- 자주 조회되는 필드들에 대한 인덱스
CREATE INDEX idx_member_gym_id ON members(gym_id);
CREATE INDEX idx_member_phone ON members(phone);
CREATE INDEX idx_pass_member_id ON passes(member_id);
CREATE INDEX idx_pass_status ON passes(status);
CREATE INDEX idx_attendance_member_date ON attendance(member_id, attendance_date);
CREATE INDEX idx_attendance_gym_date ON attendance(gym_id, attendance_date);
CREATE INDEX idx_payment_member_id ON payments(member_id);
CREATE INDEX idx_schedule_date ON schedules(schedule_date);

-- 복합 인덱스
CREATE INDEX idx_pass_member_status ON passes(member_id, status);
CREATE INDEX idx_attendance_member_date_type ON attendance(member_id, attendance_date, type);
```

## 4. API 설계

### 4.1 Spring Boot REST API 구조

#### 패키지 구조
```
com.ironpulse.manager
├── IronPulseManagerApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── JpaConfig.java
│   ├── RedisConfig.java
│   └── OpenApiConfig.java
├── domain/
│   ├── user/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   └── controller/
│   ├── member/
│   ├── product/
│   ├── pass/
│   └── gym/
├── global/
│   ├── common/
│   ├── exception/
│   ├── security/
│   └── util/
└── infrastructure/
    ├── redis/
    └── external/
```

#### 인증 (Authentication)
```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // 로그인 처리
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        // 로그아웃 처리
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        // 토큰 갱신
    }
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        // 현재 사용자 정보 조회
    }
}
```

#### 회원 관리 (Members)
```java
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")
public class MemberController {
    
    @GetMapping
    public ResponseEntity<Page<MemberResponse>> getMembers(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        // 회원 목록 조회 (페이징, 검색, 필터링)
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MemberDetailResponse> getMember(@PathVariable UUID id) {
        // 회원 상세 조회
    }
    
    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<MemberResponse> createMember(@Valid @RequestBody CreateMemberRequest request) {
        // 회원 등록
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<MemberResponse> updateMember(
            @PathVariable UUID id, 
            @Valid @RequestBody UpdateMemberRequest request) {
        // 회원 정보 수정
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteMember(@PathVariable UUID id) {
        // 회원 삭제 (비활성화)
    }
    
    @GetMapping("/{id}/passes")
    public ResponseEntity<List<PassResponse>> getMemberPasses(@PathVariable UUID id) {
        // 회원 이용권 목록
    }
    
    @GetMapping("/{id}/attendance")
    public ResponseEntity<Page<AttendanceResponse>> getMemberAttendance(
            @PathVariable UUID id,
            @PageableDefault(size = 30) Pageable pageable,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        // 회원 출석 기록
    }
    
    @GetMapping("/{id}/payments")
    public ResponseEntity<Page<PaymentResponse>> getMemberPayments(
            @PathVariable UUID id,
            @PageableDefault(size = 20) Pageable pageable) {
        // 회원 결제 내역
    }
}
```

### 4.2 에러 처리
```java
// 글로벌 예외 처리
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentValidException e) {
        List<String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("VALIDATION_FAILED")
                .message("입력값 검증에 실패했습니다.")
                .details(errors)
                .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException e) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("ENTITY_NOT_FOUND")
                .message(e.getMessage())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("ACCESS_DENIED")
                .message("접근 권한이 없습니다.")
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception e) {
        log.error("Unexpected error occurred", e);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("INTERNAL_SERVER_ERROR")
                .message("서버 내부 오류가 발생했습니다.")
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

@Data
@Builder
public class ErrorResponse {
    private String code;
    private String message;
    private Object details;
    private LocalDateTime timestamp = LocalDateTime.now();
}
```

## 5. 비즈니스 로직

### 5.1 Service Layer 구조
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PassService {
    
    private final PassRepository passRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public PassResponse createPass(CreatePassRequest request) {
        // 이용권 생성 로직
        Pass pass = Pass.builder()
                .member(memberRepository.findById(request.getMemberId())
                        .orElseThrow(() -> new EntityNotFoundException("Member not found")))
                .product(productRepository.findById(request.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found")))
                .startDate(request.getStartDate())
                .endDate(calculateEndDate(request))
                .status(PassStatus.ACTIVE)
                .build();
        
        return PassResponse.from(passRepository.save(pass));
    }
    
    @Transactional
    public void suspendPass(UUID passId, SuspendPassRequest request) {
        Pass pass = passRepository.findById(passId)
                .orElseThrow(() -> new EntityNotFoundException("Pass not found"));
        
        // 정지 기간만큼 만료일 연장
        long suspensionDays = ChronoUnit.DAYS.between(
                request.getStartDate(), request.getEndDate());
        pass.setEndDate(pass.getEndDate().plusDays(suspensionDays));
        
        // 정지 기록 추가
        PassSuspension suspension = PassSuspension.builder()
                .pass(pass)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .createdBy(getCurrentUser())
                .build();
        
        pass.getSuspensions().add(suspension);
        pass.setStatus(PassStatus.SUSPENDED);
        
        passRepository.save(pass);
    }
}

// 스케줄러를 통한 배치 처리
@Component
@RequiredArgsConstructor
@Slf4j
public class PassScheduler {
    
    private final PassService passService;
    private final NotificationService notificationService;
    
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정 실행
    @Transactional
    public void processExpiredPasses() {
        log.info("Processing expired passes...");
        
        List<Pass> expiredPasses = passService.findExpiredPasses();
        
        for (Pass pass : expiredPasses) {
            pass.setStatus(PassStatus.EXPIRED);
            notificationService.sendExpirationNotice(pass.getMember());
        }
        
        log.info("Processed {} expired passes", expiredPasses.size());
    }
    
    @Scheduled(cron = "0 0 9 * * ?") // 매일 오전 9시 실행
    public void sendExpirationWarnings() {
        log.info("Sending expiration warnings...");
        
        List<Pass> soonToExpirePasses = passService.findSoonToExpirePasses(7); // 7일 이내 만료
        
        for (Pass pass : soonToExpirePasses) {
            notificationService.sendExpirationWarning(pass.getMember(), pass);
        }
        
        log.info("Sent expiration warnings to {} members", soonToExpirePasses.size());
    }
}
```

### 5.2 출석률 계산 서비스
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    
    public AttendanceStatsResponse calculateAttendanceRate(UUID memberId, Period period) {
        LocalDate startDate = period.getStartDate();
        LocalDate endDate = period.getEndDate();
        
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        long attendanceDays = attendanceRepository.countByMemberIdAndDateBetween(
                memberId, startDate, endDate);
        
        double attendanceRate = (double) attendanceDays / totalDays * 100;
        
        return AttendanceStatsResponse.builder()
                .totalDays(totalDays)
                .attendanceDays(attendanceDays)
                .attendanceRate(attendanceRate)
                .period(period)
                .build();
    }
    
    @Transactional
    public AttendanceResponse checkIn(UUID memberId, AttendanceType type) {
        // 중복 체크인 방지
        boolean alreadyCheckedIn = attendanceRepository.existsByMemberIdAndDate(
                memberId, LocalDate.now());
        
        if (alreadyCheckedIn) {
            throw new BusinessException("이미 오늘 출석 체크가 완료되었습니다.");
        }
        
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        
        // 유효한 이용권 확인
        if (type == AttendanceType.MEMBERSHIP) {
            validateMembershipPass(member);
        }
        
        Attendance attendance = Attendance.builder()
                .member(member)
                .gym(member.getGym())
                .date(LocalDate.now())
                .checkInTime(LocalDateTime.now())
                .type(type)
                .build();
        
        return AttendanceResponse.from(attendanceRepository.save(attendance));
    }
    
    private void validateMembershipPass(Member member) {
        boolean hasValidPass = member.getPasses().stream()
                .anyMatch(pass -> pass.getStatus() == PassStatus.ACTIVE 
                        && pass.getEndDate().isAfter(LocalDate.now())
                        && pass.getProduct().getType() == ProductType.MEMBERSHIP);
        
        if (!hasValidPass) {
            throw new BusinessException("유효한 회원권이 없습니다.");
        }
    }
}
```

## 6. 보안 고려사항

### 6.1 Spring Security 설정
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)
            )
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/login", "/api/auth/refresh").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/members/**").hasRole("STAFF")
                .requestMatchers(HttpMethod.POST, "/api/members").hasRole("STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/members/**").hasRole("STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/members/**").hasRole("OWNER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// JWT 인증 필터
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String token = resolveToken(request);
        
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### 6.2 데이터 보안
```java
// 개인정보 암호화를 위한 JPA Converter
@Converter
@Component
public class EncryptionConverter implements AttributeConverter<String, String> {
    
    @Value("${app.encryption.key}")
    private String encryptionKey;
    
    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }
        return encrypt(attribute);
    }
    
    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return decrypt(dbData);
    }
    
    private String encrypt(String data) {
        // AES 암호화 구현
    }
    
    private String decrypt(String encryptedData) {
        // AES 복호화 구현
    }
}

// 민감 정보 필드에 적용
@Entity
public class Member {
    @Convert(converter = EncryptionConverter.class)
    private String phone;
    
    @Convert(converter = EncryptionConverter.class)
    private String email;
    
    @Convert(converter = EncryptionConverter.class)
    private String address;
    
    // 기타 필드들...
}

// 감사 로그
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String action;
    private String entityType;
    private String entityId;
    private String userId;
    private String ipAddress;
    private LocalDateTime timestamp;
    
    // getters, setters
}
```

### 6.3 API 보안
```java
// Rate Limiting 설정
@Configuration
public class RateLimitConfig {
    
    @Bean
    public RedisRateLimiter rateLimiter() {
        return new RedisRateLimiter(10, 20, Duration.ofMinutes(1)); // 1분당 10개 요청, 버스트 20개
    }
}

// 요청 유효성 검증
@Valid
public class CreateMemberRequest {
    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 50, message = "이름은 50자를 초과할 수 없습니다.")
    private String name;
    
    @NotNull(message = "성별은 필수입니다.")
    private Gender gender;
    
    @NotNull(message = "생년월일은 필수입니다.")
    @Past(message = "생년월일은 과거 날짜여야 합니다.")
    private LocalDate birthDate;
    
    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(regexp = "^\\d{3}-\\d{4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다.")
    private String phone;
    
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;
    
    // getters, setters
}
```

## 7. 성능 최적화

### 7.1 데이터베이스 최적화
```java
// 쿼리 최적화를 위한 Repository 구현
@Repository
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {
    
    private final JPAQueryFactory queryFactory;
    
    @Override
    public Page<MemberResponse> findMembersWithFilters(MemberSearchCondition condition, Pageable pageable) {
        List<MemberResponse> content = queryFactory
                .select(Projections.constructor(MemberResponse.class,
                        member.id,
                        member.memberNumber,
                        member.name,
                        member.phone,
                        member.joinDate,
                        member.isActive))
                .from(member)
                .where(
                        nameContains(condition.getName()),
                        phoneContains(condition.getPhone()),
                        isActiveEq(condition.getIsActive()),
                        gymIdEq(condition.getGymId())
                )
                .orderBy(member.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        
        JPAQuery<Long> countQuery = queryFactory
                .select(member.count())
                .from(member)
                .where(
                        nameContains(condition.getName()),
                        phoneContains(condition.getPhone()),
                        isActiveEq(condition.getIsActive()),
                        gymIdEq(condition.getGymId())
                );
        
        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }
    
    private BooleanExpression nameContains(String name) {
        return hasText(name) ? member.name.contains(name) : null;
    }
    
    private BooleanExpression phoneContains(String phone) {
        return hasText(phone) ? member.phone.contains(phone) : null;
    }
    
    private BooleanExpression isActiveEq(Boolean isActive) {
        return isActive != null ? member.isActive.eq(isActive) : null;
    }
    
    private BooleanExpression gymIdEq(UUID gymId) {
        return gymId != null ? member.gym.id.eq(gymId) : null;
    }
}

// 캐싱 전략
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StatisticsService {
    
    private final MemberRepository memberRepository;
    private final AttendanceRepository attendanceRepository;
    
    @Cacheable(value = "dashboard-stats", key = "#gymId + '_' + #date")
    public DashboardStatsResponse getDashboardStats(UUID gymId, LocalDate date) {
        // 대시보드 통계 조회 (캐시 적용)
        long totalMembers = memberRepository.countByGymIdAndIsActive(gymId, true);
        long todayAttendance = attendanceRepository.countByGymIdAndDate(gymId, date);
        BigDecimal todayRevenue = calculateTodayRevenue(gymId, date);
        
        return DashboardStatsResponse.builder()
                .totalMembers(totalMembers)
                .todayAttendance(todayAttendance)
                .todayRevenue(todayRevenue)
                .build();
    }
    
    @CacheEvict(value = "dashboard-stats", key = "#gymId + '_' + T(java.time.LocalDate).now()")
    public void evictDashboardStatsCache(UUID gymId) {
        // 캐시 무효화
    }
}

// 커넥션 풀 설정
@Configuration
public class DatabaseConfig {
    
    @Bean
    @ConfigurationProperties("spring.datasource.hikari")
    public HikariConfig hikariConfig() {
        HikariConfig config = new HikariConfig();
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        return config;
    }
    
    @Bean
    public DataSource dataSource() {
        return new HikariDataSource(hikariConfig());
    }
}
```

### 7.2 비동기 처리
```java
// 비동기 설정
@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

// 비동기 서비스
@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final EmailService emailService;
    private final SmsService smsService;
    
    @Async("taskExecutor")
    public CompletableFuture<Void> sendExpirationNotice(Member member) {
        try {
            // 이메일 발송
            if (member.getEmail() != null) {
                emailService.sendExpirationNotice(member.getEmail(), member.getName());
            }
            
            // SMS 발송
            smsService.sendExpirationNotice(member.getPhone(), member.getName());
            
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }
    
    @Async("taskExecutor")
    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public CompletableFuture<Void> sendBulkNotifications(List<Member> members, String message) {
        // 대량 알림 발송
        members.parallelStream().forEach(member -> {
            try {
                smsService.sendMessage(member.getPhone(), message);
            } catch (Exception e) {
                log.error("Failed to send notification to member: {}", member.getId(), e);
            }
        });
        
        return CompletableFuture.completedFuture(null);
    }
}
```

## 8. 모니터링 및 로깅

### 8.1 Spring Boot Actuator 설정
```java
// application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

// Custom Health Indicator
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                        .withDetail("database", "Available")
                        .withDetail("validationQuery", "SELECT 1")
                        .build();
            }
        } catch (Exception e) {
            return Health.down()
                    .withDetail("database", "Unavailable")
                    .withException(e)
                    .build();
        }
        
        return Health.down().withDetail("database", "Unavailable").build();
    }
}

// Custom Metrics
@Component
@RequiredArgsConstructor
public class BusinessMetrics {
    
    private final MeterRegistry meterRegistry;
    private final MemberService memberService;
    private final PaymentService paymentService;
    
    @EventListener
    public void handleMemberCreated(MemberCreatedEvent event) {
        Counter.builder("member.created")
                .description("Number of members created")
                .tag("gym", event.getGymId().toString())
                .register(meterRegistry)
                .increment();
    }
    
    @EventListener
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        Counter.builder("payment.completed")
                .description("Number of payments completed")
                .tag("type", event.getPaymentType().toString())
                .tag("method", event.getPaymentMethod().toString())
                .register(meterRegistry)
                .increment();
        
        Gauge.builder("payment.amount")
                .description("Payment amount")
                .tag("type", event.getPaymentType().toString())
                .register(meterRegistry, event.getAmount());
    }
    
    @Scheduled(fixedRate = 60000) // 1분마다 실행
    public void recordBusinessMetrics() {
        // 활성 회원 수
        Gauge.builder("members.active.count")
                .description("Number of active members")
                .register(meterRegistry, memberService::getActiveMemberCount);
        
        // 오늘 매출
        Gauge.builder("revenue.today")
                .description("Today's revenue")
                .register(meterRegistry, () -> paymentService.getTodayRevenue().doubleValue());
    }
}
```

### 8.2 구조화된 로깅
```java
// 로그백 설정 (logback-spring.xml)
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    
    <property name="LOG_FILE" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}/}iron-pulse.log}"/>
    
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp/>
                <version/>
                <logLevel/>
                <loggerName/>
                <mdc/>
                <message/>
                <stackTrace/>
            </providers>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_FILE}</file>
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp/>
                <version/>
                <logLevel/>
                <loggerName/>
                <mdc/>
                <message/>
                <stackTrace/>
            </providers>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>10MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>

// AOP를 통한 API 로깅
@Aspect
@Component
@Slf4j
public class ApiLoggingAspect {
    
    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    public Object logApiCall(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        // 요청 정보 로깅
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        
        MDC.put("method", request.getMethod());
        MDC.put("uri", request.getRequestURI());
        MDC.put("ip", getClientIpAddress(request));
        MDC.put("userAgent", request.getHeader("User-Agent"));
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("API call completed - {}.{} - Duration: {}ms", 
                    className, methodName, duration);
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            
            log.error("API call failed - {}.{} - Duration: {}ms - Error: {}", 
                    className, methodName, duration, e.getMessage(), e);
            
            throw e;
        } finally {
            MDC.clear();
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
```

## 9. 확장성 고려사항

### 9.1 다중 헬스장 지원 (Multi-Tenancy)
```java
// 테넌트 식별자 관리
@Component
public class TenantContext {
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();
    
    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }
    
    public static String getCurrentTenant() {
        return currentTenant.get();
    }
    
    public static void clear() {
        currentTenant.remove();
    }
}

// 테넌트 필터
@Component
public class TenantFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String gymId = httpRequest.getHeader("X-Gym-Id");
        
        if (gymId != null) {
            TenantContext.setCurrentTenant(gymId);
        }
        
        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}

// 테넌트별 데이터 접근 제어
@Entity
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = "string"))
@Filter(name = "tenantFilter", condition = "gym_id = :tenantId")
public class Member {
    // 엔티티 정의...
}

// Repository에서 테넌트 필터 적용
@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    
    @Query("SELECT m FROM Member m WHERE m.gym.id = :#{T(com.ironpulse.manager.global.tenant.TenantContext).getCurrentTenant()}")
    List<Member> findAllByCurrentTenant();
}

// 테넌트 인터셉터
@Component
@RequiredArgsConstructor
public class TenantInterceptor implements HandlerInterceptor {
    
    private final EntityManager entityManager;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId != null) {
            Session session = entityManager.unwrap(Session.class);
            session.enableFilter("tenantFilter").setParameter("tenantId", tenantId);
        }
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        Session session = entityManager.unwrap(Session.class);
        session.disableFilter("tenantFilter");
    }
}
```

### 9.2 이벤트 기반 아키텍처
```java
// 도메인 이벤트 정의
@Getter
@AllArgsConstructor
public class MemberCreatedEvent {
    private final UUID memberId;
    private final String memberName;
    private final String email;
    private final UUID gymId;
    private final LocalDateTime createdAt;
}

@Getter
@AllArgsConstructor
public class PassExpiredEvent {
    private final UUID passId;
    private final UUID memberId;
    private final String memberName;
    private final String productName;
    private final LocalDate expiredDate;
}

// 이벤트 발행
@Service
@RequiredArgsConstructor
public class MemberService {
    
    private final ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public MemberResponse createMember(CreateMemberRequest request) {
        Member member = // 회원 생성 로직
        Member savedMember = memberRepository.save(member);
        
        // 이벤트 발행
        MemberCreatedEvent event = new MemberCreatedEvent(
                savedMember.getId(),
                savedMember.getName(),
                savedMember.getEmail(),
                savedMember.getGym().getId(),
                savedMember.getCreatedAt()
        );
        eventPublisher.publishEvent(event);
        
        return MemberResponse.from(savedMember);
    }
}

// 이벤트 핸들러
@Component
@RequiredArgsConstructor
@Slf4j
public class MemberEventHandler {
    
    private final NotificationService notificationService;
    private final ExternalSystemService externalSystemService;
    
    @EventListener
    @Async
    public void handleMemberCreated(MemberCreatedEvent event) {
        log.info("Member created event received: {}", event.getMemberId());
        
        // 웰컴 메시지 발송
        notificationService.sendWelcomeMessage(event.getEmail(), event.getMemberName());
        
        // 외부 시스템 연동
        externalSystemService.syncMemberData(event);
        
        // 통계 업데이트
        updateMemberStatistics(event.getGymId());
    }
    
    @EventListener
    @Async
    public void handlePassExpired(PassExpiredEvent event) {
        log.info("Pass expired event received: {}", event.getPassId());
        
        // 만료 알림 발송
        notificationService.sendPassExpiredNotification(event);
        
        // 자동 갱신 처리 (설정된 경우)
        processAutoRenewal(event);
    }
}

// 메시지 큐 연동 (RabbitMQ)
@Configuration
@EnableRabbit
public class RabbitConfig {
    
    @Bean
    public TopicExchange memberExchange() {
        return new TopicExchange("member.exchange");
    }
    
    @Bean
    public Queue memberCreatedQueue() {
        return QueueBuilder.durable("member.created.queue").build();
    }
    
    @Bean
    public Binding memberCreatedBinding() {
        return BindingBuilder
                .bind(memberCreatedQueue())
                .to(memberExchange())
                .with("member.created");
    }
    
    @RabbitListener(queues = "member.created.queue")
    public void handleMemberCreatedMessage(MemberCreatedEvent event) {
        // 다른 서비스에서 회원 생성 이벤트 처리
        log.info("Processing member created message: {}", event.getMemberId());
    }
}
```

### 9.3 외부 시스템 연동
```java
// 결제 시스템 연동
@Service
@RequiredArgsConstructor
public class PaymentGatewayService {
    
    @Value("${payment.gateway.url}")
    private String gatewayUrl;
    
    @Value("${payment.gateway.api-key}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public PaymentResult processPayment(PaymentRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            
            HttpEntity<PaymentRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<PaymentResponse> response = restTemplate.postForEntity(
                    gatewayUrl + "/payments", entity, PaymentResponse.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return PaymentResult.success(response.getBody());
            } else {
                return PaymentResult.failure("Payment failed");
            }
        } catch (Exception e) {
            log.error("Payment processing failed", e);
            return PaymentResult.failure(e.getMessage());
        }
    }
}

// SMS 발송 서비스
@Service
@RequiredArgsConstructor
public class SmsService {
    
    @Value("${sms.provider.url}")
    private String smsUrl;
    
    @Value("${sms.provider.api-key}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    
    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void sendSms(String phoneNumber, String message) {
        SmsRequest request = SmsRequest.builder()
                .to(phoneNumber)
                .message(message)
                .build();
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            HttpEntity<SmsRequest> entity = new HttpEntity<>(request, headers);
            
            restTemplate.postForEntity(smsUrl + "/send", entity, String.class);
            
            log.info("SMS sent successfully to: {}", phoneNumber);
        } catch (Exception e) {
            log.error("Failed to send SMS to: {}", phoneNumber, e);
            throw e;
        }
    }
}

// 회계 시스템 연동
@Service
@RequiredArgsConstructor
public class AccountingSystemService {
    
    @EventListener
    @Async
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        // 회계 시스템에 매출 데이터 전송
        AccountingEntry entry = AccountingEntry.builder()
                .date(event.getPaymentDate())
                .amount(event.getAmount())
                .description(event.getDescription())
                .category(event.getPaymentType().toString())
                .gymId(event.getGymId())
                .build();
        
        syncToAccountingSystem(entry);
    }
    
    private void syncToAccountingSystem(AccountingEntry entry) {
        // 외부 회계 시스템 API 호출
        // 실패 시 재시도 로직 포함
    }
}
```

## 10. 프로젝트 구조 및 설정

### 10.1 Gradle 설정
```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.ironpulse'
version = '1.0.0'
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Starters
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-cache'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-amqp'
    
    // Database
    runtimeOnly 'org.postgresql:postgresql'
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    
    // JWT
    implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.5'
    
    // QueryDSL
    implementation 'com.querydsl:querydsl-jpa:5.0.0:jakarta'
    annotationProcessor 'com.querydsl:querydsl-apt:5.0.0:jakarta'
    annotationProcessor 'jakarta.annotation:jakarta.annotation-api'
    annotationProcessor 'jakarta.persistence:jakarta.persistence-api'
    
    // Documentation
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'
    
    // Monitoring
    implementation 'io.micrometer:micrometer-registry-prometheus'
    
    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
    testImplementation 'org.testcontainers:junit-jupiter'
    testImplementation 'org.testcontainers:postgresql'
    
    // Utilities
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

### 10.2 Application Properties
```yaml
# application.yml
spring:
  application:
    name: iron-pulse-manager
  
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/iron_pulse
    username: ${DB_USERNAME:iron_pulse}
    password: ${DB_PASSWORD:password}
    
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        default_batch_fetch_size: 1000
        
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    
  rabbitmq:
    host: ${RABBITMQ_HOST:localhost}
    port: ${RABBITMQ_PORT:5672}
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}

# JWT 설정
jwt:
  secret: ${JWT_SECRET:mySecretKey}
  access-token-validity: 3600000  # 1시간
  refresh-token-validity: 604800000  # 7일

# 외부 서비스 설정
payment:
  gateway:
    url: ${PAYMENT_GATEWAY_URL:https://api.payment.com}
    api-key: ${PAYMENT_API_KEY:}

sms:
  provider:
    url: ${SMS_PROVIDER_URL:https://api.sms.com}
    api-key: ${SMS_API_KEY:}

# 암호화 설정
app:
  encryption:
    key: ${ENCRYPTION_KEY:myEncryptionKey}

# 로깅 설정
logging:
  level:
    com.ironpulse: DEBUG
    org.springframework.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

이 문서는 Java + Spring Boot 기반의 Iron Pulse Manager 백엔드 시스템을 위한 완전한 도메인 설계를 제공합니다. 실제 구현 시 비즈니스 요구사항에 맞춰 세부사항을 조정할 수 있습니다.