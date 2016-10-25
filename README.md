[![Build Status](https://travis-ci.org/StephaneTrebel/funcprolib.svg?branch=master)](https://travis-ci.org/StephaneTrebel/funcprolib)
[![Coverage Status](https://coveralls.io/repos/github/StephaneTrebel/funcprolib/badge.svg?branch=master)](https://coveralls.io/github/StephaneTrebel/funcprolib?branch=master)
[![Code Climate](https://codeclimate.com/github/StephaneTrebel/funcprolib/badges/gpa.svg)](https://codeclimate.com/github/StephaneTrebel/funcprolib)
[![Dependency Status](https://david-dm.org/StephaneTrebel/funcprolib.svg)](https://david-dm.org/StephaneTrebel/funcprolib)
[![devDependency Status](https://david-dm.org/StephaneTrebel/funcprolib/dev-status.svg)](https://david-dm.org/StephaneTrebel/funcprolib##info=devDependencies)

# funcprolib

My personal Functional Programming Library

## So what is this about ?

Functional Programming is awesome, and javascript has the great benefit of letting us easily implement some of the most useful FP paradigms in our daily coding work, both on the frontend and on the backend.

This library is my take on the subject. As time goes on I'll add more and more FP paradigms to help me in my projects, but since I'm publishing it on npm, it can help you yoo !

## How to get started

`npm install --save funcprolib` and rock on !

## How to use

```javascript
import { maybeFlow } from "funcprolib"

const myMaybe = maybeFlow(
    fn1,
    fn2,
    ...
    fnN
)[.orElse(fnErr)](myStartingValue)
```

## API

### maybeFlow

`maybeFlow` is my implementation of the *Maybe* monad.

*maybeFlow: fn[] => A => Maybe fn[](A)*

In other words, you first call it with any number of functions. It will return you a function. And then you call this function with a value. `maybeFlow`, as its name implies, will convert the given value in a `Maybe(value)` and will map all functions in order, starting with your value and passing each and every result through the function list.

As any Maybe implementation, any failure in the process will result in a Maybe(Nothing) and, that's the main point, *all other functions calls are bypassed*. It's either a complete success or an utter failure.

Let's say that your "flow" (meaning your function list) is:
```javascript
const myFlow = maybeFlow(
    (a) => a.foo,
    (b) => b.bar,
    (c) => c.qux
);
```

Calling it with the appropriate object will succeed:
```javascript
myFlow({
    foo: {
        bar: {
            qux: "Hello !"
        }
    }
}).toString();
// => Maybe(Hello !)
```

But calling it with an inappropriate object will fail, as soon as possible:
```javascript
myFlow({
    foo: {
        oups: ":3"
    }
}).toString()
// => Maybe(Nothing)
```

But, like me and any other sane coder, you want to do something in case the flow failed and you end up with a Maybe(Nothing), So you can chain your flow with `orElse` which will have the double advantage of letting you:

- Invoke a callback in case something went wrong
- Unwrap the resulting value out of the Maybe monad if everything went right

Let the magic happen:
```javascript
myFlow({
    foo: {
        bar: {
            qux: "Hello !"
        }
    }
}).orElse(() => console.log("Ouch !"));
// => Hello !

myFlow({
    foo: {
        oups: ":3"
    }
}).orElse(() => console.log("Ouch !"));
// => Ouch !
```

No guard clauses, no try/catch, nothing.
You just go with the flow.

If you need to know why your flow failed, though, you're going to need a little more complex Monad. Enter *Either*.

### eitherFlow

TBD

## Contributing

Well, let's see how it goes first, and we'll see. I'm open to criticism and ideas, though, so feel free to create an Issue :D

## Licence

Do whatever the frack you want with it, as long as you link back to this repo.
So share away !
