# Database Connection Pool 모니터링 가이드

## 개요

Database Connection Pool의 상태를 실시간으로 모니터링하고 메트릭을 수집하는 기능입니다.

## 기능

### 1. REST API를 통한 Pool 상태 조회

**엔드포인트:** `GET /api/v1/pool/status`

**응답 예시:**
```json
{
  "status": "success",
  "data": {
    "totalConnections": 5,
    "activeConnections": 2,
    "idleConnections": 3,
    "waitingRequests": 0,
    "poolConfig": {
      "min": 2,
      "max": 10
    }
  }
}
```

**필드 설명:**
- `totalConnections`: 현재 생성된 전체 커넥션 수
- `activeConnections`: 현재 사용 중인 커넥션 수
- `idleConnections`: 유휴 상태의 커넥션 수
- `waitingRequests`: 커넥션을 기다리는 요청 수
- `poolConfig.min`: 최소 커넥션 수 설정
- `poolConfig.max`: 최대 커넥션 수 설정

### 2. Prometheus 메트릭

Pool 상태는 10초마다 자동으로 Prometheus 메트릭으로 수집됩니다.

**메트릭 목록:**
- `db_pool_total_connections`: 전체 커넥션 수
- `db_pool_active_connections`: 활성 커넥션 수
- `db_pool_idle_connections`: 유휴 커넥션 수
- `db_pool_waiting_requests`: 대기 중인 요청 수

**메트릭 확인:**
```bash
# Prometheus 메트릭 엔드포인트
curl http://localhost:3000/api/metrics | grep db_pool
```

### 3. Grafana 대시보드

Prometheus 메트릭을 Grafana에서 시각화할 수 있습니다.

**권장 쿼리:**
```promql
# 활성 커넥션 비율
(db_pool_active_connections / db_pool_total_connections) * 100

# 평균 대기 요청 수
avg_over_time(db_pool_waiting_requests[5m])

# 커넥션 사용률 (max 대비)
(db_pool_total_connections / 10) * 100  # max=10 가정
```

## Pool Size 설정

### 환경 변수 설정

`env/.env.{NODE_ENV}` 파일에서 pool 설정:

```bash
# Development 환경 (.env.development)
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=5000
DB_POOL_ACQUIRE_TIMEOUT=10000

# Production 환경 (.env.production)
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_ACQUIRE_TIMEOUT=30000
```

### 권장 설정 값

**개발 환경:**
- min: 2 (최소한의 커넥션 유지)
- max: 10 (로컬 개발에 충분)
- idleTimeout: 5000ms (빠른 정리)
- acquireTimeout: 10000ms (10초)

**프로덕션 환경:**
```
max = (서버 CPU 코어 수 * 2) + effective_spindle_count
```
- 예: 4코어 서버 → max = (4 * 2) + 1 = 9~10
- min: max의 50% (burst 대응)
- idleTimeout: 30000ms (30초)
- acquireTimeout: 30000ms (30초)

**고부하 환경:**
- min: 10
- max: 30
- idleTimeout: 60000ms
- acquireTimeout: 60000ms

## 모니터링 및 알림

### 주의해야 할 지표

#### 1. Active Connections가 Max에 근접
```
activeConnections / max > 0.8 (80% 이상)
```
**원인:**
- 트래픽 증가
- 느린 쿼리
- 커넥션 누수

**대응:**
- Max 값 증가
- 쿼리 최적화
- 커넥션 사용 후 해제 확인

#### 2. Waiting Requests 발생
```
waitingRequests > 0
```
**원인:**
- Pool size 부족
- 데이터베이스 응답 지연
- 커넥션 고갈

**대응:**
- Pool size 증가
- DB 서버 성능 확인
- 쿼리 타임아웃 설정

#### 3. Idle Connections 과다
```
idleConnections / totalConnections > 0.7 (70% 이상 유휴)
```
**원인:**
- Pool size 과다 설정
- 트래픽 감소

**대응:**
- Max 값 감소 고려
- Min 값 조정

## 트러블슈팅

### Pool Exhausted 에러

```
Error: Timeout acquiring a connection from the pool
```

**해결 방법:**
1. Pool size 증가
```bash
DB_POOL_MAX=20  # 기존 10에서 증가
```

2. Acquire timeout 증가
```bash
DB_POOL_ACQUIRE_TIMEOUT=30000  # 30초
```

3. 쿼리 최적화
```typescript
// 인덱스 추가
// N+1 쿼리 해결
// 불필요한 JOIN 제거
```

### 커넥션 누수 확인

**증상:**
- Active connections가 계속 증가
- Pool이 고갈되어 새 요청 실패

**진단:**
```bash
# Pool 상태 주기적으로 확인
watch -n 1 'curl -s http://localhost:3000/api/v1/pool/status'
```

**해결:**
```typescript
// 트랜잭션 사용 시 반드시 commit/rollback
const em = orm.em.fork();
try {
  await em.begin();
  // ... 작업
  await em.commit();
} catch (error) {
  await em.rollback();  // 필수!
  throw error;
} finally {
  await em.close();  // 커넥션 해제
}
```

## 성능 튜닝 팁

### 1. 적절한 Pool Size 찾기

**부하 테스트 진행:**
```bash
# Apache Bench
ab -n 10000 -c 100 http://localhost:3000/api/v1/users

# K6
k6 run load-test.js
```

**메트릭 관찰:**
- waitingRequests가 0에 가까운 최소 max 값 찾기
- activeConnections의 피크 값 확인

### 2. Connection Timeout 설정

```bash
# 데이터베이스 쿼리 타임아웃
DB_DRIVER_STATEMENT_TIMEOUT=10000  # 10초

# Pool acquire timeout
DB_POOL_ACQUIRE_TIMEOUT=30000  # 30초
```

### 3. 모니터링 대시보드 구성

**Grafana Panel 설정:**
1. Time Series: Active/Idle/Total connections
2. Gauge: Connection usage percentage
3. Alert: waitingRequests > 5 for 1m

## 참고 자료

- [MikroORM Connection Pool](https://mikro-orm.io/docs/connection-management)
- [PostgreSQL Connection Pool Best Practices](https://wiki.postgresql.org/wiki/Number_Of_Database_Connections)
- [HikariCP Pool Sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing)
