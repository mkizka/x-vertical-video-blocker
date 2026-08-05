import { mkizka } from "@mkizka/eslint-config";
import globals from "globals";

export default [
  ...mkizka,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
  },
];
