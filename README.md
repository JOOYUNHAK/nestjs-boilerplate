# nestjs-boilerplate
NestJS 기반의 모노레포 프로젝트 보일러플레이트입니다.  
효율적인 개발 환경, 일관된 코드 스타일, 확장성 있는 구조를 제공합니다.

## 주요 특징
- 모노레포 구조:`apps`와 `libs` 폴더로 서비스와 라이브러리 분리
- MikroORM: PostgreSQL 기반 ORM 사용
- 환경설정 및 검증: 환경변수 DTO 및 유효성 검사
- Sentry 연동: 에러 추적 및 프로파일링 지원
- 커스텀 유효성 데코레이터: 다양한 Validator 제공
- 글로벌 예외/응답 처리: 일관된 에러 및 응답 포맷
- JWT 인증 및 Guard: 사용자 인증 및 공개 API 데코레이터
- 테스트 코드: 유닛/통합 테스트 예시 포함
## 설치 및 실행
```sh
# 의존성 설치
npm install

# 환경변수 파일 생성
env/.env.test
env/.env.development

@libs/common에 존재하는 Environment 기반으로 환경에 맞는 파일 생성

# API 서버 실행
NODE_ENV=development npm run start:api:dev
```

## 환경설정
- 환경변수는 `env/.env.{NODE_ENV}` 파일에 정의
- `configuration.dto.ts`에서 DTO 기반 유효성 검사
- 잘못된 값은 실행 시 에러로 검증됨

## 로깅
- `@nestjs/pino` 통합

## 주요 라이브러리
- NestJS
- MikroORM
- Sentry
- Jest (테스트)
- Pino

## 테스트
```sh
# 각 libs 폴더별 유닛/통합 테스트
```

## 커스텀 유틸리티/데코레이터
- @StringValidator, @NumberValidator, @DateValidator, @BooleanValidator, @ArrayValidator, @NestedValidator
- AppException, AllCatchExceptionFilter, ResponseInterceptor
- createUseClassProvider 등 Provider 유틸리티

## Swagger & API 문서
- Swagger 설정 예시 포함 (`main.ts`)
- API 문서 자동 생성 지원

## 스타일
- 코드 스타일: Prettier, ESLint 적용
- 커밋/PR 시 lint-staged, husky 적용
---
지속적으로 업데이트중!