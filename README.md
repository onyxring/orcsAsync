___
**_Note:_**
Nov 2023 - This repository as been renamed from Roll20Async to orcsAsync, in order to align it under the OnyxRing Client Scripts (ORCS) umbrella. 
___
# orcsAsync
Adds support for asynchronous code in Roll20 Sheetworkers

### What this script is addressing:  
In the vanilla version of Roll20 platform, Sheetworkers currently lose the character's context with asynchronous callbacks.  For example, the following straightforward code *should* log a character's STR attribute every ten seconds:

```
on("sheet:opened", ()=>{
  setInterval(()=>{
    getAttrs(["str"],(vals)=>{
      log(vals.str);
    });
  },10000);
});
 ```
 
Instead, unfixed, it produces the following error message every ten seconds:

>Character Sheet Error: Trying to do getAttrs when no character is active in sandbox.

The same error happens when trying to access attributes within the `setTimeout()` callback, as well as any attempt to wrap attribute access into Async/Await/Promise patterns.

### Installation
To use this script in your own SheetWorkers, just insert the either the orcsAsync.js file, or the minimized version of that file, orcsAsync.min.js, into the top of your Sheetworker.  This enables `setTimeout()`, `setInterval()`, Promises, and `async/await` syntax to function as expected.

### Examples of use:
When added to your Sheetworker, the `setInterval()` example above will start working, as will similar uses of `setTimeout()`.  These functions now "remember" the character context they were previously loosing.

Additionally, this script provides the following "asynchronous safe" versions of the traditional functions used to access attributes:

```
getAttrsAsync()
setAttrsAsync()
getSectionIDsAsync()
```

These three functions return [Promises](https://javascript.info/async) which are especially useful when used with JavaScript's `async/await` syntax.  For example:

```
on("sheet:opened", async ()=>{
    var values = await getAttrsAsync(["hp","rec"]);
    var newHp=Number(values.hp||0) + Number(values.rec||0);
    await setAttrsAsync({hp:newHp});
    values = await getAttrsAsync(["hp"]);
    console.assert(values.hp==newHp, "Failed");
  });
```
The details of the above example aren't as important as the fact the function `gets`, `sets`, then `gets` again character attributes without needing to define callbacks.

### Part of ORCS
This module is part of the [OnyxRing Client Script](https://github.com/onyxring/ORCS-for-Roll20) collection or scripts for Roll20.

It is a standalone script, with no additional dependencies from other ORCS scripts; however, other scripts in the ORCS collection depend on it.  If you are not using the complete version of ORCS, but are including various standalone members of the collection piecemeal, orcsAsync may already be included by virtue of its inclusion by another member script.


Thanks.

-Jim at OnyxRing
