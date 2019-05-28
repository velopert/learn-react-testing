# 3. 리액트 컴포넌트의 테스트

리액트 컴포넌트를 테스팅 할 때에는 [`react-dom/test-utils`](https://reactjs.org/docs/test-utils.html) 안에 들어있는 유틸 함수를 사용해서 테스트 코드를 작성합니다.

그런데, 위 유틸 함수들을 직접 사용해서 테스트 코드를 작성하는건 불가능한건 아니지만 조금 복잡하고, 불편한점들이 있기 때문에, 테스팅 라이브러리를 사용 하는것을 [리액트 공식문서](https://reactjs.org/docs/test-utils.html#overview)에서도 권장하고 있습니다.

### Enzyme 과 react-testing-library

리액트 공식문서에서 사용을 권장하는 라이브러리는 [`react-testing-library`](https://git.io/react-testing-library) 입니다. 그리고, 대체방안으로 [`Enzyme`](https://airbnb.io/enzyme/) 이 있다고 언급을 하고 있습니다.

2년 전까지는 airbnb 에서 만든 Enzyme 을 사용하는것이 가장 좋은 솔루션이였는데요, 요즘은 react-testing-library 가 많은 주목을 받고 있습니다. Enzyme 의 경우엔 2015년부터 개발이 되었고 react-testing-library 의 경우엔 2018년부터 개발이 되어 2018년 말부터 급부상을 하고 있습니다.

![](https://i.imgur.com/pAV5xFl.png)

사용률만 따진다면 Enzyme 이 사용률이 훨씬 높긴합니다.

![](https://i.imgur.com/qJLVvjk.png)

Enzyme 과 react-testing-library 는 서로 다른 철학을 가지고 있습니다. Enzyme 을 사용하여 테스트 코드를 작성 할 때에는 컴포넌트의 내부 기능을 자주 접근합니다. 예를 들어서 컴포넌트가 지니고 있는 props, state 를 확인하고, 컴포넌트의 내장 메서드를 직접 호출하기도 합니다.

react-testing-library는 반면 렌더링 결과에 조금 더 집중을 합니다. 실제 DOM 에 대해서 신경을 더 많이 쓰고, 컴포넌트의 인스턴스에 대해서 신경쓰지 않고, 실제 화면에 무엇이 보여지는지, 그리고 어떠한 이벤트가 발생했을때 화면에 원하는 변화가 생겼는지 이런 것을 확인하기에 조금 더 최적화 되어있습니다. 그래서, react-testing-library 는 조금 더 사용자의 관점에서 테스팅하기에 더욱 용이합니다.

이 튜토리얼에서는, Enzyme 과 react-testing-library 둘 다 다뤄볼건데요, react-testing-library 에 대해서 더욱 심도깊게 다뤄볼것입니다.

그리고, 우리가 리액트 프로젝트에서 TDD 를 진행하기 전에, 리액트에서 테스트를 어떤 식으로 할 수 있는지 먼저 알아보고, TDD 흐름으로 개발을 하는 것은 나중에 해보겠습니다.
