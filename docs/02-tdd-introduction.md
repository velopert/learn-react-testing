# 2. TDD 의 소개

TDD (Test Driven Development · 테스트 주도 개발) 에 대해서 알아봅시다! TDD 는 테스트가 개발을 이끌어 나가는 형태의 개발론입니다.
가장 쉽게 설명하자면, 선 테스트 코드 작성, 후 구현 인데요, 이는 총 3가지 주요 절차로 이루어져있습니다.

![](https://i.imgur.com/wcbaeLC.png)

## TDD 의 3가지 절차

### 실패

첫번째 절차는 실패입니다. 이는, 실패하는 테스트 케이스를 먼저 만들라는 것 입니다. 실패하는 테스트 케이스를 만들 때는 프로젝트의 전체 기능에 대하여 처음부터 모든 테스트 케이스를 작성하는 것이 아니라, 지금 가장 먼저 구현할 기능 하나씩 테스트 케이스를 작성합니다.

> 개발팀/상황에 따라 한꺼번에 여러 테스트 케이스를 먼저 작성하기도 합니다.

### 성공

두번째 절차는 성공입니다. 우리가 작성하는 실패하는 테스트 케이스를 통과시키기 위하여, 코드를 작성하여 테스트를 통과시키는 것 입니다.

### 리팩토링

세번째 절차는 리팩토링입니다. 우리가 구현한 코드에 중복되는 코드가 있거나, 혹은 더 개선시킬 방법이 있다면 리팩토링을 진행합니다. 리팩토링을 진행하고 나서도 테스트 케이스가 성공하는지 확인합니다. 이 절차가 끝났다면, 다시 첫번째 절차로 돌아가서 다음 기능 구현을 위하여 새로운 실패하는 테스트 케이스를 작성하세요.

## TDD 의 장점

TDD 를 진행하면서 테스트 케이스를 작성할때 주로 작은 단위로 만들기 때문에, 코드를 작성 할 때 코드가 너무 방대해지지 않고, 코드의 모듈화가 자연스럽게 잘 이루어지면서 개발이 진행됩니다.

TDD 를 하면 자연스레 테스트 커버리지가 높아질 수 밖에 없습니다. 테스트를 먼저 작성을 하고 구현을 하니까요. 테스트 커버리지가 높아지면 결국 리팩토링도 쉬워지고 유지보수도 쉬워집니다. 결국 프로젝트의 퀄리티를 높이기에 좋은 환경이 구성됩니다. 추가적으로, 협업을 할때도 매우 도움이 되지요.

그리고, 버그에 낭비하는 시간도 최소한으로 할 수 있고 우리가 구현한 기능이 요구사항을 충족하는지 쉽게 확인 할 수 있습니다.

## TDD 연습

이번 연습에서는 배열이 주어졌을 때 최댓값, 최솟값, 평균, 중앙값, 최빈값을 구하는 함수들을 구현해보겠습니다.

먼저 파일 두개를 만들어주세요:

- stats.js
- stats.test.js

### 최댓값 구하기

먼저 최댓값을 구하는 테스트케이스를 작성해봅시다.

#### `stats.test.js`

```javascript
const stats = require('./stats');

describe('stats', () => {
  it('gets maximum value', () => {
    expect(stats.max([1, 2, 3, 4])).toBe(4);
  });
});
```

`stats.max` 함수가 존재하지 않으니 _TypeError: stats.max is not a function_ 이런 오류가 뜰 것입니다. 그럼, `max` 함수를 stats.js 에 구현해봅시다.

#### `stats.js`

```javascript
exports.max = numbers => {
  let result = numbers[0];
  numbers.forEach(n => {
    if (n > result) {
      result = n;
    }
  });
  return result;
};
```

이렇게 하고 나면 테스트 케이스가 통과하겠죠? 그 다음엔 이 코드를 어떻게 하면 리팩토링 할 수 있을까.. 고민해봅시다. JavaScript 를 잘 활용할줄 아신다면 왜 이걸 이렇게 구현했나 의아해 하실정도로, 더 쉬운 방법이 있습니다.

바로 `Math.max` 함수를 사용하는 것이죠.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
```

리팩토링 끝!

### 최솟값 구하기

먼저 실패하는 테스트 케이스를 작성합니다.

#### `stats.test.js`

```javascript
const stats = require('./stats');

describe('stats', () => {
  it('gets maximum value', () => {
    expect(stats.max([1, 2, 3, 4])).toBe(4);
  });
  it('gets minimum value', () => {
    expect(stats.min([1, 2, 3, 4])).toBe(1);
  });
});
```

그 다음에는 이 테스트 케이스를 통과시켜봅시다.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
```

테스트 코드가 통과됐나요? 여기서 딱히 리팩토링 할 방법은 없으니 리팩토링 절차는 생략하겠습니다.

### 평균값 구하기

이번에는 평균값을 구해봅시다! 우선 평균값을 구하는 테스트 케이스를 작성해보세요.

#### `stats.test.js`

```javascript
const stats = require('./stats');

describe('stats', () => {
  it('gets maximum value', () => {
    expect(stats.max([1, 2, 3, 4])).toBe(4);
  });
  it('gets minimum value', () => {
    expect(stats.min([1, 2, 3, 4])).toBe(1);
  });
  it('gets average value', () => {
    expect(stats.avg([1, 2, 3, 4, 5])).toBe(3);
  });
});
```

실패하는 테스트 케이스가 잘 만들어졌나요? 그럼 구현을 시작해봅시다.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers => {
  const sum = numbers.reduce((acc, current) => acc + current, 0);
  return sum / numbers.length;
};
```

테스트 케이스가 통과했지요? 여기서 조금 더 리팩토링을 하자면.. 맨 마지막 `sum / numbers.length` 부분을 굳이 저렇게 바깥에 넣지 않고 reduce 함수 내부에서 처리하게 할 수도 있습니다. 한번 해볼까요?

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, array) =>
      index === array.length - 1
        ? (acc + current) / array.length
        : acc + current,
    0
  );
```

음.. 해보니까 통과는 하는데 코드의 가독성이 오히려 안좋아졌습니다. 또 다시 바꿔볼까요?

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, array) => acc + current / array.length,
    0
  );
```

방금 전 보다는 괜찮아졌습니다. 여기서 또! 리팩토링 할 수 있는게 있습니다.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, { length }) => acc + current / length,
    0
  );
```

배열의 `length` 를 구조 분해 문법을 사용하여 따로 추출해주었습니다.

### 중앙값 구하기

이번에는 중앙값을 구하는 기능을 구현해봅시다. 중앙값을 구현하기 전에 우선 배열을 정렬해야합니다. 정렬하는 함수를 먼저 구현해볼건데요, 이를 위한 테스트 케이스를 작성해보세요.

#### `stats.test.js`

```javascript
const stats = require('./stats');

describe('stats', () => {
  it('gets maximum value', () => {
    expect(stats.max([1, 2, 3, 4])).toBe(4);
  });
  it('gets minimum value', () => {
    expect(stats.min([1, 2, 3, 4])).toBe(1);
  });
  it('gets average value', () => {
    expect(stats.avg([1, 2, 3, 4, 5])).toBe(3);
  });
  describe('median', () => {
    it('sorts the array', () => {
      expect(stats.sort([5, 4, 1, 2, 3])).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
```

`describe` 내부에서 또 `describe` 를 쓸 수 있습니다. 단, `it` 내부에 또다른 `it` 이나 `describe` 를 쓸 수는 없습니다.

위 테스트 케이스에서는 우리가 `toBe` 가 아닌 `toEqual` 을 사용했는데요 이는 객체 또는 배열을 비교해야하는 상황에서 사용합니다.

이제 sort 를 구현해줍시다.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, { length }) => acc + current / length,
    0
  );

exports.sort = numbers => numbers.sort((a, b) => a - b);
```

이제, 중앙값을 구현해줄건데요, 중앙값은 자료의 개수가 홀수개일때랑 짝수개일때랑 알아내는 방법이 다릅니다.

`[1,2,3,4,5]` 처럼 숫자가 5개면, 중앙값은 3이 됩니다.
`[1,2,3,4,5,6]` 처럼 숫자가 6개면, 중앙에 있는 값 3 + 4 / 2 의 결과인 3.5가 중앙값이 됩니다.

그럼 위 요구사항에 맞춰 테스트 케이스를 작성해볼까요?

#### `stats.test.js`

```javascript
const stats = require('./stats');

describe('stats', () => {
  it('gets maximum value', () => {
    expect(stats.max([1, 2, 3, 4])).toBe(4);
  });
  it('gets minimum value', () => {
    expect(stats.min([1, 2, 3, 4])).toBe(1);
  });
  it('gets average value', () => {
    expect(stats.avg([1, 2, 3, 4, 5])).toBe(3);
  });
  describe('median', () => {
    it('sorts the array', () => {
      expect(stats.sort([5, 4, 1, 2, 3])).toEqual([1, 2, 3, 4, 5]);
    });
    it('gets the median for odd length', () => {
      expect(stats.median([1, 2, 3, 4, 5])).toBe(3);
    });
    it('gets the median for even length', () => {
      expect(stats.median([1, 2, 3, 4, 5, 6])).toBe(3.5);
    });
  });
});
```

테스트 케이스들을 만들었으면, 구현을 해봅시다.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, { length }) => acc + current / length,
    0
  );

exports.sort = numbers => numbers.sort((a, b) => a - b);
exports.median = numbers => {
  const middle = Math.floor(numbers.length / 2);

  if (numbers.length % 2) {
    // 홀수
    return numbers[middle];
  }
  return (numbers[middle - 1] + numbers[middle]) / 2;
};
```

리팩토링을 조금 해볼까요?

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, { length }) => acc + current / length,
    0
  );

exports.sort = numbers => numbers.sort((a, b) => a - b);
exports.median = numbers => {
  const { length } = numbers;
  const middle = Math.floor(length / 2);
  return length % 2
    ? numbers[middle]
    : (numbers[middle - 1] + numbers[middle]) / 2;
};
```

테스트 케이스가 여전히 잘 통과하고 있나요?

### 최빈값 구하기

최빈값은 배열에서 가장 빈도가 높은 값 입니다. 이 값은 배열 안에 어떤 숫자들이 있느냐에 따라 형태가 다릅니다.

1. 주어진 값들 중에서 가장 자주 나타난 값이 결과가 됩니다.
   - `[1,2,2,2,3]` → `2`
2. 모든 값들의 빈도가 똑같다면 최빈값은 없습니다.
   - `[1,2,3]`, `[1,1,2,2,3,3]` → `null`
3. 빈도가 똑같은 값이 여러개라면, 결과값도 여러개입니다.
   - `[1,2,2,3,3,4]` → `[2,3]`

그럼, 위 요구사항에 맞춰서 테스트 케이스들을 만들어볼까요?

#### `stats.test.js`

```javascript
const stats = require('./stats');

describe('stats', () => {
  it('gets maximum value', () => {
    expect(stats.max([1, 2, 3, 4])).toBe(4);
  });
  it('gets minimum value', () => {
    expect(stats.min([1, 2, 3, 4])).toBe(1);
  });
  it('gets average value', () => {
    expect(stats.avg([1, 2, 3, 4, 5])).toBe(3);
  });
  describe('median', () => {
    it('sorts the array', () => {
      expect(stats.sort([5, 4, 1, 2, 3])).toEqual([1, 2, 3, 4, 5]);
    });
    it('gets the median for odd length', () => {
      expect(stats.median([1, 2, 3, 4, 5])).toBe(3);
    });
    it('gets the median for even length', () => {
      expect(stats.median([1, 2, 3, 4, 5, 6])).toBe(3.5);
    });
  });
  describe('mode', () => {
    it('has one mode', () => {
      expect(stats.mode([1, 2, 2, 2, 3])).toBe(2);
    });
    it('has no mode', () => {
      expect(stats.mode([1, 2, 3])).toBe(null);
    });
    it('has multiple mode', () => {
      expect(stats.mode([1, 2, 2, 3, 3, 4])).toEqual([2, 3]);
    });
  });
});
```

그럼, 요구사항에 맞춰서 하나하나 구현해봅시다! 이번에 충족해야하는 조건들이 꽤 많은데, 순서대로 하나씩 처리해봅시다.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, { length }) => acc + current / length,
    0
  );

exports.sort = numbers => numbers.sort((a, b) => a - b);
exports.median = numbers => {
  const { length } = numbers;
  const middle = Math.floor(length / 2);
  return length % 2
    ? numbers[middle]
    : (numbers[middle - 1] + numbers[middle]) / 2;
};
exports.mode = numbers => {
  const counts = new Map();
  numbers.forEach(n => {
    const count = counts.get(n) || 0;
    counts.set(n, count + 1);
  });
  const maxCount = Math.max(...counts.values());
  const result = [...counts.keys()].find(
    number => counts.get(number) === maxCount
  );
  return result;
};
```

여기까지 구현하면, `mode` 함수의 첫번째 테스트 케이스가 만족된것을 볼 수 있습니다.

![](https://i.imgur.com/6pw1TJE.png)

나머지 테스트 케이스들도 충족시켜봅시다.

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, { length }) => acc + current / length,
    0
  );

exports.sort = numbers => numbers.sort((a, b) => a - b);
exports.median = numbers => {
  const { length } = numbers;
  const middle = Math.floor(length / 2);
  return length % 2
    ? numbers[middle]
    : (numbers[middle - 1] + numbers[middle]) / 2;
};

exports.mode = numbers => {
  const counts = new Map();
  numbers.forEach(n => {
    const count = counts.get(n) || 0;
    counts.set(n, count + 1);
  });
  const maxCount = Math.max(...counts.values());
  const modes = [...counts.keys()].filter(
    number => counts.get(number) === maxCount
  );

  if (modes.length === numbers.length) {
    // 최빈값이 없음
    return null;
  }

  if (modes.length > 1) {
    // 최빈값이 여러개
    return modes;
  }

  // 최빈값이 하나
  return modes[0];
};
```

구현을 하고나면, 모든 테스트 케이스가 통과 할 것입니다!

![](https://i.imgur.com/d8AsDXg.png)

이제 리팩토링을 좀 시도해볼까요?

#### `stats.js`

```javascript
exports.max = numbers => Math.max(...numbers);
exports.min = numbers => Math.min(...numbers);
exports.avg = numbers =>
  numbers.reduce(
    (acc, current, index, { length }) => acc + current / length,
    0
  );

exports.sort = numbers => numbers.sort((a, b) => a - b);
exports.median = numbers => {
  const { length } = numbers;
  const middle = Math.floor(length / 2);
  return length % 2
    ? numbers[middle]
    : (numbers[middle - 1] + numbers[middle]) / 2;
};

exports.mode = numbers => {
  const counts = numbers.reduce(
    (acc, current) => acc.set(current, acc.get(current) + 1 || 1),
    new Map()
  );

  const maxCount = Math.max(...counts.values());
  const modes = [...counts.keys()].filter(
    number => counts.get(number) === maxCount
  );

  if (modes.length === numbers.length) {
    // 최빈값이 없음
    return null;
  }

  if (modes.length > 1) {
    // 최빈값이 여러개
    return modes;
  }

  // 최빈값이 하나
  return modes[0];
};
```

기존에 `forEach` 로 처리하던 부분을 `reduce` 를 사용하여 구현해주었습니다.

## 정리

이번 실습을 통하여 여러분은 TDD 를 맛보기식으로 체험해보았습니다. 테스트 코드가 존재하니까 리팩토링을 하기가 훨씬 편하다는 것을 경험하셨나요? 추가적으로, 요구사항을 제대로 만족시키는것을 시각적으로 확인 할 수도 있고, 개발을 하게 될 때 각 테스트 케이스에 맞춰서 할 수 있다는 점에서 우리가 해결하고자 하는 문제에 조금 더 집중을 할 수도 있었습니다.
