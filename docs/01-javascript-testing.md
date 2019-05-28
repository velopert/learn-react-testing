# 1. 자바스크립트 테스팅의 기초

자바스크립트로 작성된 프로젝트에 테스트 자동화를 사용 할 때 사용 할 수 있는 도구는 다양합니다. 리스팅을 해보자면 다음과 같습니다.

- Karma
- Jasmine
- Jest
- Chai
- Mocha

종류가 정말 다양하지요? 이 도구들은 비슷한 작업을 처리하지만 각각 다른 특성들을 가지고 있습니다. 각 도구들의 차이점들을 보고 싶으시다면 이 [링크](https://medium.com/welldone-software/an-overview-of-javascript-testing-in-2019-264e19514d0a)를 읽어보시면 도움 이 될 수 있습니다.

이 튜토리얼에서는, 설정이 간단하고 시작하기 편한 Jest 를 사용하겠습니다. Jest 는 페이스북 팀에서 Jasmine 기반으로 만든 테스팅 프레임워크입니다. CRA 로 만든 프로젝트에는 자동으로 적용이 되어있습니다.

## 작업환경 설정

리액트에서 테스트 코드를 작성해보기전에, 간단한 자바스크립트 함수들의 테스트 코드를 작성해보겠습니다.

새로운 디렉터리를 만들고, 그 안에서 `yarn init -y` 명령어 (혹은 `npm init -y`) 를 입력하여 새 자바스크립트 프로젝트를 생성하세요.

그 안에서, jest 를 설치하세요.

```bash
$ yarn add jest
# 혹은 npm install --save jest
```

> 여러분이 만약 VS Code 를 사용하신다면, @types/jest 도 설치하시면 VS Code 에서 인텔리센스 지원을 받을 수 있습니다.
>
> ```bash
> $ yarn add @types/jest
> ```

## 첫번째 테스트 작성하기

이제, sum.js 라는 파일을 해당 디렉터리에 만들어보세요.

#### `sum.js`

```javascript
function sum(a, b) {
  return a + b;
}

module.exports = sum; // 내보내기
```

진짜 간단한 함수죠? 이게 정말 잘 작동하는지 테스트 코드를 작성해보겠습니다. 같은 디렉터리에 sum.test.js 를 작성해보세요.

#### `sum.test.js`

```javascript
const sum = require('./sum');

test('1 + 2 = 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

여기서 사용한 `test` 라는 함수는, 새로운 테스트 케이스를 만드는 함수입니다. 그리고 `expect`는 특정 값이 ~~ 일 것이다 라고 사전에 정의를 하고, 통과를 하면 테스트를 성공시키고 통과를 하지 않으면 테스트를 실패시킵니다. `toBe` 는 [matchers](https://jestjs.io/docs/en/using-matchers) 라고 부르는 함수인데요, 특정 값이 어떤 조건을 만족하는지, 또는 어떤 함수가 실행이 됐는지, 에러가 났는지 등을 확인 할 수 있게 해줍니다. 여기서 toBe 는 특정 값이 우리가 정한 값과 일치하는지 확인을 해줍니다.

그리고 나서 jest 를 실행해보겠습니다. package.json 에 `scripts` 를 다음과 같이 추가하세요.

```javascript
{
  "name": "javascript",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@types/jest": "^24.0.13",
    "jest": "^24.8.0"
  },
  "scripts": {
    "test": "jest --watchAll --verbose"
  }
}
```

그 다음엔 터미널에서 방금 추가한 test 스크립트를 실행하세요.

```bash
$ yarn test # 혹은 npm test
```

![](https://i.imgur.com/v8i6iVM.png)

이런 결과물이 나타났나요?

한번 sum 함수를 다음과 같이 이상하게 수정해봅시다.

#### `sum.js`

```javascript
function sum(a, b) {
  return a - b;
}

module.exports = sum; // 내보내기
```

sum 에서는 값을 더해야되는데, 빼기를 해줬죠? 어떤 결과가 나타나는지 볼까요?

![](https://i.imgur.com/fsflqys.png)

우리가 의도한대로 작동을 하지 않으면, 이렇게 오류가 납니다. 오류를 확인했으면 다시 `a + b` 로 고쳐주세요.

## test 대신 it

우리가 새로운 테스트 케이스를 만들 때, `test` 라는 키워드를 사용했는데요, 이 키워드 말고 `it` 이라는 키워드를 사용 할 수도 있습니다. 작동방식은 완전히 똑같습니다. `it`을 사용하게 되면 테스트 케이스 설명을 영어로 작성하게 되는 경우, "말이 되게" 작성 할 수 있습니다.

#### `sum.test.js`

```javascript
const sum = require('./sum');

it('calculates 1 + 2', () => {
  expect(sum(1, 2)).toBe(3);
});
```

테스트 케이스의 설명은 한국어로 적어도 상관은 없습니다. 영어로도 충분히 설명 할 수 있으면 영어로 하는게 좋겠지만, 한국어로 사용 할 때 더 쉽게 이해 할 수 있는 설명이라면 한국어로 작성하는것이 좋습니다.

#### `sum.test.js`

```javascript
const sum = require('./sum');

it('1 + 2 잘 더해진다', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## describe 를 사용해서 여러 테스트 케이스를 묶기

우리가 테스트 케이스를 작성 할 때 `describe` 라는 키워드를 사용하면 여러 테스트 케이스를 묶을 수 있습니다. 먼저 sum.js 에 배열의 총합을 구해주는 `sumOf` 를 구현해봅시다.

#### sum.js

```javascript
function sum(a, b) {
  return a + b;
}

function sumOf(numbers) {
  let result = 0;
  numbers.forEach(n => {
    result += n;
  });
  return result;
}

// 각각 내보내기
exports.sum = sum;
exports.sumOf = sumOf;
```

현재 여러 함수를 내보내고 있기 때문에 테스트 케이스가 망가졌을 것입니다. 다음과 같이 테스트 코드를 수정하세요.

#### `sum.test.js`

```javascript
const { sum, sumOf } = require('./sum');

describe('sum', () => {
  it('calculates 1 + 2', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('calculates all numbers', () => {
    const array = [1, 2, 3, 4, 5];
    expect(sumOf(array)).toBe(15);
  });
});
```

이렇게 describe 로 감싸주고 나면, 여러 테스트 케이스가 sum 이라는 이름으로 분류됩니다.

![](https://i.imgur.com/CP1J77P.png)

## 리팩토링

테스트 코드를 작성 했을 때 얻을 수 있는 이점은, 리팩토링 이후 코드가 제대로 작동하고 있는 것을 검증하기 매우 간편하다는 것 입니다. 한번 `sumOf` 함수를 다음과 같이 리팩토링해보세요.

#### `sum.js`

```javascript
function sum(a, b) {
  return a + b;
}

function sumOf(numbers) {
  return numbers.reduce((acc, current) => acc + current, 0);
}

// 각각 내보내기
exports.sum = sum;
exports.sumOf = sumOf;
```

배열 내장함수 `reduce` 를 사용해서 배열의 총합을 구해주었습니다. 만약에 여기서 우리가 실수를 했었더라면? 테스트 케이스가 실패하여 바로 알 수 있겠죠?
