# 7. 비동기 작업을 위한 테스트

리액트 애플리케이션에서 비동기 작업이 있을 때는 이를 어떻게 테스팅 하는지, 그리고 API 요청을 해야 하는 경우 이를 어떻게 mock 할 수 있는지에 대해서 알아보겠습니다.

우리가 이전에 만들었던 rtl-tutorial 프로젝트 디렉터리를 다시 에디터로 열어주세요.

> 해당 프로젝트를 만들지 않았다면 [리액트 프로젝트 만들기](/05-react-testing-library?id=리액트-프로젝트-만들기) 부분을 참고하세요.

## 비동기적으로 바뀌는 컴포넌트 UI 테스트

DelayedToggle 라는 컴포넌트를 만들어보세요.

#### `src/DelayedToggle.js`

```jsx
import React, { useState, useCallback } from 'react';

const DelayedToggle = () => {
  const [toggle, setToggle] = useState(false);
  // 1초 후 toggle 값을 반전시키는 함수
  const onToggle = useCallback(() => {
    setTimeout(() => {
      setToggle(toggle => !toggle);
    }, 1000);
  }, []);
  return (
    <div>
      <button onClick={onToggle}>토글</button>
      <div>
        상태: <span>{toggle ? 'ON' : 'OFF'}</span>
      </div>
      {toggle && <div>야호!!</div>}
    </div>
  );
};

export default DelayedToggle;
```

컴포넌트를 만드셨으면 App 에서 렌더링하고 `yarn start` 를 해서 브라우저에 띄운 후 버튼을 눌러보세요.

#### `src/App.js`

```jsx
import React from 'react';
import DelayedToggle from './DelayedToggle';

const App = () => {
  return <DelayedToggle />;
};

export default App;
```

이 컴포넌트는 다음과 같이 작동합니다.

![](https://i.imgur.com/lTFlbxZ.gif)

버튼이 클릭되면 1초후 상태 값이 바뀌고, 상태가 ON 일때는 "야호!!" 라는 텍스트가 보여집니다.

이런 컴포넌트의 테스트는 어떻게 작성 할 수 있는지 알아봅시다.

### Async Utilities

이런 테스트는 `react-testing-library` 에서 지원하는 [Async Utilities](https://testing-library.com/docs/dom-testing-library/api-async) 함수들을 사용하여 작성 할 수 있습니다.

Aync Utilities 는 총 4가지 함수가 있는데요, 각 함수들을 직접 사용해보면서 사용법을 익혀봅시다.

#### wait

```js
function wait(
  callback?: () => void,
  options?: {
    timeout?: number
    interval?: number
  }
): Promise<void>
```

[`wait`](https://testing-library.com/docs/dom-testing-library/api-async#wait) 함수를 사용하면 특정 콜백에서 에러를 발생하지 않을 때 까지 대기할 수 있습니다. DelayedToggle 컴포넌트의 테스트 케이스를 다음과 같이 만들어보세요.

#### `src/DelayedToggle.test.js`

```jsx
import React from 'react';
import DelayedToggle from './DelayedToggle';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  waitForDomChange,
  waitForElementToBeRemoved
} from 'react-testing-library';

describe('<DelayedToggle />', () => {
  it('reveals text when toggle is ON', async () => {
    const { getByText } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    await wait(() => getByText('야호!!')); // 콜백 안의 함수가 에러를 발생시키지 않을 때 까지 기다립니다.
  });
});
```

`wait`함수는 콜백 안의 함수가 에러가 발생시키지 않을 때 까지 기다리다가, 대기시간이 timeout 을 초과하게 되면 테스트 케이스가 실패합니다. timeout 은 기본값 4500ms이며, 이는 다음과 같이 커스터마이징을 할 수 있습니다.

```js
await wait(() => getByText('야호!!'), { timeout: 3000 }); // 콜백 안의 함수가 에러를 발생시키지 않을 때 까지 기다립니다.
```

이제 `yarn test` 를 입력하면 테스트가 진행이 될텐데, 리액트 16.8을 쓰고 계시다면 다음과 같은 경고가 발생 할 것입니다.

```
  ● Console

    console.error node_modules/react-dom/cjs/react-dom.development.js:506
      Warning: An update to DelayedToggle inside a test was not wrapped in act(...).

      When testing, code that causes React state updates should be wrapped into act(...):

      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */

      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://fb.me/react-wrap-tests-with-act
          in DelayedToggle (at DelayedToggle.test.js:14)
```

이는 리액트 16.9 에서는 고쳐지는 버그인데요, 아직 릴리즈되지는 않았습니다. 따라서, 이 경고를 숨기기 위하여 setupTests.js 파일을 다음과같이 수정해보세요.

#### `src/setupTests.js`

```js
import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

// this is just a little hack to silence a warning that we'll get until react
// fixes this: https://github.com/facebook/react/pull/14853
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

작성 후 테스트 CLI 를 종료 후 다시 실행하세요.

#### waitForElement

```js
function waitForElement<T>(
  callback: () => T,
  options?: {
    container?: HTMLElement
    timeout?: number
    mutationObserverOptions?: MutationObserverInit
  }
): Promise<T>
```

[`waitForElement`](https://testing-library.com/docs/dom-testing-library/api-async#waitforelement) 함수는 특정 엘리먼트가, 나타났거나, 바뀌었거나, 사라질때까지 대기를 해줍니다. 그리고 프로미스가 끝날 때 우리가 선택한 엘리먼트를 resolve 합니다.

DelayedToggle 컴포넌트의 텍스트가 바뀌는 것을 검증하는 테스트 케이스를 `waitForElement` 로 한번 구현을 해보겠습니다.

#### `src/DelayedToggle.test.js`

```jsx
import React from 'react';
import DelayedToggle from './DelayedToggle';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  waitForDomChange,
  waitForElementToBeRemoved
} from 'react-testing-library';

describe('<DelayedToggle />', () => {
  it('reveals text when toggle is ON', async () => {
    const { getByText } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    await wait(() => getByText('야호!!')); // 콜백 안의 함수가 에러를 발생시키지 않을 때 까지 기다립니다.
  });

  it('toggles text ON/OFF', async () => {
    const { getByText } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    const text = await waitForElement(() => getByText('ON'));
    expect(text).toHaveTextContent('ON');
  });
});
```

#### waitForDomChange

```js
function waitForDomChange<T>(options?: {
  container?: HTMLElement
  timeout?: number
  mutationObserverOptions?: MutationObserverInit
}): Promise<T>
```

[`waitForDomChange`](https://testing-library.com/docs/dom-testing-library/api-async#waitfordomchange)의 특징은, 콜백함수가 아니라 검사하고 싶은 엘리먼트를 넣어주면 해당 엘리먼트에서 변화가 발생 할 때 까지 기다려준다는 것 입니다. 우리가 `render` 를 했을때 결과값에 있는 `container` 를 넣어주면, 사전에 쿼리를 통하여 엘리먼트를 선택하지 않아도 변화가 발생했음을 감지할 수 있습니다. 또한, 프로미스가 resolve 됐을 땐 [`mutationList`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver) 를 반환하여 DOM이 어떻게 바뀌었는지에 대한 정보를 알수있습니다.

#### `src/DelayedToggle.test.js`

```jsx
import React from 'react';
import DelayedToggle from './DelayedToggle';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  waitForDomChange,
  waitForElementToBeRemoved
} from 'react-testing-library';

describe('<DelayedToggle />', () => {
  it('reveals text when toggle is ON', async () => {
    const { getByText } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    await wait(() => getByText('야호!!')); // 콜백 안의 함수가 에러를 발생시키지 않을 때 까지 기다립니다.
  });

  it('toggles text ON/OFF', async () => {
    const { getByText } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    const text = await waitForElement(() => getByText('ON'));
    expect(text).toHaveTextContent('ON');
  });

  it('changes something when button is clicked', async () => {
    const { getByText, container } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    const mutations = await waitForDomChange({ container });
    console.log(mutations);
  });
});
```

#### waitForElementToBeRemoved

```js
function waitForElementToBeRemoved<T>(
  callback: () => T,
  options?: {
    container?: HTMLElement
    timeout?: number
    mutationObserverOptions?: MutationObserverInit
  }
): Promise<T>
```

[`waitForElementToBeRemove`](https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved)는 특정 엘리먼트가 화면에서 사라질때까지 기다리는 함수입니다.

#### `src/DelayedToggle.test.js`

```jsx
import React from 'react';
import DelayedToggle from './DelayedToggle';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  waitForDomChange,
  waitForElementToBeRemoved
} from 'react-testing-library';

describe('<DelayedToggle />', () => {
  it('reveals text when toggle is ON', async () => {
    const { getByText } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    await wait(() => getByText('야호!!')); // 콜백 안의 함수가 에러를 발생시키지 않을 때 까지 기다립니다.
  });

  it('toggles text ON/OFF', async () => {
    const { getByText } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    const text = await waitForElement(() => getByText('ON'));
    expect(text).toHaveTextContent('ON');
  });

  it('changes something when button is clicked', async () => {
    const { getByText, container } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    const mutations = await waitForDomChange({ container });
  });

  it('removes text when toggle is OFF', async () => {
    const { getByText, container } = render(<DelayedToggle />);
    const toggleButton = getByText('토글');
    fireEvent.click(toggleButton);
    await waitForDomChange({ container }); // ON 이 됨
    getByText('야호!!');
    fireEvent.click(toggleButton);
    await waitForElementToBeRemoved(() => getByText('야호!!'));
  });
});
```

이제, 컴포넌트의 UI 가 비동기적으로 바뀔 때 어떻게 처리해야 되는지 잘 알겠지요?

## REST API 호출하는 경우의 테스트

이번에는 리액트 컴포넌트에서 REST API 를 연동하는 경우 어떻게 테스트를 해야하는지 알아봅시다.

테스트 할 컴포넌트를 먼저 만들어봅시다!

우선 HTTP Client 라이브러리인 axios 를 설치하세요.

```
$ yarn add axios
```

우리는 [JSONPlaceholder](https://jsonplaceholder.typicode.com/) 에서 제공하는 가짜 API 를 사용하겠습니다.

#### API 예시

```
GET https://jsonplaceholder.typicode.com/users/1

{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

### 예제 컴포넌트 만들기

id 값을 props 로 받아오면, 위 API 를 호출하고 결과에서 username 과 email 을 보여주는 컴포넌트를 만들어봅시다.

#### `src/UserProfile.js`

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ id }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const getUser = async id => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      setUserData(response.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    getUser(id);
  }, [id]);

  if (loading) return <div>로딩중..</div>;

  if (!userData) return null;
  const { username, email } = userData;

  return (
    <div>
      <p>
        <b>Username: </b>
        {username}
      </p>
      <p>
        <b>Email: </b>
        {email}
      </p>
    </div>
  );
};

export default UserProfile;
```

컴포넌트를 만드셨으면, App 에서 렌더링해서 이 컴포넌트가 어떻게 작동하는지 확인해보세요.

![](https://i.imgur.com/ENgpVXh.gif)

이렇게 REST API 를 호출해야 하는 컴포넌트의 경우, 테스트 코드에서도 똑같이 요청을 보낼 수는 있지만, 일반적으로 서버에 API 를 직접 호출하지는 않고 이를 mocking 합니다. 왜냐하면, 서버의 API 가 실제로 작동하고 안하고는 서버쪽의 일이기 때문이기 때문입니다.

때문에, axios 를 사용했을 때 실제로 요청이 발생하지는 않지만 마치 발생한것처럼 작동하게 하는 방법이 있는데요, 대표적으로 두가지가 있는데 [node_modules 를 mocking](https://www.leighhalliday.com/mocking-axios-in-jest-testing-async-functions) 하는 방법이 있고, [axios-mock-adapter](https://www.npmjs.com/package/axios-mock-adapter) 라는 라이브러리를 쓰는 방법이 있습니다.

우리는 `axios-mock-adapter` 를 사용하겠습니다. 라이브러리를 사용하는편이 준비해야 할 코드도 적고 훨씬 편리합니다.

### axios-mock-adapter 사용해보기

UserProfile 의 테스트 코드를 다음과 같이 작성해보세요.

#### `src/UserProfile.test.js`

```jsx
import React from 'react';
import { render } from 'react-testing-library';
import UserProfile from './UserProfile';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('<UserProfile />', () => {
  const mock = new MockAdapter(axios, { delayResponse: 200 }); // 200ms 가짜 딜레이 설정
  // API 요청에 대하여 응답 미리 정하기
  mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(200, {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  });
  it('loads userData properly', () => {
    // TODO
  });
});
```

`MockAdapter` 를 사용하면 특정 API 요청이 발생했을 때 어떤 응답이 와야 하는지 직접 정의해줄 수 있습니다. 그러면, 컴포넌트 내부에서 API 요청이 발생하게 될 때, 실제로 서버까지 요청이 날라가지 않고, 우리가 정의한 가짜 응답을 사용하게 됩니다.

MockAdapter 를 사용 할 때는 `delayResponse` 옵션을 설정하면 딜레이를 임의적으로 설정할 수 있습니다. 이 설정은 없어도 상관 없습니다.

이렇게 axios 요청을 mocking 한 이후에는 우리가 이전에 배웠던 Async Utilities 를 사용해주면 됩니다.

#### `src/UserProfile.test.js`

```jsx
import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import UserProfile from './UserProfile';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('<UserProfile />', () => {
  const mock = new MockAdapter(axios, { delayResponse: 200 }); // 200ms 가짜 딜레이 설정
  // API 요청에 대하여 응답 미리 정하기
  mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(200, {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  });
  it('calls getUser API loads userData properly', async () => {
    const { getByText } = render(<UserProfile id={1} />);
    await waitForElement(() => getByText('로딩중..')); // 로딩중.. 문구 보여줘야함
    await waitForElement(() => getByText('Bret')); // Bret (username) 을 보여줘야함
  });
});
```

테스트가 잘 통과했나요?

### axios-mock-adapter 활용방법

`axios-mock-adapter` 의 [공식 문서](https://www.npmjs.com/package/axios-mock-adapter)를 보면 더 많은 활용방법을 볼 수 있는데요, 그 중 일부를 어떤 용도로 사용 할 수 있는지 소개시켜드리겠습니다.

#### 한번만 mocking 하기 - replyOnce

```js
mock.onGet('/users').replyOnce(200, users);
```

이렇게 하면 요청을 딱 한번만 mocking 할 수 있습니다. 한번 요청을 하고 나면 그 다음 요청은 정상적으로 요청이 됩니다.

#### replyOnce 를 연달아서 사용하기

```js
mock
  .onGet('/users')
  .replyOnce(200, users) // 첫번째 요청
  .onGet('/users')
  .replyOnce(500); // 두번째 요청
```

이렇게 하면 첫번째 요청과 두번째 요청을 연달아서 설정 할 수 있습니다. 요청을 여러번 해야 하는 경우 이런 형태로 구현하시면 됩니다.

#### 아무 요청이나 mocking 하기 - onAny()

보통 메서드에 따라 `onGet()`, `onPost()` 이런식으로 사용하는데요, `onAny()` 를 사용하면 어떤 메서드던 mocking 을 할 수 있습니다.

```js
mock.onAny('/foo').reply(200);
```

만약에 주소까지 생략하면 어떤 주소던 mocking 합니다.

```js
mock.onAny().reply(200);
```

#### reset 과 restore

mock 인스턴스에는 `reset` 과 `restore` 라는 함수가 있습니다.

```js
mock.reset();
```

`reset` 은 mock 인스턴스에 등록된 모든 mock 핸들러를 제거합니다. 만약에 테스트 케이스별로 다른 mock 설정을 하고 싶으시면 이 함수를 사용하시면 됩니다.

```js
mock.restore();
```

`restore` 은 axios 에서 mocking 기능을 완전히 제거합니다. 만약에 실제 테스트를 하다가 요청이 실제로 날라가게 하고 싶으면 이 함수를 사용하면 됩니다.
