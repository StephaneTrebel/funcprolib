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
import {
    maybeFlow,
    eitherFlow
} from "funcprolib"

const myMaybe = maybeFlow(
    fn1,
    fn2,
    ...
    fnN
)[.orElse(fnErr)](myStartingValue)

const myEither = eitherFlow(
    fn1,
    fn2,
    ...
    fnN
)[.ifLeft(fnErr)](myStartingValue)
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

`eitherFlow` is my implementation of the *Either* monad.

*eitherFlow: fn[] => A => Either fn[](A)*

In other words, you first call it with any number of functions. It will return you a function. And then you call this function with a value. `eitherFlow`, as its name implies, will convert the given value in a `Either(Left(value))` or `Either(Right(value))`, depending on `value`'s "rightness", and will map all functions in order, starting with your value and passing each and every result through the function list.

A value is defined as "right", if it's not:

- Undefined
- Null
- NaN
- An Error instance

As long as your Either is an Either(Right()), as any Either implementation, functions will be apply in cascade style, but if at some point the cascading value become "not right", as defined above, the process will result in a Either(Left(Something)), where the Something is the "non right" value. Additionnaly, and that's actually the main feature, *all other functions calls are bypassed*. It's either a complete success or an utter failure, but you can also know why it failed in the first place.

Let's say that your "flow" (meaning your function list) is:
```javascript
const myFlow = eitherFlow(
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
// => Either(Right("Hello !"))
```

But calling it with an inappropriate object will fail, as soon as possible:
```javascript
myFlow({
    foo: {
        oups: ":3"
    }
}).toString()
// => Either(Left("Reference Error: bar is not defined"))
```

But, like me and any other sane coder, you want to do something in case the flow failed and you end up with a Either(Left()), So you can chain your flow with `ifLeft` which will have the double advantage of letting you:

- Invoke a callback in case something went wrong, and you ended up with
  a Left(). The callback will be call with the Left() value so that you can act
  upon it.
- Unwrap the resulting value out of the Either(Right()) monad if everything went right

Let the magic happen:
```javascript
myFlow({
    foo: {
        bar: {
            qux: "Hello !"
        }
    }
}).ifLeft(() => console.log("Ouch !"));
// => "Hello !"

myFlow({
    foo: {
        oups: ":3"
    }
}).ifLeft((e) => console.log(`Ouch ! ${e.toString()}`));
// => "Ouch ! Reference Error: bar is not defined"
```

Again, no guard clauses, no try/catch, nothing.
Again, you just go with the flow.

### Oh you want more ?

I may implement some other FP-oriented implementations here, since it's everending wonder of an abstraction universe...let me know if you want me to investigate some particular point of interest !

## Contributing

Well, let's see how it goes first, and we'll see. I'm open to criticism and ideas, though, so feel free to create an Issue :D

## Licence

Do whatever the frack you want with it, as long as you link back to this repo.
So share away !
