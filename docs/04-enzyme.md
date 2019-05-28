# 4. Enzyme 사용법

## 리액트 프로젝트 만들기

우선, 우리가 테스팅을 연습할 리액트 프로젝트를 만들겠습니다. CRA 를 통하여 프로젝트를 생성해주세요.

```
$ yarn create react-app react-enzyme-test
# 혹은 npx create-react-app react-enzyme-test
```

CRA 로 만든 프로젝트에는 Jest 가 처음부터 적용되어있기 때문에 별도로 jest 설치를 하지 않으셔도 됩니다. VS Code 를 사용하시는 경우 IDE 지원을 제대로 받기 위하여 `@types/jest` 만 설치해주세요.

## 설치

리액트 프로젝트를 열어서 다음 라이브러리들을 설치하세요.

```bash
$ yarn add enzyme enzyme-adapter-react-16
# 또는 npm install --save enzyme enzyme-adapter-react-16
```

그 다음, src 디렉터리에 setupTests.js 라는 파일을 만들어서 다음 코드를 입력하세요.

#### `src/setupTests.js`

```jsx
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

그 다음, Profile 이라는 컴포넌트를 만들어보겠습니다. 이 컴포넌트에서는, username 과 name 값을 가져와서 화면상에 보여줍니다.

#### `src/Profile.js`

```jsx
import React from 'react';

const Profile = ({ username, name }) => {
  return (
    <div>
      <b>{username}</b>&nbsp;
      <span>({name})</span>
    </div>
  );
};

export default Profile;
```

이 컴포넌트를 App 컴포넌트에서 렌더링하고 `yarn start` (혹은 `npm start`) 를 입력하여 결과를 확인해보세요.

```jsx
import React from 'react';
import Profile from './Profile';

function App() {
  return (
    <div>
      <Profile username="velopert" name="김민준" />
    </div>
  );
}

export default App;
```

!> _Cannot find module '@babel/plugin-transform-react-jsx-source'_ 라는 에러가 발생하면 node_modules 를 제거한 후, yarn install (혹은 npm install) 명령어를 입력하여 패키지들을 재설치해보세요.

![](https://i.imgur.com/yHXxZce.png)

위 결과물이 잘 나타났나요? 이제 이 컴포넌트를 위한 테스트 코드를 작성해보겠습니다. 이 컴포넌트의 테스트 코드에서는 props 로 값을 넣어줬을 때 username 과 name 값이 잘 나타났는지 확인해주어야 합니다.

## 스냅샷 테스팅

스냅샷 테스팅이란, 렌더링된 결과가 이전에 렌더링한 결과와 일치하는지 확인하는 작업을 의미합니다. Enzyme 에서 스냅샷 테스팅을 하려면 `enzyme-to-json` 이라는 라이브러리를 설치해주어야 합니다.

```bash
$ yarn add enzyme-to-json
```

그 다음에는, package.json 파일을 열어서 다음과 같이 `"jest"` 설정을 넣어주세요.

#### `package.json`

```json
{
  "name": "react-enzyme-test",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@types/jest": "^24.0.13",
    "enzyme": "^3.9.0",
    "enzyme-adapter-react-16": "^1.13.1",
    "enzyme-to-json": "^3.3.5",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-scripts": "3.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "jest": {
    "snapshotSerializers": ["enzyme-to-json/serializer"]
  }
}
```

그 다음, Profile.test.js 파일을 다음과 같이 작성해보세요.

#### `Profile.test.js`

```jsx
import React from 'react';
import { mount } from 'enzyme';
import Profile from './Profile';

describe('<Profile />', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<Profile username="velopert" name="김민준" />);
    expect(wrapper).toMatchSnapshot();
  });
});
```

`mount` 라는 함수는 Enzyme 을 통하여 리액트 컴포넌트를 렌더링 해줍니다. 이를 통해서 만든 wrapper 를 통해서 우리가 추후 props 조회, DOM 조회, state 조회 등을 할 수 있습니다. `mount` 외에도 `shallow` 라는 함수도 있는데요. 이에 대해선 나중에 알아보겠습니다.

그리고 나서, 다음 명령어를 입력하여 테스트 코드를 실행하세요.

```bash
$ yarn test
```

![](https://i.imgur.com/B6TSKOV.png)

위와 같이 _1 snapshot updated_ 라는 문구가 보여지고 src 디렉터리에 `\_\_snapshots\_\_/Profile.test.js.snap/` 라는 파일이 생겼을 것입니다.

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`<Profile /> matches snapshot 1`] = `
<Profile
  name="김민준"
  username="velopert"
>
  <div>
    <b>
      velopert
    </b>
     
    <span>
      (
      김민준
      )
    </span>
  </div>
</Profile>
`;
```

만약에 컴포넌트를 수정하게 되면 이 스냅샷이 일치하지 않게 되면서 테스트가 실패할 것입니다. 예를 들어서 다음과 같이 username 뒤에 느낌표를 붙이면

#### `Profile.js`

```jsx
import React from 'react';

const Profile = ({ username, name }) => {
  return (
    <div>
      <b>{username}!</b>&nbsp;
      <span>({name})</span>
    </div>
  );
};

export default Profile;
```

![](https://i.imgur.com/e42tnV3.png)

이렇게 실패했다고 나타납니다. 만약 현재 결과물이 제대로 된거고, 스냅샷을 현재 결과물로 업데이트 하고 싶다면, 콘솔창에서 `u` 키를 누르면 됩니다. 한번 눌러보세요. 스냅샷이 업데이트 된것이 확인 됐다면, 느낌표를 지우고 또 다시 스냅샷을 원래 상태로 다시 업데이트하세요.

## props 접근

Enzyme 에서는 컴포넌트 인스턴스에 접근을 할 수 있습니다. 한번 다음과 같이 새로운 테스트 케이스를 만들어보세요.

#### `src/Profile.test.js`

```jsx
import React from 'react';
import { mount } from 'enzyme';
import Profile from './Profile';

describe('<Profile />', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<Profile username="velopert" name="김민준" />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders username and name', () => {
    const wrapper = mount(<Profile username="velopert" name="김민준" />);
    expect(wrapper.props().username).toBe('velopert');
    expect(wrapper.props().name).toBe('김민준');
  });
});
```

이렇게 콘솔에 출력을 하게 하면 테스트 하는 콘솔에서 결과가 나타납니다. 한번 콘솔을 확인해보세요.

![](https://i.imgur.com/4g5KSPz.png)

## DOM 확인

DOM 에 우리가 원하는 텍스트가 나타나있는지 확인을 해보겠습니다.

#### `src/Profile.test.js`

```jsx
import React from 'react';
import { mount } from 'enzyme';
import Profile from './Profile';

describe('<Profile />', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<Profile username="velopert" name="김민준" />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders username and name', () => {
    const wrapper = mount(<Profile username="velopert" name="김민준" />);

    expect(wrapper.props().username).toBe('velopert');
    expect(wrapper.props().name).toBe('김민준');

    const boldElement = wrapper.find('b');
    expect(boldElement.contains('velopert')).toBe(true);
    const spanElement = wrapper.find('span');
    expect(spanElement.text()).toBe('(김민준)');
  });
});
```

`find` 함수를 사용하면 특정 DOM 을 선택 할 수 있습니다. 여기에 입력하는 값은 브라우저의 `querySelector` 와 같습니다. CSS 클래스는 `find('.my-class')`, id 는 `find('#myid')`, 태그는 `find('span')` 이런식으로 조회를 할 수 있으며, 여기에 컴포넌트의 Display Name 을 사용하면 특정 컴포넌트의 인스턴스도 찾을 수 있습니다 (예: `find('MyComponent')`)

## 클래스형 컴포넌트의 테스팅

이번에는 클래스형 컴포넌트의 내부메서드 호출 및 state 를 조회하는 방법을 알아보겠습니다. 깨어있는 (?) 리액트 개발자라면 Hooks 를 사용하고 싶겠지만 이건 다음 섹션에서 진행하겠습니다.

Counter 컴포넌트를 만들어봅시다.

#### `src/Counter.js`

```jsx
import React, { Component } from 'react';

class Counter extends Component {
  state = {
    number: 0
  };
  handleIncrease = () => {
    this.setState({
      number: this.state.number + 1
    });
  };
  handleDecrease = () => {
    this.setState({
      number: this.state.number - 1
    });
  };
  render() {
    return (
      <div>
        <h2>{this.state.number}</h2>
        <button onClick={this.handleIncrease}>+1</button>
        <button onClick={this.handleDecrease}>-1</button>
      </div>
    );
  }
}

export default Counter;
```

이제 Counter 컴포넌트를 어떻게 테스트 할 수 있는지 알아볼까요?

#### `src/Counter.test.js`

```jsx
import React from 'react';
import { shallow } from 'enzyme';
import Counter from './Counter';

describe('<Counter />', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(<Counter />);
    expect(wrapper).toMatchSnapshot();
  });
  it('has initial number', () => {
    const wrapper = shallow(<Counter />);
    expect(wrapper.state().number).toBe(0);
  });
  it('increases', () => {
    const wrapper = shallow(<Counter />);
    wrapper.instance().handleIncrease();
    expect(wrapper.state().number).toBe(1);
  });
  it('decreases', () => {
    const wrapper = shallow(<Counter />);
    wrapper.instance().handleDecrease();
    expect(wrapper.state().number).toBe(-1);
  });
});
```

여기서는 우리가 `mount` 대신에 `shallow` 라는 함수를 사용해주었는데요, `shallow` 는 컴포넌트 내부에 또다른 리액트 컴포넌트가 있다면 이를 렌더링하지 않습니다. 만약에 우리가 Profile 컴포넌트를 Counter 컴포넌트에서 렌더링 할 경우에는 `shallow` 의 경우 다음과 같은 결과가 나타나고,

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`<Counter /> matches snapshot 1`] = `
<div>
  <h2>
    0
  </h2>
  <button
    onClick={[Function]}
  >
    +1
  </button>
  <button
    onClick={[Function]}
  >
    -1
  </button>
  <Profile
    name="김민준"
    username="velopert"
  />
</div>
`;
```

`mount` 의 경우 다음과 같은 결과가 나타납니다.

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`<Counter /> matches snapshot 1`] = `
<Counter>
  <div>
    <h2>
      0
    </h2>
    <button
      onClick={[Function]}
    >
      +1
    </button>
    <button
      onClick={[Function]}
    >
      -1
    </button>
    <Profile
      name="김민준"
      username="velopert"
    >
      <div>
        <b>
          velopert
        </b>
         
        <span>
          (
          김민준
          )
        </span>
      </div>
    </Profile>
  </div>
</Counter>
`;
```

보시면, `mount` 의 경우 Profile 내부의 내용까지 전부 렌더링 된 반면, `shallow` 에선 이 작업이 생략됐지요? 추가적으로, `mount` 에서는 최상위 요소가 Counter 컴포넌트인 반면에, `shallow` 에서는 최상위 요소가 div 입니다. 따라서, `shallow` 를 할 경우 `wrapper.props()` 를 조회하게 되면 컴포넌트의 props 가 나타나는 것이 아니라 div 의 props 가 나타나게 됩니다.

```js
expect(wrapper.state().number).toBe(0);
```

컴포넌트의 state 를 조회 할 때에는 위와 같이 `state()` 함수를 사용합니다.

```js
wrapper.instance().handleIncrease();
```

그리고, 내장 메서드를 호출할때에는 `instance()` 함수를 호출하여 인스턴스를 조회 후 메서드를 호출 할 수 있습니다.

## DOM 이벤트 시뮬레이트

이번에는 내장 메서드를 직접 호출하는게 아니라, 버튼 클릭 이벤트를 시뮬레이트하여 기능이 잘 작동하는지 확인해보겠습니다.

#### `Counter.test.js`

```jsx
import React from 'react';
import { shallow } from 'enzyme';
import Counter from './Counter';

describe('<Counter />', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(<Counter />);
    expect(wrapper).toMatchSnapshot();
  });
  it('has initial number', () => {
    const wrapper = shallow(<Counter />);
    expect(wrapper.state().number).toBe(0);
  });
  it('increases', () => {
    const wrapper = shallow(<Counter />);
    wrapper.instance().handleIncrease();
    expect(wrapper.state().number).toBe(1);
  });
  it('decreases', () => {
    const wrapper = shallow(<Counter />);
    wrapper.instance().handleDecrease();
    expect(wrapper.state().number).toBe(-1);
  });
  it('calls handleIncrease', () => {
    // 클릭이벤트를 시뮬레이트하고, state 를 확인
    const wrapper = shallow(<Counter />);
    const plusButton = wrapper.findWhere(
      node => node.type() === 'button' && node.text() === '+1'
    );
    plusButton.simulate('click');
    expect(wrapper.state().number).toBe(1);
  });
  it('calls handleDecrease', () => {
    // 클릭 이벤트를 시뮬레이트하고, h2 태그의 텍스트 확인
    const wrapper = shallow(<Counter />);
    const minusButton = wrapper.findWhere(
      node => node.type() === 'button' && node.text() === '-1'
    );
    minusButton.simulate('click');
    const number = wrapper.find('h2');
    expect(number.text()).toBe('-1');
  });
});
```

위 테스트 케이스에서는 [`findWhere()`](https://airbnb.io/enzyme/docs/api/ShallowWrapper/findWhere.html) 함수를 사용하여 우리가 원하는 버튼 태그를 선택해주었습니다. 이 함수를 사용하면 우리가 원하는 조건을 만족하는 태그를 선택 할 수 있습니다.

만약에 `findWhere()` 를 사용하지 않는다면 다음과 같이 코드를 작성해야합니다.

```js
const buttons = wrapper.find('button');
const plusButton = buttons.get(0); // 첫번째 버튼 +1
const minusButton = buttons.get(1); // 두번째 버튼 -1
```

버튼에 이벤트를 시뮬레이트 할 때에는 원하는 엘리먼트를 찾아서 `simulate()` 함수를 사용합니다. 첫번째 파라미터에는 이벤트 이름을 넣고 두번째 파라미터에는 이벤트 객체를 넣습니다. 만약에 인풋에 change 이벤트를 발생시키는 경우엔 다음과 같이 하면 됩니다.

```javascript
input.simulate('change', {
  target: {
    value: 'hello world'
  }
});
```

그리고, 값이 잘 업데이트 됐는지 확인하기 위해서 두가지 방법을 사용했는데요, 첫번째 방법은 state 를 직접 조회하는 것이고, 두번째 방법은 h2 태그를 조회해서 값을 확인하는 것 입니다. 실제 테스트 코드를 작성하게 될 때에는 이 방법 중 아무거나 선택하셔도 상관없습니다.

## 함수형 컴포넌트와 Hooks 테스팅

이번에는 Hooks 를 사용하는 함수형 컴포넌트의 테스트 코드를 작성해봅시다. HookCounter 라는 컴포넌트를 만들어보세요.

#### `src/HookCounter.js`

```jsx
import React, { useState, useCallback } from 'react';

const HookCounter = () => {
  const [number, setNumber] = useState(0);
  const onIncrease = useCallback(() => {
    setNumber(number + 1);
  }, [number]);
  const onDecrease = useCallback(() => {
    setNumber(number - 1);
  }, [number]);

  return (
    <div>
      <h2>{number}</h2>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
};

export default HookCounter;
```

컴포넌트를 만들고 App 에서 렌더링하여 잘 작동하는지 직접 먼저 확인해보세요.

#### `src/App.js`

```jsx
import React from 'react';

import HookCounter from './HookCounter';

function App() {
  return (
    <div>
      <HookCounter />
    </div>
  );
}

export default App;
```

이 컴포넌트를 위한 테스트케이스를 작성해보겠습니다. 함수형 컴포넌트에서는 클래스형 컴포넌트와 달리 인스턴스 메서드 및 상태를 조회 할 방법이 없습니다. 추가적으로, Hooks 를 사용하는 경우 꼭 `shallow` 가 아닌 `mount` 를 사용하셔야 합니다. 그 이유는, `useEffect` Hook 은 `shallow` 에서 작동하지 않고, 버튼 엘리먼트에 연결되어있는 함수가 이전 함수를 가르키고 있기 때문에, 예를 들어 +1 버튼의 클릭 이벤트를 두번 시뮬레이트해도 결과값이 2가 되는게 아니라 1이 됩니다.

#### `HookCounter.test.js`

```javascript
import React from 'react';
import { mount } from 'enzyme';
import HookCounter from './HookCounter';

describe('<HookCounter />', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<HookCounter />);
    expect(wrapper).toMatchSnapshot();
  });
  it('increases', () => {
    const wrapper = mount(<HookCounter />);
    let plusButton = wrapper.findWhere(
      node => node.type() === 'button' && node.text() === '+1'
    );
    plusButton.simulate('click');
    plusButton.simulate('click');

    const number = wrapper.find('h2');

    expect(number.text()).toBe('2');
  });
  it('decreases', () => {
    const wrapper = mount(<HookCounter />);
    let decreaseButton = wrapper.findWhere(
      node => node.type() === 'button' && node.text() === '-1'
    );
    decreaseButton.simulate('click');
    decreaseButton.simulate('click');

    const number = wrapper.find('h2');

    expect(number.text()).toBe('-2');
  });
});
```

## 정리

이번 섹션에서는 Enzyme 을 통한 컴포넌트 테스팅에 대해서 알아보았습니다. Enzyme 의 [공식 문서](https://airbnb.io/enzyme/docs/api/)를 보면, Enzyme 에 있는 더 많은 기능들을 볼 수 있습니다.
