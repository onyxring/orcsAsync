___
**_Note:_**
Oct 2023 - Corrects a bug which caused it to fail when used within events triggered by the API.
___
# Roll20Async
Adds support for asynchronous code in Roll20 Sheetworkers

Insert this code into the top of your Sheetworker to enable `setTimeout()`, `setInterval()`, Promises, and `async/await` syntax.

1. What this script is addressing:  
Sheetworkers currently lose the character's context with asynchronous callbacks.  For example, the following straightforward code *should* log a character's STR attribute every ten seconds:

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

2.  Examples of use:
Add this script to your Sheetworker and the `setInterval()` example above will start working, as will similar uses of `setTimeout()`.  These functions now "remember" the character context they were previously loosing.

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

Thanks.

-Jim at OnyxRing
