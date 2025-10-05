# .gitignore 보안 패턴 가이드

## 개요
이 문서는 .gitignore에 추가된 포괄적인 보안 패턴들을 정리한 가이드입니다. 
개발 과정에서 민감한 정보가 Git에 커밋되는 것을 방지하기 위한 패턴들을 포함합니다.

## 🔐 보안 패턴 카테고리

### 🔑 인증서 및 키 파일
```
**/*.pem
**/*.key
**/*.crt
**/*.p12
**/*.pfx
**/*.jks
**/*.keystore
**/*.p8
**/*.p12
**/*.der
**/*.csr
```
**목적**: SSL/TLS 인증서, 개인키, 키스토어 등 암호화 관련 파일들

### 🔑 API 키 및 토큰
```
**/*api_key*
**/*apikey*
**/*access_token*
**/*refresh_token*
**/*bearer_token*
**/*jwt*
**/*oauth*
**/*client_secret*
**/*client_id*
```
**목적**: REST API, OAuth, JWT 등 인증 토큰들

### 🗄️ 데이터베이스 자격증명
```
**/*db_password*
**/*database_password*
**/*db_user*
**/*database_user*
**/*connection_string*
**/*dsn*
```
**목적**: 데이터베이스 연결 정보, 사용자명, 비밀번호

### ☁️ 클라우드 서비스 자격증명
```
**/*aws_access_key*
**/*aws_secret_key*
**/*azure_key*
**/*gcp_key*
**/*firebase_key*
**/*supabase_key*
```
**목적**: AWS, Azure, GCP, Firebase, Supabase 등 클라우드 서비스 키

### 📱 소셜 미디어 토큰
```
**/*twitter_token*
**/*facebook_token*
**/*instagram_token*
**/*linkedin_token*
**/*github_token*
**/*gitlab_token*
```
**목적**: 소셜 미디어 플랫폼 API 토큰들

### 💳 결제 및 금융
```
**/*stripe_key*
**/*paypal_key*
**/*payment_key*
**/*merchant_key*
**/*bank_key*
```
**목적**: 결제 서비스, 금융 API 키들

### 📧 이메일 및 메시징
```
**/*smtp_password*
**/*email_password*
**/*slack_token*
**/*discord_token*
**/*telegram_token*
```
**목적**: 이메일 서버, 메시징 플랫폼 인증 정보

### 📊 모니터링 및 분석
```
**/*sentry_key*
**/*mixpanel_key*
**/*amplitude_key*
**/*analytics_key*
```
**목적**: 에러 모니터링, 분석 도구 API 키들

### 🚀 개발 및 배포
```
**/*deploy_key*
**/*ci_token*
**/*build_token*
**/*release_key*
```
**목적**: CI/CD, 배포 자동화 도구 키들

### 📱 모바일 앱 키
```
**/*ios_key*
**/*android_key*
**/*fcm_key*
**/*apns_key*
```
**목적**: iOS, Android 앱 개발 관련 키들

### 🔧 서드파티 서비스
```
**/*twilio_key*
**/*sendgrid_key*
**/*mailgun_key*
**/*pusher_key*
```
**목적**: 외부 서비스 API 키들

### 📁 설정 파일 및 디렉토리
```
**/config/secrets*
**/config/credentials*
**/config/keys*
**/secrets/
**/credentials/
**/keys/
```
**목적**: 설정 파일 내 민감한 정보, 전용 디렉토리들

### 💾 백업 파일
```
**/*backup*
**/*dump*
**/*export*
**/*.sql
**/*.db
**/*.sqlite
**/*.sqlite3
```
**목적**: 데이터베이스 백업, 덤프 파일들

### 🔒 인증서 디렉토리
```
**/certs/
**/certificates/
**/ssl/
**/tls/
**/keys/
**/private/
```
**목적**: 인증서 저장 전용 디렉토리들

### 🌍 환경별 비밀
```
**/.env.production
**/.env.staging
**/.env.development
**/.env.local
**/.env.secret
**/.env.private
```
**목적**: 환경별 설정 파일들

### 💻 IDE 및 에디터
```
**/.vscode/settings.json
**/.idea/workspace.xml
**/.idea/encodings.xml
**/.idea/vcs.xml
**/.idea/jsLibraryMappings.xml
```
**목적**: IDE 설정 파일 내 민감한 정보

### 🖥️ OS별 민감한 파일
```
**/.bash_history
**/.zsh_history
**/.ssh/
**/.gnupg/
**/.aws/
**/.azure/
```
**목적**: 운영체제별 민감한 설정 파일들

### 📄 문서
```
**/README.secret*
**/SECRET*
**/PRIVATE*
**/CONFIDENTIAL*
```
**목적**: 민감한 정보가 포함된 문서들

## 🎯 사용 가이드

### 1. 패턴 적용 방법
- 모든 패턴은 `**/`로 시작하여 모든 하위 디렉토리를 포함
- `*` 와일드카드를 사용하여 파일명의 일부만 매칭
- 대소문자 구분 없이 매칭

### 2. 새로운 패턴 추가
새로운 서비스나 키 타입이 생기면 이 문서를 참고하여 패턴을 추가하세요.

### 3. 정기적 검토
- 3개월마다 패턴 목록을 검토
- 새로운 보안 위협에 대응하여 패턴 업데이트
- 사용하지 않는 패턴은 제거

## ⚠️ 주의사항

### 1. 패턴 테스트
새로운 패턴을 추가하기 전에 테스트 파일로 검증하세요.

### 2. 팀 공유
팀원들과 이 문서를 공유하여 일관된 보안 정책을 유지하세요.

### 3. 정기적 업데이트
보안 패턴은 정기적으로 업데이트하여 최신 보안 위협에 대응하세요.

## 📚 참고 자료

- [Git .gitignore 공식 문서](https://git-scm.com/docs/gitignore)
- [GitHub 보안 모범 사례](https://docs.github.com/en/code-security)
- [OWASP 보안 가이드라인](https://owasp.org/)

## 🔄 업데이트 이력

- **2025-10-05**: 초기 보안 패턴 추가
- **2025-10-05**: 포괄적인 보안 패턴 확장

---

**⚠️ 보안 주의사항**: 이 문서에 실제 키나 토큰을 포함하지 마세요. 모든 민감한 정보는 `[보안상 제거됨]`으로 표시하세요.
