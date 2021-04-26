# @pastable/utils

A collection of very short utils functions for about anything, without depenencies. Something like a (very) tiny (incomplete) nicely typed lodash.

## List of utils

### Array

-   `getDiff`: Return the difference between left in right
-   `getSymmetricDiff`: Return the difference between left in right / right in left
-   `getUnion`: Return the union between left & right
-   `getIntersection`: Return the intersection between left & right
-   `hasAll`: Checks that all items (right) are in left array
-   `uniques`: Return uniques/de-duplicated values in array
-   `findBy`: Find an item/index from its value using a property path in the array (can be nested using a dot delimited syntax)
-   `sortBy`: Sort an array of objects by a common key in given direction (asc|desc, defaults to asc)
-   `isEqualArrays`: Compare arrays & return true if all members are included (order doesn't matter)
-   `combineUniqueValues`: Combine one or more array into the first one while pushing only distinct unique values
-   `first`: Get first item of array
-   `last`: Get last item of array
-   `flatMap`: Polyfill Array.flatMap
-   `makeArrayOf`: Make an array of {count} empty elements
-   `chunk`: Split an array in chunk of given size
-   `pluck`: Array of picked property

### Asserts

-   `isDefined`
-   `isPrimitive`: Returns true if value is a string|number|boolean
-   `isObject`: Returns true if typeof value is object && not null
-   `isObjectLiteral`: Returns true if value extends basic Object prototype and is not a Date
-   `isDate`
-   `isPromise`
-   `isType`: Can be used as type guard
-   `isClassRegex`
-   `isClass`
-   `isServer`
-   `isBrowser`
-   `isProd`
-   `isDev`

### Getters

-   `getSelf`: Really, it just returns the value you pass
-   `makeSelfGetters`: Make an object where the keys will have a self getter as value
-   `firstKey`: Get 1st/only key of object
-   `firstProp`: Get 1st/only prop of object
-   `prop`: Make getter on obj[key]

### Misc

-   `callAll`: Returns a callback that will call all functions passed with the same arguments
-   `compose`: Compose right-to-left
-   `pipe`: Compose left-to-right, most commonly used
-   `wait`: Wait for X ms till resolving promise (with optional callback)
-   `getInheritanceTree`: Gets given's entity all inherited classes. (taken from `typeorm`)
-   `on`/`off`: Shorthand to add an event listener

### Nested

-   `set`: Sets a nested property value from a dot-delimited path
-   `get`: Get a nested property value from a dot-delimited path.
-   `remove`: Remove key at path in an object
-   `deepMerge`: Deep merge arrays from left into right, can use unique array values for merged properties
-   `deepSort`: Deeply sort an object's properties using given sort function

### Object

-   `mapper`: Map an object to another using given schema, can use a dot delimited path for mapping to nested properties
-   `reverse`: Reverse an object from its schema
-   `makeInstance`: Make an instance of given class auto-filled with record values
-   `fromEntries`: Polyfill Object.fromEntries
-   `sortObjectKeys`: Sort object keys alphabetically

### Pick

-   `pick`: Pick given properties in object
-   `pickBy`: Creates an object composed of the picked object properties that satisfies the condition for each value
-   `pickDefined`: Only pick given properties that are defined in object
-   `omit`: Omit given properties from object
-   `format`: Keep only truthy values & format them using a given method
-   `removeUndefineds`: Remove undefined properties in object
-   `hasShallowDiff`: Returns true if a value differs between a & b, only check for the first level (shallow)
-   `getCommonKeys`: Returns keys that are both in a & b
-   `hasShallowDiffInCommonKeys`: Returns true if a value differs between a & b in their common properties

### Primitives

-   `parseStringAsBoolean`: Parse 'true' and 1 as true, 'false' and 0 as false
-   `snakeToCamel`
-   `kebabToCamel`
-   `camelToSnake`
-   `camelToKebab`
-   `uncapitalize`
-   `capitalize`
-   `limit`: Limit a number between a [min,max]

### Random

-   `getRandomString`
-   `getRandomIntInt`
-   `pickMultipleUnique`: Randomly pick N unique element in array while excluding some if needed
-   `pickOne`: Returns a random element in given array
-   `pickOneBut`: Returns a random element in given array but not of the excluded
-   `pickOneInEnum`: pickOne but for typescript enums
-   `makeArrayOfRandIn`: Make an array of [min, max] empty elements

### Set

Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

-   `getSetDifference`
-   `isSuperset`
-   `getSetUnion`
-   `getSetIntersection`
-   `getSymmetricDifference`
