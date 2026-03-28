# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

NestJS 기반의 모노레포 보일러플레이트 프로젝트입니다. Webpack 빌드를 사용하며, `apps/`에는 실행 가능한 애플리케이션을, `libs/`에는 재사용 가능한 라이브러리를 배치합니다.

## 주요 명령어

### 개발 및 빌드

```bash
# API 서버 개발 모드 실행
NODE_ENV=development npm run start:api:dev

# API 서버 디버그 모드 실행
NODE_ENV=development npm run start:api:debug

# 프로덕션 빌드
npm run build

# 코드 포맷팅
npm run format

# 린트 실행 및 자동 수정
npm run lint
```

### 데이터베이스 (MikroORM)

```bash
# 스키마 생성 (초기화 및 시드 포함)
npm run mikro-orm:schema:fresh -- --run --seed

# 스키마 생성만 (SQL 출력)
npm run mikro-orm:schema:fresh -- --dump

# Seeder 생성
npm run mikro-orm:seeder:create -- SeedName
```

### 테스트

```bash
# 전체 유닛 테스트 실행
npm run test

# 특정 파일 테스트 실행
npm run test -- path/to/file.spec.ts

# Watch 모드로 테스트
npm run test:watch

# 커버리지 포함 테스트
npm run test:cov

# E2E 테스트
npm run test:e2e

# 디버그 모드 테스트
npm run test:debug
```

## 아키텍처

### 모노레포 구조

**apps/**: 실행 가능한 애플리케이션

- `api/`: 메인 API 서버 애플리케이션

**libs/**: 공유 라이브러리

- `common/`: 공통 유틸리티, 데코레이터, 파이프, 필터, 인터셉터
- `config/`: 환경 설정 및 검증 (DTO 기반)
- `core/`: 핵심 비즈니스 로직 (Entity, ORM, Email, Logging)
- `security/`: 인증/인가 관련 (JWT Strategy, Guard, Public API 데코레이터)
- `testing/`: 테스트 유틸리티

### 경로 별칭 (Path Aliases)

모듈 import 시 다음 별칭을 사용합니다:

```typescript
@api/*           → apps/api/src/*
@libs/common/*   → libs/common/src/*
@libs/config/*   → libs/config/src/*
@libs/core/*     → libs/core/src/*
@libs/security/* → libs/security/src/*
@libs/testing/*  → libs/testing/src/*
```

### 환경 설정

- 환경 변수는 `env/.env.{NODE_ENV}` 파일에 정의
- `@libs/config/configuration.dto.ts`에서 DTO 기반으로 환경 변수를 검증
- 필수: NODE_ENV, appName, port, origin, jwt, sentry, throttle, db, resend 설정
- 환경 변수 검증 실패 시 애플리케이션 실행이 중단됨

### 데이터베이스 (MikroORM)

- PostgreSQL 사용
- Entity는 `libs/core/src/entity/`에 위치
- BaseEntity 상속으로 공통 필드 (id, createdAt, updatedAt) 자동 관리
- CLI 설정은 `mikro-orm.config.ts`에 정의
- Seeder는 `libs/core/src/orm/seeders/`에 위치
- Factory는 `libs/core/src/orm/factories/`에 위치

### 인증 (JWT)

- JWT 기반 인증 구현 (`@libs/security`)
- `JwtUserGuard`가 전역 가드로 기본 적용
- 공개 API는 `@PublicApi()` 데코레이터 사용
- JWT 설정은 환경 변수를 통해 주입

### 커스텀 Validator 데코레이터

`@libs/common`에서 제공하는 타입별 validator:

- `@StringValidator()`: 문자열 검증 (enum, trim, length 등)
- `@NumberValidator()`: 숫자 검증 (integer, min, max 등)
- `@DateValidator()`: 날짜 검증
- `@BooleanValidator()`: 불린 검증
- `@ArrayValidator()`: 배열 검증
- `@NestedValidator()`: 중첩 객체 검증

### 에러 처리

- `AppException` 클래스를 사용하여 비즈니스 로직 에러 처리
- `AllCatchExceptionFilter`가 전역 예외 필터로 적용
- 일관된 에러 응답 포맷 제공

### 로깅 및 모니터링

- **Sentry**: 에러 추적 및 프로파일링
  - `SentryLoggerService`를 전역 로거로 사용
  - 설정을 위해 `.env.sentry-build-plugin` 파일에 `SENTRY_AUTH_TOKEN` 필요
  - `apps/api/src/instrument.ts`에서 Sentry 초기화

- **Prometheus**: 메트릭 수집
  - `@willsoto/nestjs-prometheus` 사용

### 이메일 발송

- Resend 서비스를 사용한 이메일 발송 (`@libs/core/email`)
- Strategy 패턴으로 구현되어 확장 가능

### API 문서화

- Swagger를 `/api/docs` 경로에서 제공
- Bearer 인증 지원

### Git Hooks

- Husky 사용
- `pre-commit`: lint-staged 실행 (ESLint + Prettier)
- `commit-msg`: commitlint로 커밋 메시지 검증 (Conventional Commits)

## 개발 시 주의사항

### OOP

- 메서드 및 로직 구현 시 객체지향 프로그래밍 방식으로 수행

### Repository 패턴

- 데이터 접근 로직은 Repository 패턴으로 분리
- `createUseClassProvider(Token, Implementation)` 유틸리티로 Provider 생성
- Repository는 인터페이스와 구현체로 분리하여 테스트 용이성 확보

### 테스트 작성

- 각 라이브러리의 `test/` 폴더에 유닛 테스트 작성
- E2E 테스트는 `apps/api/test/`에 작성
- TestContainers를 사용한 통합 테스트 지원

### 모듈 추가 시

1. nest-cli.json에 프로젝트 등록
2. tsconfig.json의 paths에 경로 별칭 추가
3. package.json의 jest.moduleNameMapper에 매핑 추가

### Sentry 빌드 플러그인

- 프로젝트 루트에 `.env.sentry-build-plugin` 파일 생성
- `SENTRY_AUTH_TOKEN=<Organization Token>` 추가

### Output Style

- **NO CHATTY CONVERSATION.** Be concise and technical.
- After every edit, output a **"Change Report"** in this exact format:

### Change Report

- **Files Modified:**
  - `src/auth/auth.context.tsx`: Initialized Naver SDK in `useEffect`.
- **Key Changes:**
  - Added `NaverLogin` initialization logic to ensure `deleteToken` works.
- **Verification:**
  - Confirmed logout flow works with auto-login.
