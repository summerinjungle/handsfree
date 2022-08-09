<div align="center">
  <img src="https://user-images.githubusercontent.com/70103130/183700606-a925c900-034c-4624-927d-f071818b8317.png" width="500">  
  <h2>화상회의록 자동 작성  서비스</h2>
  <br>
  <br><br>
</div>


## 소개

> 막둥이는 화상회의록 자동 작성 웹 서비스입니다.   
> 저희 Palette 팀은 개발자들의 아늑한 공간을 만들어 그들의 성장을 돕고 함께 쉬어가는 공간이 될 수 있기를 소망합니다. 

<div align="center">
<table>
<thead>
  <tr>
    <th>
      <div>
        <img src="https://user-images.githubusercontent.com/66074802/145715155-298a1677-1d09-401f-bd06-8b049424ad30.gif" width="300" height="180">
      </div>
      실시간으로 서로 학습하는 모습을 공유해요!
    </th>
    <th>
      <div>
        <img src="https://user-images.githubusercontent.com/66074802/144662748-ef6b95fd-24d4-49ea-a11e-0f47821fc46a.gif" width="300" height="180">
      </div>
      음성과 채팅으로 대화를 나눠요!
    </th>
  </tr>
</thead>
  <tr>
    <th>
      <div>
        <img src="https://user-images.githubusercontent.com/66074802/145715161-51255c33-5c39-45ad-9235-91391536d47e.gif" width="300" height="180">
      </div>
      온라인 불멍과 함께 캠프파이어를 체험해보세요!
    </th>
    <th>
      <div>
       <img src="https://user-images.githubusercontent.com/66074802/145715158-766ec4dd-8e56-4695-8c90-6e14c0ad8523.gif" width="300" height="180">
      </div>
       직접 호스트가 되어 방을 운영해보세요!
    </th>
  </tr>
</tbody>
</table>

| 김보경 | 박건희 | 양현석 | 지민성 | 함도영 |
|:--------:|:--------:|:--------:|:--------:|:--------:|
| ![img](https://avatars.githubusercontent.com/u/51132077?s=120&v=4) | ![img](https://avatars.githubusercontent.com/u/67041709?s=120&v=4) | ![img](https://avatars.githubusercontent.com/u/66074802?s=120&v=4) | ![img](https://avatars.githubusercontent.com/u/78056880?s=120&v=4)     |
| [zaehuun](https://github.com/zaehuun) | [jiho-bae](https://github.com/jiho-bae) | [Dev-Beom](https://github.com/Dev-Beom) | [hanbyeol](https://github.com/Narastro) |[Dev-Beom](https://github.com/Dev-Beom) | [onxmoreplz](https://github.com/onxmoreplz) |
 
  </div>

<details>
<summary>✅ 모든 구현 기능 리스트</summary>
<br>
  
**메인 페이지**

- 배치 작업을 통해 만들어진 방문자수 조회
- 디바운싱을 이용한 실시간 검색
- 페이지네이션 + 무한스크롤링 적용

**마이 페이지**

- 아바타 업로드, 삭제 기능
- 유저정보 수정 가능
- 월별 출석 통계
- 불탄 잔디로 일일 접속 기록 확인

**타닥타닥 방**

- 채팅
- 영상 스트림 전체화면으로 보기
- 음성 통화
- 영상 통화
- 화면 공유
- 실시간 사용자 상태 반영(추방, 입장, 퇴장)

**캠프파이어 방**

- 채팅
- 음성 통화
- 모닥불 배경 음악
- 모닥불 애니메이션
- 실시간 사용자 상태 반영(추방, 입장, 퇴장)

**그리고 숨겨진 이스터에그**
</details>

## 아키텍처
![infra](https://user-images.githubusercontent.com/66074802/141459748-2d7b50ed-04d6-45e7-a42e-43e24c993fae.png)
## 포스터
![infra](https://user-images.githubusercontent.com/66074802/141459748-2d7b50ed-04d6-45e7-a42e-43e24c993fae.png)

## 기술 특장점 🛠
<details>
<summary>🛠 프론트엔드 코드 통일성에 대한 지속적인 고민</summary>
<br>

**협업 및 분업**을 원활하게 하기 위해 개발 시 **통일성**을 부여하고자 많이 고민했어요.

- **TypeScript, eslint, prettier** 덕분에 버그를 예방하고 협업 생산성을 높일 수 있었어요.
- 프로젝트의 **매직 넘버는 분리**해서 한 곳에서 관리하도록 했어요.
- 별도의 fetcher 함수를 만들어 **API 요청에 대한 처리를 통일**시켰어요.
- 덕분에 응답 다음 작업이나 에러 발생시에도 통일된 작업을 수행할 수 있었어요.  
- CSS 작업시에도 **Theme**에 선언한 변수를 이용하도록 협의하여 통일성을 부여했어요.
- 그 외 통일해야 할 부분을 발견하면 즉시 함께 고민하고 실행했어요.
  
</details>

<details>
<summary>🛠 Agora PaaS의 SDK를 활용한 빠른 실시간 화상 통화 기능</summary>
<br>

다중 사용자 이용에 적합한 **미디어 서버 방식**으로 고화질의 **화상**, **음성** 및 **화면 공유**를 제공해요
- **P2P방식**의 Mesh구조는 다중 사용자가 이용하기에 **부적합**하다고 판단했어요
- 미디어 서버를 **구축**하기에는 **서버 인프라**가 **부족**하다고 판단했어요
- **Agora Paas**가 제공하는 미디어 서버를 이용하여 **실시간 고화질 영상 및 음성**을 제공해요
  
</details>

<details>
<summary>🛠 Socket.IO를 통한 방 별 실시간 기능</summary>
<br>
  
Agora SDK에서 영상과 음성 관리에 대한 처리를 담당해줬지만, 추가로 소켓을 도입했어요.
실시간으로 방 별 **인원을 관리**하고, 입장한 사용자들이 **채팅**을 통해서도 의사소통을 해야하기 때문이에요.
많은 방들이 존재하고 각 방마다 소켓 통신이 필요하기 때문에, **별도의 소켓 서버**를 만들었어요.
- REST API와 소켓을 통한 검증으로 정해진 인원과 검증된 사용자들이 방에 입장할 수 있어요.
- 방에 입장하면 참가한 사용자들의 목록을 볼 수 있어요.
- 음성채팅이 부담스러운 사용자들은 채팅방을 통해 의사소통 할 수 있어요.

</details>

<details>
<summary>🛠 서버 부하 감소를 위한 인프라 구조</summary>
<br>
  
소켓 서버를 **스케일 아웃**을 통해 방·채팅과 관련된 주요 실시간 기능의 성능 저하를 개선하고 싶었어요.
서버 어플리케이션이 늘어남에 따라서 소켓 데이터를 주고받을 수 있는 **클러스터링 서버**가 필요했어요.
소켓 서버 역할은 **데이터 검증과 목적지로의 전달**이였어서 **데이터를 영구적으로 저장할 필요가 없었**어요.
그래서 **입력, 삭제 속도**가 빠른 인메모리 데이터베이스인 **Redis**를 선정했어요.

Redis의 **Pub/Sub 기능**을 사용해 소켓간의 메시지를 **클러스터링**해요. 또한 하나의 인스턴스에서 도커로 여러개의 애플리케이션을 관리하고있어요. **Nginx Reverse Proxy**를 통해 다수의 컨테이너를 바인딩해 **로드밸런싱**을 해줘요.
  
</details>

<details>
<summary>🛠 NestJS 로 견고한 서버 프로젝트 관리</summary>
<br>
  
**확장성, 느슨한 결합, 쉬운 유지관리**를 위해 아키텍처를 제공해주는 NestJS를 선택했어요.
- 프로젝트의 구조를 잡아줘 **생산성**을 향상시켜줘요.
- 매일 새롭게 바뀐 코드를 봐야하기 때문에 **데코레이터로 가독성**을 챙겼어요.
- **제약사항**이 늘어났지만 **통일성**이 생겼어요.
- **공식문서가 친절**하고, **커뮤니티도 활발**해요. 도움을 많이 받아 공부해 적용하기 수월했어요.
  
</details>

<details>
<summary>🛠 통일된 API 규격 및 에러 처리</summary>
<br>
  
클라이언트의 **효율적인 API 요청 처리**를 위해 서버는 **일관적인 형태의 API 응답**을 제공해줘요.
- NestJS의 **Interceptor**와 **Filter**를 활용해 모든 요청과 응답을 관리해요.
- **Interceptor**는 각 API가 처리한 API 응답을 **원하는 형태로 매핑** 해줘요.
- 모든 API 응답은 **상태 코드**, **API 결과**, **메세지**를 하나의 API 응답 형태로 정해 사용하고 있어요.
- **Filter**는 각 API에서 발생한 예외 응답을 **원하는 형태로 매핑** 해줘요.
- 모든 예외 응답은 **상태 코드**, **시간**, **예외 발생 경로**, **메세지**를 하나의 예외 응답 형태로 정해 사용하고 있어요.
  
</details>
