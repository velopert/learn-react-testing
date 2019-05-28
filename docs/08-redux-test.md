# 리덕스를 사용하는 리액트 프로젝트 테스트

이번에는 리덕스를 사용하는 리액트 프로젝트에서는 어떻게 테스트를 작성하는지 배워봅시다.

> 만약 리덕스를 잘 모르신다면 이 [링크](https://velog.io/@velopert/Redux-1-%EC%86%8C%EA%B0%9C-%EB%B0%8F-%EA%B0%9C%EB%85%90%EC%A0%95%EB%A6%AC-zxjlta8ywt) 를 통하여 리덕스를 배우신 뒤 이 튜토리얼을 진행해주세요.

리덕스를 사용 할 때 테스트 해야 되는 것들은 다음과 같습니다.

1. 액션 생성 함수
2. 리듀서
3. 프리젠테이셔널(Presentational) 컴포넌트
4. 컨테이너(Container) 컴포넌트

> 여기서 프리젠테이셔널 컴포넌트는 리덕스에 연결되지 않은 컴포넌트를 의미하고, 컨테이너 컴포넌트는 리덕스에 연결된 컴포넌트를 의미합니다.

1번과 2번은 별도의 라이브러리 도움 없이 테스트 코드를 작성하시면 되고, 3번과 4번의 경우엔 react-testing-library 를 사용하면 됩니다. 4번, 컨테이너 컴포넌트를 위한 테스트를 작성하는건 꽤나 간단합니다. 리덕스가 연결되어있다고 해서 크게 어려워지는 것은 없습니다. 그냥 컴포넌트에 리덕스 스토어를 연결해주기만 하면 됩니다.

## 프로젝트 새로 만들기

리덕스를 사용하는 리액트 프로젝트를 위한 테스트 코드를 작성해보기 전에 우선 샘플 리덕스 코드를 준비해주겠습니다. 기존의 rtl-tutorial 프로젝트에는 연습용 컴포넌트들이 너무 많아졌으니, 새로운 프로젝트를 만들어주세요.

```bash
$ yarn create react-app redux-test-tutorial
```

그리고, 해당 디렉터리에 들어가서 테스트 관련 라이브러리와 리덕스 관련 라이브러리들을 설치하세요.

```bash
$ yarn add react-testing-library jest-dom redux react-redux
```

다음, src 디렉터리에 `setupTests.js` 도 만들어주세요.

#### `src/setupTests.js`

```javascript
import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';
```

이제 프로젝트에 리덕스를 적용해주겠습니다. 우리는 [Ducks 패턴](https://github.com/JisuPark/ducks-modular-redux)을 사용해서 리덕스 모듈을 작성 할 건데요, 지금 당장은 주요 리덕스 관련 코드를 작성하지는 않고 파일만 만들어주겠습니다.

> 이 부분은 현재 작성중입니다..! 강의에서는 코드로 설명합니다 ;)

[![Edit redux-test-tutorial](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reduxtesttutorial-0lbut?fontsize=14)
