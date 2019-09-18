# MR Approvals

## Dependencies

* Yarn
* TypeScript
* ESLint
* Prettier
* Babel

## Approving Conditions

* Disables the **Merge** button for Merge Request with less than 2 approvals.
* Each up votes (👍) counts as an approval, except for self up votes. 
* Down votes (👎) also block the Merge Request.

## Debugging

To debug the extension:
1. In `content.ts`, set the flag `debugging` to `true`.
2. Rebuild the extension with `yarn build`.
3. Load the extension unpacked.

## References

The setup is based in the following articles:

* https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project
* https://devblogs.microsoft.com/typescript/typescript-and-babel-7/
* https://github.com/Microsoft/TypeScript-Babel-Starter
