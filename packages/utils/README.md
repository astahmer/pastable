# @pastable/utils

A collection of very short utils functions for about anything, without depenencies. Something like a (very) tiny (incomplete) nicely typed lodash.
Some are taken from other open-source projects, such as `Chakra-UI`.

## List of utils

### [Array](./src/array.ts)

-   [`getDiff`](./src/array.ts): Return the difference between left in right
-   [`getSymmetricDiff`](./src/array.ts): Return the difference between left in right / right in left
-   [`getUnion`](./src/array.ts): Return the union between left & right
-   [`getIntersection`](./src/array.ts): Return the intersection between left & right
-   [`hasAll`](./src/array.ts): Checks that all items (right) are in left array
-   [`uniques`](./src/array.ts): Return uniques/de-duplicated values in array
-   [`findBy`](./src/array.ts): Find an item/index from its value using a property path in the array (can be nested using a dot delimited syntax)
-   [`sortBy`](./src/array.ts): Sort an array of objects by a common key in given direction (asc|desc, defaults to asc)
-   [`isEqualArrays`](./src/array.ts): Compare arrays & return true if all members are included (order doesn't matter)
-   [`combineUniqueValues`](./src/array.ts): Combine one or more array into the first one while pushing only distinct unique values
-   [`first`](./src/array.ts): Get first item of array
-   [`last`](./src/array.ts): Get last item of array
-   [`flatMap`](./src/array.ts): Polyfill Array.flatMap
-   [`makeArrayOf`](./src/array.ts): Make an array of {count} empty elements
-   [`chunk`](./src/array.ts): Split an array in chunk of given size
-   [`pluck`](./src/array.ts): Array of picked property
-   [`prependItem](./src/array.ts)`
-   [`appendItem](./src/array.ts)`
-   [`updateItem`](./src/array.ts): Update an object item inside given array, found by passed idPath
-   [`removeValue`](./src/array.ts): Returns array without given value
-   [`removeValueMutate`](./src/array.ts): Same as `removeValue` but mutate original array (useful for Proxy states)
-   [`removeItem`](./src/array.ts): Returns array without given item object
-   [`removeItemObjectMutate`](./src/array.ts): Same as `removeItem` but mutate original array (useful for Proxy states)
-   [`updateAtIndex](./src/array.ts)`
-   [`removeAtIndex](./src/array.ts)`
-   [`removeAtIndexMutate`](./src/array.ts): Same as `removeAtIndex` but mutate original array (useful for Proxy states)
-   [`getPrevItem`](./src/array.ts): Returns prev item from given index, handles looping
-   [`getNextItem`](./src/array.ts): Returns next item from given index, handles looping
-   [`getNextIndex`](./src/array.ts): Returns next index from given index, handles looping
-   [`getPrevIndex`](./src/array.ts): Returns prev index from given index, handles looping
-   [`sortArrayOfObjectByPropFromArray`](./src/array.ts): Sort array of object by given prop using a reference order array, sort items not in reference order in lasts positions

### [Asserts](./src/asserts.ts)`

-   [`isDefined](./src/asserts.ts)`
-   [`isPrimitive`](./src/asserts.ts): Returns true if value is a string|number|boolean
-   [`isObject`](./src/asserts.ts): Returns true if typeof value is object && not null
-   [`isObjectLiteral`](./src/asserts.ts): Returns true if value extends basic Object prototype and is not a Date
-   [`isDate](./src/asserts.ts)`
-   [`isPromise](./src/asserts.ts)`
-   [`isType`](./src/asserts.ts): Can be used as type guard
-   [`isClassRegex](./src/asserts.ts)`
-   [`isClass](./src/asserts.ts)`
-   [`isServer](./src/asserts.ts)`
-   [`isBrowser](./src/asserts.ts)`
-   [`isProd](./src/asserts.ts)`
-   [`isDev](./src/asserts.ts)`
-   [`isTest](./src/asserts.ts)`

### [Getters](./src/getters.ts)`

-   [`getSelf`](./src/getters.ts): Really, it just returns the value you pass
-   [`makeSelfGetters`](./src/getters.ts): Make an object where the keys will have a self getter as value
-   [`firstKey`](./src/getters.ts): Get 1st/only key of object
-   [`firstProp`](./src/getters.ts): Get 1st/only prop of object
-   [`prop`](./src/getters.ts): Make getter on obj[key]

### [Misc](./src/misc.ts)`

-   [`callAll`](./src/misc.ts): Returns a callback that will call all functions passed with the same arguments
-   [`compose`](./src/misc.ts): Compose right-to-left
-   [`pipe`](./src/misc.ts): Compose left-to-right, most commonly used
-   [`wait`](./src/misc.ts): Wait for X ms till resolving promise (with optional callback)
-   [`getInheritanceTree`](./src/misc.ts): Gets given's entity all inherited classes. (taken from `typeorm`)
-   [`on`/](./src/misc.ts)`off`: Shorthand to add an event listener

### [Nested](./src/nested.ts)`

-   [`set`](./src/nested.ts): Sets a nested property value from a dot-delimited path
-   [`get`](./src/nested.ts): Get a nested property value from a dot-delimited path.
-   [`remove`](./src/nested.ts): Remove key at path in an object
-   [`deepMerge`](./src/nested.ts): Deep merge arrays from left into right, can use unique array values for merged properties
-   [`deepSort`](./src/nested.ts): Deeply sort an object's properties using given sort function

### [Object](./src/object.ts)`

-   [`mapper`](./src/object.ts): Map an object to another using given schema, can use a dot delimited path for mapping to nested properties
-   [`reverse`](./src/object.ts): Reverse an object from its schema
-   [`makeInstance`](./src/object.ts): Make an instance of given class auto-filled with record values
-   [`fromEntries`](./src/object.ts): Polyfill Object.fromEntries
-   [`sortObjectKeys`](./src/object.ts): Sort object keys alphabetically
-   [`sortObjKeysFromArray`](./src/object.ts): Sort object keys using an order array

### [Pick](./src/pick.ts)`

-   [`pick`](./src/pick.ts): Pick given properties in object
-   [`pickBy`](./src/pick.ts): Creates an object composed of the picked object properties that satisfies the condition for each value
-   [`pickDefined`](./src/pick.ts): Only pick given properties that are defined in object
-   [`omit`](./src/pick.ts): Omit given properties from object
-   [`format`](./src/pick.ts): Keep only truthy values & format them using a given method
-   [`removeUndefineds`](./src/pick.ts): Remove undefined properties in object
-   [`hasShallowDiff`](./src/pick.ts): Returns true if a value differs between a & b, only check for the first level (shallow)
-   [`getCommonKeys`](./src/pick.ts): Returns keys that are both in a & b
-   [`hasShallowDiffInCommonKeys`](./src/pick.ts): Returns true if a value differs between a & b in their common properties

### [Primitives](./src/primitives.ts)`

-   [`parseStringAsBoolean`](./src/primitives.ts): Parse 'true' and 1 as true, 'false' and 0 as false
-   [`snakeToCamel](./src/primitives.ts)`
-   [`kebabToCamel](./src/primitives.ts)`
-   [`camelToSnake](./src/primitives.ts)`
-   [`camelToKebab](./src/primitives.ts)`
-   [`uncapitalize](./src/primitives.ts)`
-   [`capitalize](./src/primitives.ts)`
-   [`limit`](./src/primitives.ts): Limit a number between a [min,max]
-   [`limitStr`](./src/primitives.ts): Limit a string to a length
-   [`areRectsIntersecting`](./src/primitives.ts): Returns `true` if 2 DOMRect are intersecting (= elements collision)
-   [`getSum`](./src/primitives.ts): Get the sum of an array of number
-   [`forceInt`](./src/primitives.ts): Force a string to number, handle `NaN` by fallbacking to `defaultValue` (= 1 if not provided)
-   [`getPageCount`](./src/primitives.ts): Returns total page count from `itemsCount` & `pageSize`
-   [`roundTo`](./src/primitives.ts): Returns a float rounded to `X` decimals, defaults to 2
-   [`getClosestNbIn`](./src/primitives.ts): Return the closest nb in array, ex: `getClosestNbIn([0, 50, 100, 200], 66); // = 50`
-   [`stringify`](./src/primitives.ts): JSON.stringify wrapped with try/catch
-   [`safeJSONParse`](./src/primitives.ts): JSON.parse wrapped with try/catch

### [Random](./src/random.ts)`

-   [`getRandomString`](./src/random.ts): Return a random string of given length, can be passed a custom alphabet to pick random characters in
-   [`getRandomIntIn`](./src/random.ts): Return a random int between min/max, if only 1 arg (max) is passed then min is set to 0
-   [`getRandomFloatIn`](./src/random.ts): Return a random int between min/max, if only 1 arg (max) is passed then min is set to 0, 3rd arg rounds to X decimals
-   [`getRandomPercent`](./src/random.ts): Return a random nb between [0, 100], can be given the nb of decimals to return, defaults to 2
-   [`pickMultipleUnique`](./src/random.ts): Randomly pick N unique element in array while excluding some if needed
-   [`pickOne`](./src/random.ts): Returns a random element in given array
-   [`pickOneBut`](./src/random.ts): Returns a random element in given array but not of the excluded
-   [`pickOneInEnum`](./src/random.ts): pickOne but for typescript enums
-   [`makeArrayOfRandIn`](./src/random.ts): Make an array of [min, max] empty elements

### [Set](./src/set.ts)`

Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

-   [`getSetDifference](./src/set.ts)`
-   [`isSuperset](./src/set.ts)`
-   [`getSetUnion](./src/set.ts)`
-   [`getSetIntersection](./src/set.ts)`
-   [`getSymmetricDifference](./src/set.ts)`
