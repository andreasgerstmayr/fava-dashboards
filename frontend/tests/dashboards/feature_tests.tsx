/// <reference types="./fava-dashboards.d.ts" />
import { defineConfig } from "fava-dashboards";

export default defineConfig({
  dashboards: [
    {
      name: "Variable Chain",
      variables: [
        {
          name: "var1",
          options: async () => {
            await new Promise((r) => setTimeout(r, 1000));
            return ["a", "b", "c"];
          },
        },
        {
          name: "var2",
          options: async ({ variables }) => {
            console.log("options() of var2", variables);
            await new Promise((r) => setTimeout(r, 1000));
            return [1, 2, 3].map((value) => `${variables.var1}_${value}`);
          },
        },
      ],
      panels: [
        {
          title: "Select variable",
          variables: [
            {
              name: "var3",
              options: async ({ variables }) => {
                console.log("options() of var3", variables);
                await new Promise((r) => setTimeout(r, 1000));
                return ["x", "y", "z"].map((value) => `${variables.var2}_${value}`);
              },
            },
          ],
          kind: "html",
          spec: async ({ variables }) => {
            return `
            <h1>Selected Variables</h2>
            <ul>
              <li>var1: ${variables.var1}</li>
              <li>var2: ${variables.var2}</li>
              <li>var3: ${variables.var3}</li>
            </ul>`;
          },
        },
      ],
    },
    {
      name: "Multi-select Variables",
      panels: [
        {
          title: "Select variable",
          variables: [
            {
              name: "multivar1",
              multiple: true,
              options: () => {
                return ["a", "b", "c", "d"];
              },
              default: ["c"],
            },
          ],
          kind: "html",
          spec: async ({ variables }) => {
            console.log("render multi", variables.multivar1);
            return `Selected:  ${variables.multivar1.join(", ")}`;
          },
        },
      ],
    },
  ],
});
