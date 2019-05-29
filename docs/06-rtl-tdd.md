# 6. TDD 개발 흐름으로 투두리스트 만들기

이제 우리는 리액트에서 react-testing-library 를 통하여 테스트 코드를 작성하는 방법을 배웠습니다. 이제 우리가 배운 것들을 활용하여, TDD 흐름으로 투두 리스트를 만들어봅시다. 기존에는 코드를 먼저 구현하고 이를 위한 테스트 코드를 작성했는데요, 이번에는 반대로 테스트 코드를 먼저 작성하고 기능을 구현해보겠습니다.

우리는 앞으로 이런 프로젝트를 만들 것입니다.

![](https://i.imgur.com/QdJeZsZ.png)

## 새 프로젝트 만들기

새 프로젝트를 만들고, react-testing-library 적용을 해주세요. 이전 섹션에서 했던 방식과 동일합니다.

```bash
$ yarn create react-app rtl-tdd-todos
```

해당 디렉터리에서 다음 라이브러리들을 설치하세요.

```bash
$ yarn add react-testing-library jest-dom @types/jest
```

그 다음 setupTests.js 파일을 src 디렉터리에 만드세요.

#### `src/setupTests.js`

```js
import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';
```

## 컴포넌트 계획

투두리스트를 만들기 위해서 우리가 만들어야 하는 컴포넌트들이 어떤것들이 있을지 생각해봅시다.

- **TodoForm**: input 과 button 으로 이루어진 form 이 있고, submit 이벤트가 발생하면 새로운 항목을 추가 할 수 있어야 합니다.
- **TodoItem**: 각 todo 항목을 보여주는 컴포넌트입니다. todo 객체를 props 로 받아와서 렌더링해줍니다. 텍스트를 클릭하면 텍스트에 삭제선이 그어져야 하고, 우측에 삭제버튼을 누르면 해당 항목이 사라져야합니다.
- **TodoList**: todos 배열을 받아와서 여러개의 TodoItem 컴포넌트로 렌더링을 합니다.
- **TodoApp**: 할일 목록 추가, 토글, 삭제 기능이 구현되는 컴포넌트입니다.

이제 위 요구사항에 맞춰서 개발을 해봅시다!

## TodoForm 개발하기

먼저, TodoForm 컴포넌트를 src 디렉터리에 생성해주세요. 지금 단계에서는 컴포넌트의 틀만 작성합니다.

#### `src/TodoForm.js`

```jsx
import React from 'react';

const TodoForm = () => {
  return <div />;
};

export default TodoForm;
```

### UI 구성하기

이 컴포넌트에는 input 이 하나 있어야하고, 버튼도 하나 있어야합니다. 이에 맞춰서 테스트 코드를 작성해봅시다.

#### `src/TodoForm.test.js`

```jsx
import React from 'react';
import { render } from 'react-testing-library';
import TodoForm from './TodoForm';

describe('<TodoForm />', () => {
  it('has input and a button', () => {
    const { getByText, getByPlaceholderText } = render(<TodoForm />);
    getByPlaceholderText('할 일을 입력하세요'); // input 이 있는지 확인
    getByText('등록'); // button이 있는지 확인
  });
});
```

input 은 `getByPlaceholderText`로, 그리고 button은 `getByText` 로 선택하도록 쿼리를 작성하였습니다.

이제 `yarn test` 명령어를 실행하세요. 테스트케이스가 실패하겠죠? 그러면 통과를 시켜봅시다!

#### `src/TodoForm.js`

```jsx
import React from 'react';

const TodoForm = () => {
  return (
    <form>
      <input placeholder="할 일을 입력하세요" />
      <button type="submit">등록</button>
    </form>
  );
};

export default TodoForm;
```

이렇게 하고 나면 테스트가 통과 할 것입니다.

### input 상태 관리하기

그럼 다음 테스트를 작성해봅시다. input 에 `change` 이벤트를 발생시키면 value 값이 바뀌어야 합니다.

#### `src/TodoForm.test.js`

```jsx
import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import TodoForm from './TodoForm';

describe('<TodoForm />', () => {
  it('has input and a button', () => {
    const { getByText, getByPlaceholderText } = render(<TodoForm />);
    getByPlaceholderText('할 일을 입력하세요'); // input 이 있는지 확인
    getByText('등록'); // button이 있는지 확인
  });

  it('changes input', () => {
    const { getByPlaceholderText } = render(<TodoForm />);
    const input = getByPlaceholderText('할 일을 입력하세요');
    fireEvent.change(input, {
      target: {
        value: 'TDD 배우기'
      }
    });
    expect(input).toHaveAttribute('value', 'TDD 배우기');
  });
});
```

여기서 사용한 `toHaveAttribute` 는 해당 DOM 에 특정 속성이 있는지 확인해줍니다. 이제 실패한 테스트 케이스를 통과시켜봅시다!

```jsx
import React, { useState, useCallback } from 'react';

const TodoForm = () => {
  const [value, setValue] = useState('');
  const onChange = useCallback(e => {
    setValue(e.target.value);
  }, []);

  return (
    <form>
      <input
        placeholder="할 일을 입력하세요"
        value={value}
        onChange={onChange}
      />
      <button type="submit">등록</button>
    </form>
  );
};

export default TodoForm;
```

### submit 이벤트 관리하기

이번에는 버튼을 클릭했을 때 발생하는 submit 이벤트를 관리해봅시다. TodoForm 컴포넌트는 `onInsert` 라는 함수를 props 로 받아올것이고, submit 이벤트가 발생하게 되면 이 함수가 호출됩니다. 그리고, input 값은 비워져야 합니다.

#### `src/TodoForm.test.js`

```jsx
import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import TodoForm from './TodoForm';

describe('<TodoForm />', () => {
  it('has input and a button', () => {
    const { getByText, getByPlaceholderText } = render(<TodoForm />);
    getByPlaceholderText('할 일을 입력하세요'); // input 이 있는지 확인
    getByText('등록'); // button이 있는지 확인
  });

  it('changes input', () => {
    const { getByPlaceholderText } = render(<TodoForm />);
    const input = getByPlaceholderText('할 일을 입력하세요');
    fireEvent.change(input, {
      target: {
        value: 'TDD 배우기'
      }
    });
    expect(input).toHaveAttribute('value', 'TDD 배우기');
  });

  it('calls onInsert and clears input', () => {
    const onInsert = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <TodoForm onInsert={onInsert} />
    );
    const input = getByPlaceholderText('할 일을 입력하세요');
    const button = getByText('등록');
    // 수정하고
    fireEvent.change(input, {
      target: {
        value: 'TDD 배우기'
      }
    });
    // 버튼 클릭
    fireEvent.click(button);
    expect(onInsert).toBeCalledWith('TDD 배우기'); // onInsert 가 'TDD 배우기' 파라미터가 호출됐어야함
    expect(input).toHaveAttribute('value', ''); // input이 비워져야함
  });
});
```

여기서 사용한 `jest.fn()` 은 jest 에서 제공하는 [mock 함수](https://jestjs.io/docs/en/mock-functions)입니다. 이 함수를 사용하면 이 함수가 호출 된 다음 `toBeCalled` 또는 `toBeCalledWith` 같은 matcher 를 사용해서 함수가 호출됐는지, 호출 됐다면 어떤 파라미터로 호출 됐는지 이런 것들을 쉽게 확인 할 수 있습니다.

이렇게, react-testing-library 를 사용하여 테스트 코드를 작성 할 때에는 마치 사용자가 된 입장으로,

1. input 수정하기
2. button 클릭하기

와 같은 흐름으로 테스트 코드를 작성하시면 됩니다.

이제 테스트 코드를 통과시킵시다!

#### `src/TodoForm.js`

```jsx
import React, { useState, useCallback } from 'react';

const TodoForm = ({ onInsert }) => {
  const [value, setValue] = useState('');
  const onChange = useCallback(e => {
    setValue(e.target.value);
  }, []);
  const onSubmit = useCallback(
    e => {
      onInsert(value);
      setValue('');
      e.preventDefault(); // 새로고침을 방지함
    },
    [onInsert, value]
  );

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="할 일을 입력하세요"
        value={value}
        onChange={onChange}
      />
      <button type="submit">등록</button>
    </form>
  );
};

export default TodoForm;
```

테스트 코드가 모두 통과되었나요?

현재 컴포넌트쪽 코드는 리팩토링 할 부분은 딱히 없습니다. 그런데, 테스트 코드 쪽에서는 반복되는 코드가 좀 보입니다.

```js
getByPlaceholderText('할 일을 입력하세요'); // input 이 있는지 확인
getByText('등록'); // button이 있는지 확인
```

위 두 코드가 자주 호출이 되고 있지요.

테스트 코드를 한번 리팩토링해봅시다!

#### `src/TodoForm.test.js`

```jsx
import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import TodoForm from './TodoForm';

describe('<TodoForm />', () => {
  const setup = (props = {}) => {
    const utils = render(<TodoForm {...props} />);
    const { getByText, getByPlaceholderText } = utils;
    const input = getByPlaceholderText('할 일을 입력하세요'); // input 이 있는지 확인
    const button = getByText('등록'); // button이 있는지 확인
    return {
      ...utils,
      input,
      button
    };
  };

  it('has input and a button', () => {
    const { input, button } = setup();
    expect(input).toBeTruthy(); // 해당 값이 truthy 한 값인지 확인
    expect(button).toBeTruthy();
  });

  it('changes input', () => {
    const { input } = setup();
    fireEvent.change(input, {
      target: {
        value: 'TDD 배우기'
      }
    });
    expect(input).toHaveAttribute('value', 'TDD 배우기');
  });

  it('calls onInsert and clears input', () => {
    const onInsert = jest.fn();
    const { input, button } = setup({ onInsert }); // props 가 필요 할땐 이렇게 직접 파라미터로 전달
    // 수정하고
    fireEvent.change(input, {
      target: {
        value: 'TDD 배우기'
      }
    });
    // 버튼 클릭
    fireEvent.click(button);
    expect(onInsert).toBeCalledWith('TDD 배우기'); // onInsert 가 'TDD 배우기' 파라미터가 호출됐어야함
    expect(input).toHaveAttribute('value', ''); // input이 비워져야함
  });
});
```

테스트 코드를 깔끔하게 리팩토링 해주었습니다. 여기서 `setup` 이라는 함수를 따로 만들어주었고 이 안에서 input 과 button 을 찾는 작업을 미리해주고, render 의 결과물 안에 들어있는 함수와 객체들과 input 과 button 을 함께 반환을 해주었습니다. 그리고, setup 함수에서는 props 를 파라미터로 받아오도록 설정해주고 필요할땐 props 를 넣을 수 있게 해주었습니다.

> 꼭 이렇게 setup 을 만들 필요는 없습니다. 개인적인 취향에 따라 이 작업은 생략해도 상관 없습니다.

이제 TodoForm 은 개발이 끝났습니다! 다음 컴포넌트로 넘어가봅시다.

## TodoItem 만들기

이번에는 각 할일 항목을 보여주는 TodoItem 컴포넌트를 만들어봅시다. 아까처럼 비어있는 컴포넌트를 작성해주세요.

#### `src/TodoItem.js`

```jsx
import React from 'react';

const TodoItem = () => {
  return <li />;
};

export default TodoItem;
```

### UI 구성하기

그 다음엔 테스트 케이스를 만들어봅시다. 이번에도 마찬가지로 가장 먼저 할 작업은 UI 를 구성하는 것입니다. 이 컴포넌트는 `id`, `text`, `done` 이 들어있는 `todo` 객체를 props 로 받아와서, 텍스트와 버튼을 보여주어야 합니다.

이번에는 TodoForm 을 위한 테스트 코드를 작성 할 때 만들었었던 `setup` 함수를 처음부터 작성을 해주겠습니다.

#### `src/TodoItem.test.js`

```jsx
import React from 'react';
import TodoItem from './TodoItem';
import { render } from 'react-testing-library';

describe('<TodoItem />', () => {
  const sampleTodo = {
    id: 1,
    text: 'TDD 배우기',
    done: false
  };

  const setup = (props = {}) => {
    const initialProps = { todo: sampleTodo };
    const utils = render(<TodoItem {...initialProps} {...props} />);
    const { getByText } = utils;
    const todo = props.todo || initialProps.todo;
    const span = getByText(todo.text);
    const button = getByText('삭제');
    return {
      ...utils,
      span,
      button
    };
  };

  it('has span and button', () => {
    const { span, button } = setup();
    expect(span).toBeTruthy();
    expect(button).toBeTruthy();
  });
});
```

이에 맞춰 TodoItem 컴포넌트에 span 과 button 을 만들어봅시다.

#### `src/TodoItem.js`

```jsx
import React from 'react';

const TodoItem = ({ todo }) => {
  const { id, text, done } = todo;

  return (
    <li>
      <span>{text}</span>
      <button>삭제</button>
    </li>
  );
};

export default TodoItem;
```

테스트 코드가 통과되었나요?

### done 값에 따라 스타일 바꾸기

이번에는 `todo` 객체가 지니고 있는 `done` 값이 `true` 라면 삭제선이 그어지고 `false` 라면 그어지지 않도록 구현을 해보겠습니다. 테스트 코드를 먼저 작성해보세요.

#### `src/TodoItem.test.js`

```jsx
import React from 'react';
import TodoItem from './TodoItem';
import { render } from 'react-testing-library';

describe('<TodoItem />', () => {
  const sampleTodo = {
    id: 1,
    text: 'TDD 배우기',
    done: false
  };

  const setup = (props = {}) => {
    const initialProps = { todo: sampleTodo };
    const utils = render(<TodoItem {...initialProps} {...props} />);
    const { getByText } = utils;
    const todo = props.todo || initialProps.todo;
    const span = getByText(todo.text);
    const button = getByText('삭제');
    return {
      ...utils,
      span,
      button
    };
  };

  it('has span and button', () => {
    const { span, button } = setup();
    expect(span).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it('shows line-through on span when done is true', () => {
    const { span } = setup({ todo: { ...sampleTodo, done: true } });
    expect(span).toHaveStyle('text-decoration: line-through;');
  });

  it('does not show line-through on span when done is false', () => {
    const { span } = setup({ todo: { ...sampleTodo, done: false } });
    expect(span).not.toHaveStyle('text-decoration: line-through;');
  });
});
```

여기서 `toHaveStyle` 이라는 matcher 를 사용했는데요, 이 함수를 사용하면 해당 DOM 에 특정 스타일이 있는지 쉽게 확인 할 수 있습니다.
그리고 `not` 이라는 키워드를 사용하는 것은 특정 조건이 만족하지 않아야 함을 의미합니다.

### 클릭 이벤트 관리하기

이번에는 텍스트가 클릭됐을때와 버튼이 클릭됐을때 발생하는 이벤트를 관리해보겠습니다. TodoItem 컴포넌트는 done 값을 반전시키는 onToggle 함수, 그리고 항목을 삭제하는 onRemove 함수를 props 로 전달받습니다. span 이 클릭됐을 땐 onToggle 이 호출되고, button 이 클릭됐을 때는 onRemove 가 호출되어야 합니다.

해당 함수들이 호출 될 때에는 자신의 id 를 파라미터로 넣어서 호출해야 합니다.

이에 맞춰 테스트 케이스를 작성해봅시다. 앞으로 작성할 두 테스트 케이스는 비슷한 성격을 가진 테스트 케이스들이니, 한꺼번에 작성해주겠습니다.

#### `src/TodoItem.test.js`

```jsx
import React from 'react';
import TodoItem from './TodoItem';
import { render } from 'react-testing-library';
import { fireEvent } from 'react-testing-library/dist';

describe('<TodoItem />', () => {
  const sampleTodo = {
    id: 1,
    text: 'TDD 배우기',
    done: false
  };
  const setup = (props = {}) => {
    const initialProps = { todo: sampleTodo };
    const utils = render(<TodoItem {...initialProps} {...props} />);
    const { getByText } = utils;
    const todo = props.todo || initialProps.todo;
    const span = getByText(todo.text);
    const button = getByText('삭제');
    return {
      ...utils,
      span,
      button
    };
  };

  it('has span and button', () => {
    const { span, button } = setup();
    expect(span).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it('shows line-through on span when done is true', () => {
    const { span } = setup({ todo: { ...sampleTodo, done: true } });
    expect(span).toHaveStyle('text-decoration: line-through;');
  });

  it('does not show line-through on span when done is false', () => {
    const { span } = setup({ todo: { ...sampleTodo, done: false } });
    expect(span).not.toHaveStyle('text-decoration: line-through;');
  });

  it('calls onToggle', () => {
    const onToggle = jest.fn();
    const { span } = setup({ onToggle });
    fireEvent.click(span);
    expect(onToggle).toBeCalledWith(sampleTodo.id);
  });

  it('calls onRemove', () => {
    const onRemove = jest.fn();
    const { button } = setup({ onRemove });
    fireEvent.click(button);
    expect(onRemove).toBeCalledWith(sampleTodo.id);
  });
});
```

onToggle 과 onRemove 라는 mock 함수를 만들어서 이 함수들이 호출되었는지 검사를 해주었습니다.

이제 이 테스트들을 통과시켜봅시다.

#### `src/TodoItem.js`

```jsx
import React from 'react';

const TodoItem = ({ todo, onToggle, onRemove }) => {
  const { id, text, done } = todo;

  return (
    <li>
      <span
        style={{
          textDecoration: done ? 'line-through' : 'none'
        }}
        onClick={() => onToggle(id)}
      >
        {text}
      </span>
      <button onClick={() => onRemove(id)}>삭제</button>
    </li>
  );
};

export default TodoItem;
```

테스트 코드가 통과됐나요?

여기서 조금 더 리팩토링을 하자면, (굳이 할 필요는 없지만) onClick 에서 사용하는 함수들을 useCallback 을 사용하게 하면 성능을 아주 미세하게 최적화 할 수 있습니다.

#### `src/TodoItem.js`

```jsx
import React, { useCallback } from 'react';

const TodoItem = ({ todo, onToggle, onRemove }) => {
  const { id, text, done } = todo;
  const toggle = useCallback(() => onToggle(id), [id, onToggle]);
  const remove = useCallback(() => onRemove(id), [id, onRemove]);

  return (
    <li>
      <span
        style={{
          textDecoration: done ? 'line-through' : 'none'
        }}
        onClick={toggle}
      >
        {text}
      </span>
      <button onClick={remove}>삭제</button>
    </li>
  );
};

export default TodoItem;
```

## TodoList 만들기

TodoList 컴포넌트는 여러 todos 객체가 들어있는 props 로 받아와서 여러개의 TodoItem 컴포넌트를 렌더링해줍니다.

우선, 비어있는 컴포넌트를 만드세요.

#### `src/TodoList.js`

```jsx
import React from 'react';

const TodoList = () => {
  return <ul />;
};

export default TodoList;
```

### TodoItem 여러개 렌더링하기

그 다음, 테스트 코드를 작성해봅시다. 이번에는 `setup()` 함수를 구현 할 필요는 없습니다.

#### `src/TodoList.test.js`

```jsx
import React from 'react';
import TodoList from './TodoList';
import { render } from 'react-testing-library';

describe('<TodoList />', () => {
  const sampleTodos = [
    {
      id: 1,
      text: 'TDD 배우기',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library 사용하기',
      done: true
    }
  ];

  it('renders todos properly', () => {
    const { getByText } = render(<TodoList todos={sampleTodos} />);
    getByText(sampleTodos[0].text);
    getByText(sampleTodos[1].text);
  });
});
```

첫번째 테스트는 todos 배열을 넣었을 때 두 TodoItem 컴포넌트가 렌더링되었는지 확인하는 것 입니다. 이제 이 테스트를 만족시켜줍시다.

#### `src/TodoList.js`

```jsx
import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos }) => {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </ul>
  );
};

export default TodoList;
```

테스트 케이스가 통과되었나요?

### onToggle 및 onRemove 함수 호출하기

다음 테스트 케이스는, onToggle 과 onRemove 가 잘 호출되는지 확인하는 것 입니다. 이번에는 이 두 기능을 한 테스트 케이스에 묶어서 구현하겠습니다.

#### `src/TodoList.test.js`

```jsx
import React from 'react';
import TodoList from './TodoList';
import { render } from 'react-testing-library';
import { fireEvent } from 'react-testing-library/dist';

describe('<TodoList />', () => {
  const sampleTodos = [
    {
      id: 1,
      text: 'TDD 배우기',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library 사용하기',
      done: true
    }
  ];

  it('renders todos properly', () => {
    const { getByText } = render(<TodoList todos={sampleTodos} />);
    getByText(sampleTodos[0].text);
    getByText(sampleTodos[1].text);
  });

  it('calls onToggle and onRemove', () => {
    const onToggle = jest.fn();
    const onRemove = jest.fn();
    const { getByText, getAllByText } = render(
      <TodoList todos={sampleTodos} onToggle={onToggle} onRemove={onRemove} />
    );

    fireEvent.click(getByText(sampleTodos[0].text));
    expect(onToggle).toBeCalledWith(sampleTodos[0].id);

    fireEvent.click(getAllByText('삭제')[0]); // 첫번째 삭제 버튼을 클릭
    expect(onRemove).toBeCalledWith(sampleTodos[0].id);
  });
});
```

이 테스트 케이스를 통과시켜봅시다!

#### `src/TodoList.js`

```jsx
import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggle, onRemove }) => {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
};

export default TodoList;
```

간단하죠? TodoList 컴포넌트도 이제 완성되었습니다.

## TodoApp 만들기

이제 투두리스트 프로젝트의 마지막 컴포넌트 TodoApp 을 만들어봅시다. 이 컴포넌트에서는 todos 배열에 대한 모든 상태가 관리됩니다. 이번 컴포넌트는 기존에 따로 따로 테스트가 이루어진 컴포넌트들을 함께 사용해서 구현을 하게 되므로, 이번에 작성하게 될 테스트 코드는 일종의 통합테스트입니다. 우선, 다음과 같이 비어있는 컴포넌트를 만들어보세요.

#### `src/TodoApp.js`

```jsx
import React from 'react';

const TodoApp = () => {
  return <div />;
};

export default TodoApp;
```

### TodoForm 과 TodoList 가 렌더링되었는지 확인하기

이 컴포넌트의 첫번째 테스트케이스에서는 TodoForm 컴포넌트와 TodoList 컴포넌트가 렌더링되었는지 확인해주겠습니다.

테스트 케이스를 만들기 전에 TodoList 컴포넌트의 `<ul>` 태그에 `data-testid` 값을 설정해주겠습니다. 이 값을 설정하는 이유는 우리가 잠시 후에 `getByTestId()` 함수를 사용하여 해당 태그의 존재 유무를 확인하기 위함입니다. 물론, `querySelector` 를 사용해서 찾을 수도있는데요, 공식문서에서는 DOM API 로 선택하는 것 대신에 `data-testid` 를 사용 할 것을 권장하고 있기 때문에 이 값을 설정하겠습니다.

#### `src/TodoList.js`

```jsx
import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggle, onRemove }) => {
  return (
    <ul data-testid="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
};

export default TodoList;
```

이제 TodoApp 의 첫번째 테스트 케이스를 작성해보세요.

#### `src/TodoApp.test.js`

```jsx
import React from 'react';
import TodoApp from './TodoApp';
import { render } from 'react-testing-library';

describe('<TodoApp />', () => {
  it('renders TodoForm and TodoList', () => {
    const { getByText, getByTestId } = render(<TodoApp />);
    getByText('등록'); // TodoForm 존재유무 확인
    getByTestId('TodoList'); // TodoList 존재유무 확인
  });
});
```

이 테스트 코드를 통과시켜봅시다. TodoList 컴포넌트를 렌더링할때에는 임시적으로 todos props 를 비어있는 배열로 설정해주세요.

#### `src/TodoApp.js`

```jsx
import React from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const TodoApp = () => {
  return (
    <>
      <TodoForm data-testid="helloworld" />
      <TodoList todos={[]} />
    </>
  );
};

export default TodoApp;
```

### 기본 할 일 항목 두개 보여주기

할 일 목록에 두개의 항목을 기본적으로 보여주도록 설정하겠습니다. 두번째 테스트 케이스를 다음과 같이 작성해보세요.

#### `src/TodoApp.test.js`

```jsx
import React from 'react';
import TodoApp from './TodoApp';
import { render } from 'react-testing-library';

describe('<TodoApp />', () => {
  it('renders TodoForm and TodoList', () => {
    const { getByText, getByTestId } = render(<TodoApp />);
    getByText('등록'); // TodoForm 존재유무 확인
    getByTestId('TodoList'); // TodoList 존재유무 확인
  });

  it('renders two defaults todos', () => {
    const { getByText } = render(<TodoApp />);
    getByText('TDD 배우기');
    getByText('react-testing-library 사용하기');
  });
});
```

이제 TodoApp 에서 두개의 todo 객체가 들어있는 배열을 `useState` 를 통해서 상태관리를 해주도록 하겠습니다.

#### `src/TodoApp.js`

```jsx
import React, { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'TDD 배우기',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library 사용하기',
      done: true
    }
  ]);
  return (
    <>
      <TodoForm />
      <TodoList todos={todos} />
    </>
  );
};

export default TodoApp;
```

테스트 케이스가 통과되었나요?

### 새 항목 추가 기능 구현하기

새 항목 추가 기능을 위한 테스트 케이스를 만들어보세요. TodoForm 의 테스트 케이스에서 했던 작업과 꽤나 유사한데, 이벤트 발생 시킨 후 새로 추가 한 항목이 있는지 검증을 해주어야합니다.

#### `src/TodoApp.test.js`

```jsx
import React from 'react';
import TodoApp from './TodoApp';
import { render, fireEvent } from 'react-testing-library';

describe('<TodoApp />', () => {
  it('renders TodoForm and TodoList', () => {
    const { getByText, getByTestId } = render(<TodoApp />);
    getByText('등록'); // TodoForm 존재유무 확인
    getByTestId('TodoList'); // TodoList 존재유무 확인
  });

  it('renders two defaults todos', () => {
    const { getByText } = render(<TodoApp />);
    getByText('TDD 배우기');
    getByText('react-testing-library 배우기');
  });

  it('creates new todo', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp />);
    // 이벤트를 발생시켜서 새 항목을 추가하면
    fireEvent.change(getByPlaceholderText('할 일을 입력하세요'), {
      target: {
        value: '새 항목 추가하기'
      }
    });
    fireEvent.click(getByText('등록'));
    // 해당 항목이 보여져야합니다.
    getByText('새 항목 추가하기');
  });
});
```

위 테스트 케이스를 통과시켜봅시다.

#### `src/TodoApp.js`

```jsx
import React, { useState, useCallback, useRef } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'TDD 배우기',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library 배우기',
      done: true
    }
  ]);
  const nextId = useRef(3); // 새로 추가 할 항목에서 사용 할 id

  const onInsert = useCallback(
    text => {
      // 새 항목 추가 후
      setTodos(
        todos.concat({
          id: nextId.current,
          text,
          done: false
        })
      );
      // nextId 값에 1 더하기
      nextId.current += 1;
    },
    [todos]
  );

  return (
    <>
      <TodoForm onInsert={onInsert} />
      <TodoList todos={todos} />
    </>
  );
};

export default TodoApp;
```

테스트 코드가 통과되었으면 다음 기능을 구현해봅시다.

### 토글 기능 구현하기

이번에는, 토글 기능을 구현해봅시다. 테스트 케이스를 다음과 같이 작성해보세요.

#### `src/TodoApp.js`

```jsx
import React from 'react';
import TodoApp from './TodoApp';
import { render, fireEvent } from 'react-testing-library';

describe('<TodoApp />', () => {
  it('renders TodoForm and TodoList', () => {
    const { getByText, getByTestId } = render(<TodoApp />);
    getByText('등록'); // TodoForm 존재유무 확인
    getByTestId('TodoList'); // TodoList 존재유무 확인
  });

  it('renders two defaults todos', () => {
    const { getByText } = render(<TodoApp />);
    getByText('TDD 배우기');
    getByText('react-testing-library 배우기');
  });

  it('creates new todo', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp />);
    // 이벤트를 발생시켜서 새 항목을 추가하면
    fireEvent.change(getByPlaceholderText('할 일을 입력하세요'), {
      target: {
        value: '새 항목 추가하기'
      }
    });
    fireEvent.click(getByText('등록'));
    // 해당 항목이 보여져야합니다.
    getByText('새 항목 추가하기');
  });

  it('toggles todo', () => {
    const { getByText } = render(<TodoApp />);
    // TDD 배우기 항목에 클릭 이벤트를 발생시키고 text-decoration 속성이 설정되는지 확인
    const todoText = getByText('TDD 배우기');
    expect(todoText).toHaveStyle('text-decoration: line-through;');
    fireEvent.click(todoText);
    expect(todoText).not.toHaveStyle('text-decoration: line-through;');
    fireEvent.click(todoText);
    expect(todoText).toHaveStyle('text-decoration: line-through;');
  });
});
```

이제 이 테스트 코드를 통과시켜봅시다.

#### `src/TodoApp.js`

```jsx
import React, { useState, useCallback, useRef } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'TDD 배우기',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library 배우기',
      done: true
    }
  ]);
  const nextId = useRef(3); // 새로 추가 할 항목에서 사용 할 id

  const onInsert = useCallback(
    text => {
      // 새 항목 추가 후
      setTodos(
        todos.concat({
          id: nextId.current,
          text,
          done: false
        })
      );
      // nextId 값에 1 더하기
      nextId.current += 1;
    },
    [todos]
  );

  const onToggle = useCallback(
    id => {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      );
    },
    [todos]
  );
  return (
    <>
      <TodoForm onInsert={onInsert} />
      <TodoList todos={todos} onToggle={onToggle} />
    </>
  );
};

export default TodoApp;
```

테스트 코드가 통과되었나요? 이제 마지막 기능을 구현해봅시다.

### 삭제 기능 구현하기

이번 기능은 항목을 삭제하는 기능입니다. 우리가 이전에 TodoList 에서 첫번째 항목의 삭제 버튼을 선택 할 때 `getAllByText` 를 사용했었는데요, 이번에는 그 대신에 텍스트로 항목을 찾은 다음 해당 엘리먼트의 `sibling` 엘리먼트를 참조하여 버튼을 선택해서 클릭 이벤트를 발생시켜보겠습니다.

테스트 케이스를 다음과 같이 작성해보세요.

#### `src/TodoApp.test.js`

```jsx
import React from 'react';
import TodoApp from './TodoApp';
import { render, fireEvent } from 'react-testing-library';

describe('<TodoApp />', () => {
  it('renders TodoForm and TodoList', () => {
    const { getByText, getByTestId } = render(<TodoApp />);
    getByText('등록'); // TodoForm 존재유무 확인
    getByTestId('TodoList'); // TodoList 존재유무 확인
  });

  it('renders two defaults todos', () => {
    const { getByText } = render(<TodoApp />);
    getByText('TDD 배우기');
    getByText('react-testing-library 배우기');
  });

  it('creates new todo', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp />);
    // 이벤트를 발생시켜서 새 항목을 추가하면
    fireEvent.change(getByPlaceholderText('할 일을 입력하세요'), {
      target: {
        value: '새 항목 추가하기'
      }
    });
    fireEvent.click(getByText('등록'));
    // 해당 항목이 보여져야합니다.
    getByText('새 항목 추가하기');
  });

  it('toggles todo', () => {
    const { getByText } = render(<TodoApp />);
    // TDD 배우기 항목에 클릭 이벤트를 발생시키고 text-decoration 속성이 설정되는지 확인
    const todoText = getByText('TDD 배우기');
    expect(todoText).toHaveStyle('text-decoration: line-through;');
    fireEvent.click(todoText);
    expect(todoText).not.toHaveStyle('text-decoration: line-through;');
    fireEvent.click(todoText);
    expect(todoText).toHaveStyle('text-decoration: line-through;');
  });

  it('removes todo', () => {
    const { getByText } = render(<TodoApp />);
    const todoText = getByText('TDD 배우기');
    const removeButton = todoText.nextSibling;
    fireEvent.click(removeButton);
    expect(todoText).not.toBeInTheDocument(); // 페이지에서 사라졌음을 의미함
  });
});
```

특정 엘리먼트가 화면에서 사라졌는지 확인하기 위해서, jest 확장 matcher 인 `toBeInTheDocument()` 를 사용하였습니다. 이를 사용하지 않는다면, 다음과 같이 구현 할 수있습니다.

```js
const removedText = queryByText('TDD 배우기');
expect(removedText).toBeNull();
```

테스트 케이스를 다 작성하셨다면, 이 테스트 케이스를 통과시켜봅시다.

#### `src/TodoApp.js`

```jsx
import React, { useState, useCallback, useRef } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'TDD 배우기',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library 배우기',
      done: true
    }
  ]);
  const nextId = useRef(3); // 새로 추가 할 항목에서 사용 할 id

  const onInsert = useCallback(
    text => {
      // 새 항목 추가 후
      setTodos(
        todos.concat({
          id: nextId.current,
          text,
          done: false
        })
      );
      // nextId 값에 1 더하기
      nextId.current += 1;
    },
    [todos]
  );

  const onToggle = useCallback(
    id => {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      );
    },
    [todos]
  );

  const onRemove = useCallback(
    id => {
      setTodos(todos.filter(todo => todo.id !== id));
    },
    [todos]
  );

  return (
    <>
      <TodoForm onInsert={onInsert} />
      <TodoList todos={todos} onToggle={onToggle} onRemove={onRemove} />
    </>
  );
};

export default TodoApp;
```

테스트가 모두 통과되었나요? 이제 TodoApp 을 App 에서 렌더링 한 후, `yarn start` 명령어를 입력하여 우리가 만든 투두리스트를 브라우저에 띄워보세요.

#### `src/App.js`

```jsx
import React from 'react';
import TodoApp from './TodoApp';

const App = () => {
  return <TodoApp />;
};

export default App;
```

브라우저상의 투두리스트가 잘 작동하나요? TDD 흐름으로 개발을 하니까, 브라우저를 한번도 띄우지 않고도 컴포넌트들의 요구사항을 모두 충족시킬 수 있었습니다.

> 그렇다고 해서 TDD 흐름으로 개발 할 때 브라우저로 실제로 확인해가면서 하지말라는 것은 아닙니다.

## 리팩토링

테스트 코드가 있다면, 리팩토링을 조금 더 자신있게 해줄 수 있습니다. 테스트 코드가 통과하면 기능이 잘 작동 할 것이라고 보장을 해주기 때문이죠.

### 리렌더링 성능 최적화

지금은 TodoItem 이 추가되거나, 수정되거나, 삭제 될 때 애플리케이션에 보여지고 모든 TodoItem 컴포넌트들이 리렌더링이 되고 있습니다. 이를 방지하기 위해서는 TodoItem 컴포넌트를 `React.memo` 로 감싸주어야합니다.

#### `src/TodoItem.js`

```jsx
import React, { useCallback } from 'react';

const TodoItem = ({ todo, onToggle, onRemove }) => {
  const { id, text, done } = todo;
  const toggle = useCallback(() => onToggle(id), [id, onToggle]);
  const remove = useCallback(() => onRemove(id), [id, onRemove]);

  return (
    <li>
      <span
        style={{
          textDecoration: done ? 'line-through' : 'none'
        }}
        onClick={toggle}
      >
        {text}
      </span>
      <button onClick={remove}>삭제</button>
    </li>
  );
};

export default React.memo(TodoItem);
```

그런데, 지금 상황에서는 TodoApp 컴포넌트에서 `todos` 배열이 바뀔 때 마다 `onToggle` 함수와 `onRemove` 함수가 `useCallback` 에 의하여 계속 새로워지고 있기 때문에 이렇게 `React.memo` 를 사용한다고 해서 최적화가 되지 않습니다.

이를 해결하기 위해선 `todos` 배열을 관리하는 로직을 `useReducer` 로 구현을 하거나, `useState` 의 setter 함수를 사용 할 때 새로운 상태를 파라미터로 넣어주는 대신, updater 함수를 파라미터로 넣어주면 됩니다 [(참고)](https://reactjs.org/docs/hooks-reference.html#functional-updates).

그럼, 한번 리팩토링을 해봅시다.

#### `src/TodoApp.js`

```jsx
import React, { useState, useCallback, useRef } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'TDD 배우기',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library 배우기',
      done: true
    }
  ]);
  const nextId = useRef(3); // 새로 추가 할 항목에서 사용 할 id

  const onInsert = useCallback(text => {
    // 새 항목 추가 후
    setTodos(todos =>
      todos.concat({
        id: nextId.current,
        text,
        done: false
      })
    );
    // nextId 값에 1 더하기
    nextId.current += 1;
  }, []);

  const onToggle = useCallback(id => {
    setTodos(todos =>
      todos.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  }, []);

  const onRemove = useCallback(id => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }, []);

  return (
    <>
      <TodoForm onInsert={onInsert} />
      <TodoList todos={todos} onToggle={onToggle} onRemove={onRemove} />
    </>
  );
};

export default TodoApp;
```

단순히, setTodos 를 사용 할 때 앞부분에 `todos =>` 를 넣어주면 됩니다. 이렇게 하면, `useCallback` 의 두번째 파라미터로 들어가는 `deps` 배열을 비워주셔도 됩니다.

이제 `onToggle` 과 `onRemove` 함수는 컴포넌트가 처음 렌더링할때만 한번 만들어지고, 그 이후에는 이미 만든 함수를 재사용하게 되기 때문에, TodoItem 컴포넌트에서 `React.memo` 로 성능 최적화를 해준 것이 비로소 유효해집니다.

이렇게, 테스트 코드가 있으면 리팩토링을 하고 나서 굳이 브라우저상에서 수동으로 일일히 사용을 해볼 필요가 없기 때문에 시간을 정말 많이 아낄 수 있습니다.
